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

export type GoogleResponse = { user: ResponseUserDto; created?: boolean };

@Injectable()
export class UsersCommandService {
  constructor(
    private dataSource: DataSource,
    private readonly userCommandRepository: IUserCommandRepository<
      CreateUserDto,
      UpdateUserDto
    >,
    private readonly profileCommandService: ProfileCommandService,
    private readonly providerCommandService: ProviderCommandService,
    private readonly usersQueryService: UsersQueryService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    console.log(
      '🚀 ~ UsersCommandService ~ createUser ~ createUserDto:',
      createUserDto,
    );
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
      console.log(
        '🚀 ~ UsersCommandService ~ createUser ~ createProfileDto:',
        createProfileDto,
      );
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

      await queryRunner.commitTransaction();
      return plainToInstance(ResponseUserDto, user);
    } catch (error) {
      console.log('🚀 ~ UsersCommandService ~ createUser ~ error:', error);
      await queryRunner.rollbackTransaction();
      if (error instanceof QueryFailedError) {
        if ((error['code'] = '23505')) {
          throw new ConflictException(
            `user with this ${error['detail'].substring(error['detail'].indexOf('(') + 1, error['detail'].indexOf(')'))} already exists`,
          );
        }
        if ((error['code'] = '23503')) {
          throw new BadRequestException();
        }
      }
      throw new InternalServerErrorException(error);
    } finally {
      console.log('finally');
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

  async updateUser(
    criteria: UpdateUserCriteria,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    const updatedUser = await this.userCommandRepository.update(
      criteria,
      updateUserDto,
      queryRunner.manager,
    );
    return plainToInstance(ResponseUserDto, updatedUser);
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
