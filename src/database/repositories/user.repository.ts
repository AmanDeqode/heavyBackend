import { EntityRepository, FindOneOptions } from 'typeorm';

import { BaseRepository } from './base.repository';
import { Users } from '../entities/user.entity';

@EntityRepository(Users)
export class UsersRepository extends BaseRepository<Users> {
  findByEmail(email: string, options?: FindOneOptions<Users>) {
    return this.findOne(
      {
        email,
      },
      options,
    );
  }
}
