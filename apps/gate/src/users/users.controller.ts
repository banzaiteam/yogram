import { Body, Controller, Get, Patch, Post, Query, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../../libs/Users/dto/user/create-user.dto';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseUserDto } from '../../../../apps/libs/Users/dto/user/response-user.dto';
import { FindUserByCriteriaDto } from '../../../../apps/libs/Users/dto/user/find-user-criteria.dto';
import { UpdateUserCriteria } from 'apps/libs/Users/dto/user/update-user-criteria.dto';
import { UpdateUserDto } from '../../../../apps/libs/Users/dto/user/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { FindUserByCriteriaSwagger } from './decorators/swagger/find-one-by-swagger.decorator';
import { UpdateSwagger } from './decorators/swagger/update-swagger.decorator';
import { UpdateUserWithCriteriaDto } from 'apps/libs/Users/dto/user/update-user-with-criteria.dto';

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

  @UpdateSwagger()
  @Patch()
  async update(
    @Body()
    UpdateUserWithCriteriaDto: UpdateUserWithCriteriaDto,
  ): Promise<void> {
    const criteria = UpdateUserWithCriteriaDto['criteria'];
    const updateUserDto = UpdateUserWithCriteriaDto['updateUserDto'];
    return await this.usersService.update(criteria, updateUserDto);
  }

  @FindUserByCriteriaSwagger()
  @Get('findone')
  async findUserByCriteria(
    @Query() findUserByCriteriaDto: FindUserByCriteriaDto,
  ): Promise<ResponseUserDto> {
    const user = await this.usersService.findUserByCriteria(
      findUserByCriteriaDto,
    );
    return plainToInstance(ResponseUserDto, user);
  }
}
