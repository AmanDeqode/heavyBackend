import { EntityRepository } from 'typeorm';
import { UserTokens } from '../entities/user-token.entity';

import { BaseRepository } from './base.repository';

@EntityRepository(UserTokens)
export class UsersTokenRepository extends BaseRepository<UserTokens> {
  getTokensById(userId: string) {
    return this.find({
      where: {
        user: userId,
      },
    });
  }
}
