import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../../../../libs/Users/dto/user/create-user.dto';
import { UpdateUserDto } from '../../../../../libs/Users/dto/user/update-user.dto';
import { Profile } from '../../entity/Profile.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { IProfileCommandRepository } from 'apps/users/src/interfaces/command/profile-command.interface';
import { ResponseProfileDto } from '../../../../../../apps/libs/Users/dto/user/response-profile.dto';
import { UpdateProfileDto } from '../../../../../../apps/libs/Users/dto/profile/update-profile.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from '../../entity/Subscriber.entity';

@Injectable()
export class ProfileCommandRepository
  implements
    IProfileCommandRepository<CreateUserDto, UpdateUserDto, ResponseProfileDto>
{
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  // We pass the entity manager into getRepository to ensure that we
  // we run the query in the same context as the transaction.
  async create(
    createProfileDto: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<Profile> {
    const profile = new Profile(createProfileDto);
    if (entityManager) {
      return await entityManager.save(profile);
    }
    return await this.profileRepository.save(profile);
  }

  async update(
    criteria: ProfileUpdateCriteria,
    updateProfileDto: UpdateProfileDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProfileDto> {
    const profile = await this.profileRepository
      .createQueryBuilder('profiles')
      .innerJoin('profiles.user', 'user')
      .where('profiles.id = :id', { id: criteria?.id })
      .orWhere(
        new Brackets((qb) => {
          qb.where('user.id = :userId', { userId: criteria?.userId }).orWhere(
            'user.email = :email',
            {
              email: criteria?.email,
            },
          );
        }),
      )
      .getOne();
    if (!profile) throw new NotFoundException('Profile was not found');
    this.profileRepository.merge(profile, {
      ...updateProfileDto,
    });
    if (entityManager) {
      await entityManager.save(profile);
      return plainToInstance(ResponseProfileDto, profile);
    }
    await this.profileRepository.save(profile);
    return plainToInstance(ResponseProfileDto, profile);
  }
  delete(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile)
      throw new BadRequestException(
        'ProfileCommandRepository error: profile does not exist',
      );
    return profile;
  }

  async getAllProfileSubscribedOn(id: string) {
    return await this.subscriberRepository.find({
      where: { id },
      relations: { profiles: true },
    });
  }

  async subscribe(
    subscriber: string,
    subscribeTo: Profile,
    entityManager?: EntityManager,
  ): Promise<Subscriber> {
    console.log('🚀 ~ subscribeTo:', subscribeTo);
    const subscription = this.subscriberRepository.create();
    subscription.id = subscriber;
    let arr = [];
    arr.push(subscribeTo);
    subscription.profiles = arr;
    return await this.subscriberRepository.save(subscription);
  }
}

export type ProfileUpdateCriteria = {
  id?: string;
  userId?: string;
  email?: string;
};
