import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user';

@Entity()
export class MealType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  label: string;

  @Column('int')
  start: number;

  @Column('int')
  end: number;

  @Column('datetime')
  createdAt: Date = new Date();

  @Column('datetime')
  updatedAt: Date = new Date();

  // relationships.
  @ManyToOne(() => User, (user) => user.mealType)
  @JoinColumn()
  user: User;
}
