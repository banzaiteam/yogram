import { ClassProperties } from 'apps/libs/types/ClassProperties.type';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { uuid } from 'uuidv4';
import { User } from '../../infrastructure/entity/User.entity';
import { v4 } from 'uuid';

export type ProfileInput = Pick<
  ClassProperties<typeof ProfileModel>,
  'username' | 'userId' | 'createdAt'
>;

export class ProfileModel {
  @IsUUID()
  private _id: string;
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  private _username: string;
  @IsUUID()
  private _userId: string;

  private _createdAt: Date;
  private _updatedAt: Date;
  @IsOptional()
  private _deletedAt?: Date | null;
  // private _user: User;

  get id() {
    return this._id;
  }

  // get user() {
  //   return this._user;
  // }

  get username() {
    return this._username;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(profileArgs: ProfileInput): ProfileModel {
    const newProfile = new ProfileModel();
    newProfile._id = v4();
    newProfile._userId = profileArgs.userId;
    newProfile._username = profileArgs.username;
    newProfile._createdAt = profileArgs.createdAt;
    newProfile._updatedAt = profileArgs.createdAt;
    // todo this property then is missed
    newProfile._deletedAt = profileArgs.createdAt;
    return newProfile;
  }
}
