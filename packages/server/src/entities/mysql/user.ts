import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { UserDetail } from './user-detail';

// base user information.
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  mobile: string;

  @Column('text')
  password: string;

  @Column('datetime')
  createdAt: Date = new Date();

  @Column('datetime')
  updatedAt: Date = new Date();

  @Column('boolean')
  active = true;

  // relationships.

  @OneToOne(() => UserDetail, (userDetail) => userDetail.user)
  detail: Relation<UserDetail>;
}
