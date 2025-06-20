import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../../libs/Users/dto/user/create-user.dto';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseUserDto } from '../../../../apps/libs/Users/dto/user/response-user.dto';
import { FindUserByCriteriaDto } from '../../../../apps/libs/Users/dto/user/find-user-criteria.dto';
import { plainToInstance } from 'class-transformer';
import { FindUserByCriteriaSwagger } from './decorators/swagger/find-one-by-swagger.decorator';
import { UpdateSwagger } from './decorators/swagger/update-swagger.decorator';
import { UpdateUserWithCriteriaDto } from '../../../../apps/libs/Users/dto/user/update-user-with-criteria.dto';
import {
  IPagination,
  PaginationParams,
} from 'apps/libs/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from 'apps/libs/common/pagination/decorators/sorting.decorator';
import {
  FilteringParams,
  IFiltering,
} from 'apps/libs/common/pagination/decorators/filtering.decorator';
import { Public } from 'apps/gate/common/decorators/public.decorator';
import { ResponseProfilePageDto } from 'apps/libs/Users/dto/profile/response-profile-page.dto';

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
    if (!user) throw new NotFoundException('user was not found');
    return plainToInstance(ResponseUserDto, user);
  }

  @Public()
  @Get('profile/:id/posts')
  async profilePage(
    @Param('id') id: string,
    @PaginationParams() pagination: IPagination,
    @SortingParams(['createdAt', 'isPublished']) sorting?: ISorting,
    @FilteringParams(['isPublished', 'userId']) filtering?: IFiltering,
  ): Promise<ResponseProfilePageDto> {
    const p = await this.usersService.profilePage(
      id,
      pagination,
      sorting,
      filtering,
    );
    console.log('🚀 ~ UsersController ~ p:', p);
    return p;
  }
}
