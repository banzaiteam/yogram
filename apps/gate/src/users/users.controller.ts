import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
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
import { Public } from 'apps/gate/common/decorators/public.decorator';

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

  @ApiHeader({
    name: 'Authorization',
    description: ' Authorization with bearer token',
  })
  @ApiOperation({
    summary: 'Find one user by email or id',
  })
  @ApiResponse({ status: 200, description: 'user found' })
  @ApiResponse({ status: 404, description: 'user not found' })
  @ApiQuery({ name: 'id', required: false, type: 'string' })
  @ApiQuery({ name: 'email', required: false, type: 'string' })
  @Get('findone-by')
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
