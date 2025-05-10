import { IModelEntityFactory } from 'apps/libs/common/interface/model-entity-factory.interface';
import { UserModel } from '../models/User.model';
import { User } from '../../infrastructure/entity/User.entity';
import { Profile } from '../../infrastructure/entity/Profile.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserModelEntityFactory
  implements IModelEntityFactory<UserModel, User>
{
  toModel(entity: User): UserModel {
    let userModel = UserModel.create(entity);
    userModel.id = entity.id;
    return userModel;
  }

  toEntity(model: UserModel): User {
    // const user = new User();
    // const profile: Profile = {
    //   id: model.profile.id,
    //   username: model.profile.username,
    //   userId: model.profile.userId,
    //   createdAt: model.profile.createdAt,
    //   updatedAt: model.profile.updatedAt,
    //   deletedAt: model.profile.updatedAt,
    //   user: {
    //     id: model.id,
    //     firstName: model.firstName,
    //     lastName: model.lastName,
    //     birthdate: model.birthdate,
    //     city: model.city,
    //     country: model.country,
    //     verified: model.verified,
    //     description: model.description,
    //     email: model.email,
    //     password: model.password,
    //     // profile: user.profile,
    //     createdAt: model.createdAt,
    //     updatedAt: model.updatedAt,
    //     deletedAt: model.deletedAt,
    //   },
    // };
    // user.id = model.id;
    // user.firstName = model.firstName;
    // user.lastName = model.lastName;
    // user.birthdate = model.birthdate;
    // user.city = model.city;
    // user.description = model.description;
    // user.country = model.country;
    // user.verified = model.verified;
    // user.email = model.email;
    // user.password = model.password;
    // user.profile = profile;
    // user.createdAt = model.createdAt;
    // user.updatedAt = model.updatedAt;
    // user.deletedAt = model.deletedAt;
    // return user;
    return;
  }
}
