import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { UserRole } from '../../constants/user-type.enum';
import { UserTokens } from './user-token.entity';

@Entity('users', { schema: 'public' })
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { length: 255 })
  name!: string;

  @Column('character varying', { length: 255, unique: true })
  email!: string;

  @Column('character varying', { nullable: false, select: false })
  password!: string;

  @Column('boolean', { default: () => false })
  status!: boolean;

  @Column({ type: 'enum', enum: UserRole })
  role!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => UserTokens, (userTokens) => userTokens.user)
  userTokens!: UserTokens[];

  isAdmin = (): boolean => this.role === UserRole.ADMIN;
}
