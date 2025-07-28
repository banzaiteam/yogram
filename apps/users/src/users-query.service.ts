import { Injectable } from '@nestjs/common';
import { IUsersQueryRepository } from './interfaces/query/user-query.interface';
import { ResponseUserDto } from '../../../apps/libs/Users/dto/user/response-user.dto';
import { User } from './infrastructure/entity/User.entity';
import { ResponseLoginDto } from '../../../apps/libs/Users/dto/user/response-login.dto';
import { UserCriteria } from './features/find-by-criteria/query/find-users-by-criteria.query';
import { HttpServices } from '../../../apps/gate/common/constants/http-services.enum';
import { GateService } from '../../../apps/libs/gateService';
import { HttpFilesPath } from '../../../apps/libs/Files/constants/path.enum';
import { GetFilesUrlDto } from '../../../apps/libs/Files/dto/get-files.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersQueryService {
  constructor(
    private readonly userQueryRepository: IUsersQueryRepository<
      User,
      ResponseUserDto
    >,
    private readonly gateService: GateService,
  ) {}
  //
  async userLoginQuery(email: string): Promise<ResponseLoginDto> {
    return await this.userQueryRepository.userLoginQuery(email);
  }

  async findUserByCriteria(
    criteria: UserCriteria,
    entityManager?: EntityManager,
  ): Promise<ResponseUserDto> {
    return await this.userQueryRepository.findUserByCriteria(
      criteria,
      entityManager,
    );
  }

  async findUserByProviderId(providerId: string): Promise<ResponseUserDto> {
    return await this.userQueryRepository.findUserByProviderId(providerId);
  }

  async getAvatars(id: string): Promise<GetFilesUrlDto[]> {
    const key = `path=dev/avatars/${id}`;
    const path = [HttpFilesPath.GetFiles, key].join('?');
    return await this.gateService.requestHttpServiceGet(
      HttpServices.Files,
      path,
      {},
    );
  }
}
