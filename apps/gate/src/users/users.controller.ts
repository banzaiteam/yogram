import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../../libs/Users/dto/user/create-user.dto';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ResponseUserDto } from '../../../../apps/libs/Users/dto/user/response-user.dto';
import { FindUserByCriteriaDto } from '../../../../apps/libs/Users/dto/user/find-user-criteria.dto';
import { plainToInstance } from 'class-transformer';
import { FindUserByCriteriaSwagger } from './decorators/swagger/find-one-by-swagger.decorator';
import { UpdateSwagger } from './decorators/swagger/update-swagger.decorator';
import { UpdateUserWithCriteriaDto } from '../../../../apps/libs/Users/dto/user/update-user-with-criteria.dto';
import {
  IPagination,
  PaginationParams,
} from '../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from '../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { IFiltering } from '../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { ResponseProfilePageDto } from '../../../../apps/libs/Users/dto/profile/response-profile-page.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfilePageSwagger } from './decorators/swagger/profile-page-swagger.decorator';
import { User } from '../auth/decorators/user.decorator';
import { ResponseSubscriptionsDto } from '../../../../apps/libs/Users/dto/profile/response-subscriptions.dto';
import { SubscribeSwagger } from './decorators/swagger/subscribe-swagger.decorator';
import { UnsubscribeDto } from '../../../../apps/libs/Users/dto/subscriber/unsubscribe.dto';
import { UnsubscribeSwagger } from './decorators/swagger/unsubscribe-swagger.decorator';
import { GetAllSubscriptionsSwagger } from './decorators/swagger/get-all-subscriptions-swagger.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  //
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

  @Public()
  @ProfilePageSwagger()
  @Get(':id/profile')
  async profilePage(
    @Param('id') id: string,
    @Req() req: Request,
    @PaginationParams() pagination: IPagination,
    @SortingParams(['createdAt', 'isPublished']) sorting?: ISorting,
  ): Promise<ResponseProfilePageDto> {
    const filtering: IFiltering = {
      filterProperty: 'userId',
      rule: 'eq',
      value: id,
    };
    let allowScroll: boolean = false;
    const token = req.headers?.authorization;
    if (token) {
      const accessToken = token.split(' ')[1];
      try {
        let payload = await this.jwtService.verifyAsync(accessToken.trim());
        if (payload.id && payload.id === id) {
          allowScroll = true;
        }
      } catch (error) {
        throw new BadRequestException(
          'UsersController error: invalid token on profilePage',
        );
      }
    }
    if (!allowScroll) {
      pagination.page = 1;
    }

    return await this.usersService.profilePage(
      id,
      pagination,
      sorting,
      filtering,
    );
  }

  @SubscribeSwagger()
  @Post('subscribe')
  async subscribe(
    @User('id') id: string,
    @Body('subscribeTo') subscribeTo: string,
  ): Promise<void> {
    return await this.usersService.subscribe(id, subscribeTo);
  }

  @UnsubscribeSwagger()
  @Delete('unsubscribe')
  async unsubscribe(
    @User('id') id: string,
    @Body() unsubscribeFrom: UnsubscribeDto,
  ): Promise<void> {
    return await this.usersService.unsubscribe(
      id,
      unsubscribeFrom.unsubscribeFrom,
    );
  }

  @GetAllSubscriptionsSwagger()
  @Get('subscriptions')
  async getAllSubscriptions(
    @User('id') id: string,
  ): Promise<ResponseSubscriptionsDto> {
    return await this.usersService.getAllSubscriptions(id);
  }
}
