import { SqlCommandBaseRepository } from 'apps/libs/common/abstract/sql-command-base-repository.abstract';
import { User } from '../../entity/User.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SqlUserCommandRepository extends SqlCommandBaseRepository<User> {
  constructor(private DataSource: DataSource) {
    super(DataSource);
  }
}
