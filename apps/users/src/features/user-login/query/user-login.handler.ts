import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserLoginQuery } from './user-login.query';
import { UsersQueryService } from '../../../users-query.service';
import { ResponseLoginDto } from 'apps/libs/Users/dto/user/response-login.dto';

@QueryHandler(UserLoginQuery)
export class UserLoginQueryHandler implements IQueryHandler<UserLoginQuery> {
  constructor(private readonly usersQueryService: UsersQueryService) {}
  async execute({ email }: UserLoginQuery): Promise<ResponseLoginDto> {
    return await this.usersQueryService.userLoginQuery(email);
  }
}
