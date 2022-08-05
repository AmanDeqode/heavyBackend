import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Users } from './user.entity';

@Entity('user_tokens', { schema: 'public' })
export class UserTokens extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { nullable: false })
  tokenId!: string;

  @Column('integer', { nullable: false })
  expiresIn!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => Users, (users) => users.userTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: Users;
}
