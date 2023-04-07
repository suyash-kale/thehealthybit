import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user';

// user detail information.
@Entity()
export class UserDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  first: string;

  @Column('text', { nullable: true })
  last?: string;

  @Column('text', { nullable: true })
  email?: string;

  @Column('datetime')
  createdAt: Date = new Date();

  @Column('datetime')
  updatedAt: Date = new Date();

  // relationships.

  @OneToOne(() => User, (user) => user.detail)
  @JoinColumn()
  user: User;
}
