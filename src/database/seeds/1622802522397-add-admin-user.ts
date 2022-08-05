import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { hash } from 'bcryptjs';
import { Users } from '../entities/user.entity';
import { UserRole } from '../../constants/user-type.enum';

export class addAdminUser1622802522397 implements MigrationInterface {
  IDS = {
    ADMIN: '706dd907-3b96-4ad7-84a4-f5ac91ebd68c',
  };
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.manager.getRepository(Users);
    const user = userRepo.create({
      id: this.IDS.ADMIN,
      name: 'Demo user',
      email: 'demo@deqode.com',
      password: await hash('password', 10),
      status: true,
      role: UserRole.ADMIN,
    });
    await user.save();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.manager.getRepository(Users);
    await userRepo.delete({ id: In(Object.values(this.IDS)) });
  }
}
