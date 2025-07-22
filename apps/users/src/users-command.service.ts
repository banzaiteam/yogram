import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../../../apps/libs/Users/dto/user/create-user.dto';
import { DataSource, QueryFailedError } from 'typeorm';
import { UpdateUserDto } from '../../../apps/libs/Users/dto/user/update-user.dto';
import { CreateProfileDto } from '../../../apps/libs/Users/dto/profile/create-profile.dto';
import { IUserCommandRepository } from './interfaces/command/user-command.interface';
import { ResponseUserDto } from '../../../apps/libs/Users/dto/user/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserCriteria } from '../../../apps/libs/Users/dto/user/update-user-criteria.dto';
import { CreateProviderDto } from '../../../apps/libs/Users/dto/provider/create-provider.dto';
import { UpdateProviderDto } from '../../../apps/libs/Users/dto/provider/update-provider.dto';
import { OauthProviders } from '../../../apps/libs/Users/constants/oauth-providers.enum';
import { GoogleSignupDto } from '../../../apps/libs/Users/dto/user/google-signup.dto';
import { CreateUserByProviderDto } from '../../../apps/libs/Users/dto/user/create-user-by-provider.dto';
import { genUserName } from './utils/gen-username.util';
import { UsersQueryService } from './users-query.service';
import { ProviderCommandService } from './provider-command.service';
import { ProfileCommandService } from './profile-command.service';
import { UploadFile } from 'apps/libs/common/chunks-upload/interfaces/upload-file.interface';
import { ChunksFileUploader } from '../../../apps/libs/common/chunks-upload/chunks-file-uploader.service';
import fs, { readdir } from 'fs/promises';
import { HttpFilesPath } from '../../../apps/libs/Files/constants/path.enum';
import { ConfigService } from '@nestjs/config';
import { FileTypes } from '../../../apps/libs/Files/constants/file-type.enum';
import { FilesRoutingKeys } from '../../../apps/files/src/features/files/message-brokers/rabbit/files-routing-keys.constant';
import { uuid } from 'uuidv4';
import { v4 } from 'uuid';

export type GoogleResponse = { user: ResponseUserDto; created?: boolean };

@Injectable()
export class UsersCommandService {
  constructor(
    private dataSource: DataSource,
    private readonly userCommandRepository: IUserCommandRepository<
      CreateUserDto,
      UpdateUserDto
    >,
    private readonly chunksFileUploader: ChunksFileUploader,
    private readonly profileCommandService: ProfileCommandService,
    private readonly providerCommandService: ProviderCommandService,
    private readonly usersQueryService: UsersQueryService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    bucketName: string,
    file?: Express.Multer.File[],
  ): Promise<ResponseUserDto> {
    console.log('🚀 ~ UsersCommandService ~ createUserDto:', createUserDto);
    if (!Array.isArray(file)) {
      const files = file;
      file = [];
      file.push(files);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userCommandRepository.create(
        createUserDto,
        queryRunner.manager,
      );

      const createProfileDto: CreateProfileDto = {
        user,
        username: createUserDto.username,
        aboutMe: createUserDto.aboutMe,
      };
      await this.profileCommandService.create(
        createProfileDto,
        queryRunner.manager,
      );

      Object.keys(OauthProviders).forEach(async (key) => {
        const providerDto: CreateProviderDto = {
          user,
          type: OauthProviders[key],
        };
        await this.providerCommandService.create(
          providerDto,
          queryRunner.manager,
        );
      });

      if (file.length && file[0] !== null) {
        const uploadFile: UploadFile[] = [
          {
            fileType: FileTypes.Avatars,
            filesUploadBaseDir: this.configService.get(
              'FILES_SERVICE_AVATAR_UPLOAD_PATH',
            ),
            fieldname: file[0].fieldname,
            mimetype: file[0].mimetype,
            size: file[0].size,
            path: file[0].path,
            fileId: createUserDto.id,
            originalname: file[0].filename,
            destination: file[0].destination,
            bucketName,
          },
        ];
        console.log('🚀 ~ UsersCommandService ~ uploadFile:', uploadFile);

        const uploadServiceUrl = [
          this.configService.get('FILES_SERVICE_URL'),
          HttpFilesPath.Upload,
        ].join('/');

        this.sendFilesToFilesServiceAndDeleteTempFilesAfter(
          createUserDto.id,
          uploadFile,
          [createUserDto.id].join('/'),
          uploadServiceUrl,
        );
      }

      await queryRunner.commitTransaction();
      return plainToInstance(ResponseUserDto, user);
    } catch (error) {
      console.log('🚀 ~ UsersCommandService ~ createUser ~ error:', error);
      await queryRunner.rollbackTransaction();
      if (error instanceof QueryFailedError) {
        if ((error['code'] = '23505')) {
          throw new ConflictException(
            `UsersCommandService error: user with this ${error['detail'].substring(error['detail'].indexOf('(') + 1, error['detail'].indexOf(')'))} already exists`,
          );
        }
        if ((error['code'] = '23503')) {
          throw new BadRequestException(
            'UsersCommandService error: 23503, primary key does not exist on user creation',
          );
        }
      }
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createUserGoogle(
    googleSignupDto: GoogleSignupDto,
  ): Promise<GoogleResponse> {
    // form user does not exists so create provider entity and merge to the form user
    const queryRunner = this.dataSource.createQueryRunner();
    if (!googleSignupDto.user) {
      try {
        let username = googleSignupDto.username;
        const userWithTheSameUserName =
          await this.usersQueryService.findUserByCriteria({
            username: googleSignupDto.username,
          });
        // if any user with username from provider already exists we should generate the new one
        // if user from provider hasnt username we generate it from provider email
        if (userWithTheSameUserName || !username) {
          const isUsername = googleSignupDto.username ? true : false;
          const usernameFromUsernameOrEmail: string = isUsername
            ? googleSignupDto.username
            : googleSignupDto.email.substring(
                0,
                googleSignupDto.email.indexOf('@'),
              );
          username = await genUserName(
            usernameFromUsernameOrEmail,
            this.usersQueryService,
          );
        }
        await queryRunner.startTransaction();
        // create user
        const createUserDto: CreateUserByProviderDto = {
          firstName: null,
          lastName: null,
          email: googleSignupDto.email,
          username,
          verified: true,
        };
        const user = await this.userCommandRepository.create(
          createUserDto,
          queryRunner.manager,
        );
        // create profile
        const createProfileDto: CreateProfileDto = {
          user,
          username: createUserDto.username,
          aboutMe: createUserDto.aboutMe,
        };
        await this.profileCommandService.create(
          createProfileDto,
          queryRunner.manager,
        );
        // create provider
        const createProviderDto: CreateProviderDto = {
          email: googleSignupDto.email,
          username: username,
          providerId: googleSignupDto.providerId,
          type: OauthProviders.Google,
          user,
        };
        await this.providerCommandService.create(
          createProviderDto,
          queryRunner.manager,
        );
        await queryRunner.commitTransaction();
        const fullUser = await this.usersQueryService.findUserByCriteria({
          email: createUserDto.email,
        });
        return {
          user: plainToInstance(ResponseUserDto, fullUser),
          created: true,
        };
      } catch (error) {
        console.log('🚀 ~ UsersCommandService ~ error:', error);
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(error);
      } finally {
        await queryRunner.release();
      }
    }
    // form user exists so merge it to the provider entity
    else {
      // todo realize with transaction there, maybe not needed
      // update provider's username, email, providerId
      // const queryRunner = this.dataSource.createQueryRunner();
      const providerUpdateDto: UpdateProviderDto = {
        username: googleSignupDto.user.username,
        email: googleSignupDto.user.email,
        providerId: googleSignupDto.providerId,
      };

      await this.providerCommandService.update(
        { userId: googleSignupDto.user.id, type: 'google' },
        providerUpdateDto,
        queryRunner.manager,
      );
      const user = await this.usersQueryService.findUserByCriteria({
        providerId: googleSignupDto.providerId,
      });
      return { user };
    }
  }

  sendFilesToFilesServiceAndDeleteTempFilesAfter(
    userId: string,
    files: UploadFile[],
    filesServiceUploadFolderWithoutBasePath: string,
    uploadServiceUrl: string,
  ) {
    new Promise((res, rej) => {
      res(
        this.chunksFileUploader.proccessChunksUpload(
          FilesRoutingKeys.FilesUploadedAvatars,
          files,
          filesServiceUploadFolderWithoutBasePath,
          uploadServiceUrl,
        ),
      );
      rej(
        new InternalServerErrorException(
          'PostCommandService: photos was not uploaded',
        ),
      );
    })
      .then(async () => {
        await fs.rm(files[0].destination, { recursive: true });
      })
      .catch(async (err) => {
        console.log('error in user-command-service.........', err);
        // todo? delete post event
        // it delete db post and related files in aws
        await fs.rm(files[0].destination, { recursive: true });
      });
  }

  async updateUser(
    criteria: UpdateUserCriteria,
    updateUserDto: UpdateUserDto,
    bucketName: string,
    file?: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (file) {
        const uploadFile: UploadFile[] = [
          {
            fileType: FileTypes.Avatars,
            filesUploadBaseDir: this.configService.get(
              'FILES_SERVICE_AVATAR_UPLOAD_PATH',
            ),
            fieldname: file.fieldname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            fileId: v4(),
            originalname: file.filename,
            destination: file.destination,
            bucketName,
          },
        ];

        const uploadServiceUrl = [
          this.configService.get('FILES_SERVICE_URL'),
          HttpFilesPath.Upload,
        ].join('/');

        this.sendFilesToFilesServiceAndDeleteTempFilesAfter(
          criteria.id,
          uploadFile,
          [criteria.id].join('/'),
          uploadServiceUrl,
        );
      }
      const updatedUser = await this.userCommandRepository.update(
        criteria,
        updateUserDto,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return plainToInstance(ResponseUserDto, updatedUser);
    } catch (err) {
      console.log('🚀 ~ UsersCommandService ~ err:', err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async emailVerify(email: string): Promise<void> {
    const verifyEmailDto = { verified: true };
    const queryRunner = this.dataSource.createQueryRunner();
    const findCriteria = { email: email };
    await this.userCommandRepository.update(
      findCriteria,
      verifyEmailDto,
      queryRunner.manager,
    );
  }
}
