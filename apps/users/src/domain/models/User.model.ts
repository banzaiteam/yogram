import { AggregateRoot } from '@nestjs/cqrs';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { uuid } from 'uuidv4';
import { ClassProperties } from 'apps/libs/types/ClassProperties.type';
import { ProfileModel } from './Profile.model';

export type UserInput = Pick<
  ClassProperties<typeof UserModel>,
  | 'firstName'
  | 'lastName'
  | 'birthdate'
  | 'city'
  | 'country'
  | 'email'
  | 'password'
> &
  Partial<Pick<ClassProperties<typeof UserModel>, 'description'>>;

export class UserModel extends AggregateRoot {
  @IsUUID()
  private _id: string;
  @IsString()
  @IsNotEmpty()
  private _firstName: string;
  @IsString()
  @IsNotEmpty()
  private _lastName: string;
  @IsEmail()
  @IsNotEmpty()
  private _email: string;
  @IsStrongPassword({
    minLength: 4,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  private _password: string;
  @IsNotEmpty()
  private _birthdate: Date;
  @IsString()
  @IsNotEmpty()
  private _country: string;
  @IsString()
  @IsNotEmpty()
  private _city: string;
  @IsOptional()
  // @IsString()
  private _description?: string;
  @IsBoolean()
  private _published: boolean;
  @IsBoolean()
  private _verified: boolean;

  private _createdAt: Date;
  private _updatedAt: Date;
  @IsOptional()
  private _deletedAt: Date | null;
  @IsOptional()
  private _profile?: ProfileModel;

  constructor() {
    super();
  }

  get id() {
    return this._id;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get birthdate() {
    return this._birthdate;
  }

  get city() {
    return this._city;
  }

  get description() {
    return this._description;
  }

  get country() {
    return this._country;
  }

  get published() {
    return this._published;
  }
  get profile() {
    return this._profile;
  }

  get verified() {
    return this._verified;
  }

  get createdAt() {
    return this._createdAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  //flow: create user(without profile) -> create profile -> usermodel.assignProfile(newProfile)
  static create(userArgs: UserInput): UserModel {
    const newUser = new UserModel();
    newUser._id = uuid();
    newUser._firstName = userArgs.firstName;
    newUser._lastName = userArgs.lastName;
    newUser._email = userArgs.email;
    newUser._birthdate = userArgs.birthdate;
    newUser._password = userArgs.password;
    newUser._country = userArgs.country;
    newUser._city = userArgs.city;
    newUser._verified = false;
    newUser._published = true;
    newUser._description = userArgs?.description;
    newUser._createdAt = new Date();
    newUser._updatedAt = newUser.createdAt;
    newUser._deletedAt = null;
    return newUser;
  }

  assignProfile(profile: ProfileModel): void {
    this._profile = profile;
  }
}
