import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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
import { ResponseUserDto } from '../../../libs/Users/dto/user/response-user.dto';
import { FindUserByCriteriaDto } from '../../../libs/Users/dto/user/find-user-criteria.dto';
import { plainToInstance } from 'class-transformer';
import { FindUserByCriteriaSwagger } from './decorators/swagger/find-one-by-swagger.decorator';
import { UpdateSwagger } from './decorators/swagger/update-swagger.decorator';
import {
  IPagination,
  PaginationParams,
} from '../../../libs/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from '../../../libs/common/pagination/decorators/sorting.decorator';
import { IFiltering } from '../../../libs/common/pagination/decorators/filtering.decorator';
import { Public } from '../../../gate/common/decorators/public.decorator';
import { ResponseProfilePageDto } from '../../../libs/Users/dto/profile/response-profile-page.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfilePageSwagger } from './decorators/swagger/profile-page-swagger.decorator';
import { User } from '../auth/decorators/user.decorator';
import { ResponseSubscriptionsDto } from '../../../libs/Users/dto/profile/response-subscriptions.dto';
import { SubscribeSwagger } from './decorators/swagger/subscribe-swagger.decorator';
import { UnsubscribeDto } from '../../../libs/Users/dto/subscriber/unsubscribe.dto';
import { UnsubscribeSwagger } from './decorators/swagger/unsubscribe-swagger.decorator';
import { GetAllSubscriptionsSwagger } from './decorators/swagger/get-all-subscriptions-swagger.decorator';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { HttpUsersPath } from '../../../libs/Users/constants/path.enum';
import { GetFilesUrlDto } from '../../../libs/Files/dto/get-files.dto';
import { GetAvatarsSwagger } from './decorators/swagger/get-avatars-swagger.decorator';
import { SwitchAvatarSwagger } from './decorators/swagger/switch-avatar-swagger.decorator';
import { DeleteAvatarSwagger } from './decorators/swagger/delete-avatar-swagger.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    @User('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    console.log('🚀 ~ UsersController ~ id:', id);
    try {
      // todo! error 413, bodyparser limit 150 mb does not help when use gateService

      const microserviceResponse = await axios.patch(
        [
          this.configService.get('USERS_SERVICE_URL'),
          HttpUsersPath.Update,
        ].join('/'),
        req,
        {
          headers: { ...req.headers, id },
          responseType: 'stream',
        },
      );

      res.setHeader('content-type', 'application/json');
      microserviceResponse.data.pipe(res);
      res.status(200);
      return null;
    } catch (err) {
      // responseType: 'stream' error handle
      await new Promise((res) => {
        let streamString = '';
        err.response.data.setEncoding('utf8');
        err.response.data
          .on('data', (utf8Chunk) => {
            streamString += utf8Chunk;
          })
          .on('end', async () => {
            err.response.stream = streamString;
          });
        setTimeout(() => {
          res(err);
        }, 300);
      }).then((data) => {
        console.log('🚀 ~ UsersController ~ error update user ~ data:', data);
        throw new HttpException(data, data['status']);
      });
    }
  }

  @Public()
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
    @User('id') loggedUserId: string,
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
    let payload;
    const token = req.headers?.authorization;
    if (token) {
      const accessToken = token.split(' ')[1];
      try {
        payload = await this.jwtService.verifyAsync(accessToken.trim());
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

    let userInfo = await this.usersService.profilePage(
      id,
      pagination,
      sorting,
      filtering,
    );
    // if (payload) {
    return userInfo;
    // }
    // else {
    //   userInfo.posts.items = userInfo.posts.items.filter(
    //     (post) => post.isPublished,
    //   );
    //   return userInfo;
    // }
  }

  @GetAvatarsSwagger()
  @Get('avatars')
  async getAvatarsUrls(@User('id') id: string): Promise<GetFilesUrlDto[]> {
    return await this.usersService.getAvatarsUrls(id);
  }

  @SwitchAvatarSwagger()
  @Patch('avatar/switch')
  async switchAvatar(
    @User('id') id: string,
    @Body('url') url: string,
  ): Promise<void> {
    return await this.usersService.switchAvatar(id, url);
  }

  @DeleteAvatarSwagger()
  @Delete('avatar/delete')
  async deleteAvatar(@User('id') id: string, @Query('url') url: string) {
    return await this.usersService.deleteAvatar(id, url);
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
