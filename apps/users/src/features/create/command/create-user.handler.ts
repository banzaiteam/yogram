import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserModelFactory } from 'apps/users/src/domain/factory/user-model.factory';
import { SqlUserCommandRepository } from 'apps/users/src/infrastructure/adapters/repository/sql-user-command.repository';
import { DataSource } from 'typeorm';
import { User } from 'apps/users/src/infrastructure/entity/User.entity';
import { Profile } from 'apps/users/src/infrastructure/entity/Profile.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userModelFactory: UserModelFactory,
    private readonly repository: SqlUserCommandRepository,
    private dataSource: DataSource,
  ) {}

  async execute({ createUserDto }: CreateUserCommand): Promise<any> {
    const userRepo = this.dataSource.getRepository(User);
    const profileRepo = this.dataSource.getRepository(Profile);
    const user = userRepo.create(createUserDto);
    await userRepo.save(user);
    const profile = profileRepo.create({ ...createUserDto, user });
    await profileRepo.save(profile);
    // const res = await this.repository.save(createUserDto);
    // console.log('🚀 ~ CreateUserHandler ~ execute ~ res:', res);
  }
}
