import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../../libs/Users/dto/user/create-user.dto';
import {
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseUserDto } from '../../../../apps/libs/Users/dto/user/response-user.dto';
import { FindUserByCriteriaDto } from '../../../../apps/libs/Users/dto/user/find-user-criteria.dto';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { UpdateUserCriteria } from 'apps/libs/Users/dto/user/update-user-criteria.dto';
import { UpdateUserDto } from '../../../../apps/libs/Users/dto/user/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @ApiResponse({ status: 201, description: 'user was created' })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.usersService.create(createUserDto);
    res.status(201);
  }

  @Public()
  @ApiHeader({
    name: 'Authorization',
    description: ' Authorization with bearer token',
  })
  @ApiOperation({
    summary: 'Find user by id | email | username and update it',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'user updated' })
  @ApiResponse({ status: 404, description: 'user not found' })
  @Patch()
  async update(
    @Body()
    payload: UpdateUserCriteria & UpdateUserDto,
  ): Promise<void> {
    const criteria = payload['criteria'];
    const updateUserDto = payload['updateUserDto'];
    return await this.usersService.update(criteria, updateUserDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: ' Authorization with bearer token',
  })
  @ApiOperation({
    summary: 'Find one user by id, email, username or providerId',
  })
  @ApiResponse({
    status: 200,
    description: 'user found',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'user not found' })
  @ApiQuery({ name: 'id', required: false, type: 'string' })
  @ApiQuery({ name: 'email', required: false, type: 'string' })
  @ApiQuery({ name: 'username', required: false, type: 'string' })
  @ApiQuery({ name: 'providerId', required: false, type: 'string' })
  @Get('findone')
  async findUserByCriteria(
    @Query() findUserByCriteriaDto: FindUserByCriteriaDto,
  ): Promise<ResponseUserDto> {
    const user = await this.usersService.findUserByCriteria(
      findUserByCriteriaDto,
    );
    if (!user) throw new NotFoundException();
    return user;
  }
}
