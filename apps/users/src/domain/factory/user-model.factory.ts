import { Injectable } from '@nestjs/common';
import { ProfileInput, ProfileModel } from '../models/Profile.model';
import { UserInput, UserModel } from '../models/User.model';

type UserInputWithUsername = UserInput & Pick<ProfileInput, 'username'>;

@Injectable()
export class UserModelFactory {
  create(args: UserInputWithUsername): UserModel {
    const userModel = UserModel.create(args);
    const userId = userModel.id;
    const profileArgs = {
      username: args.username,
      userId: userId,
      createdAt: userModel.createdAt,
    };
    const profile = ProfileModel.create(profileArgs);
    userModel.assignProfile(profile);
    console.log('🚀 ~ UserModelFactory ~ create ~ userModel:', userModel);
    return userModel;
  }
}
