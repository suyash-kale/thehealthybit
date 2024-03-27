import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { encrypt, decrypt } from '../../utility/crypto';
import { UserDetail } from './user-detail';
import { MealType } from './meal-type';

// base user information.
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  countryCode: string;

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

  // encrypting values before saving it in database.
  @BeforeInsert()
  @BeforeUpdate()
  beforeInsert() {
    this.countryCode = encrypt(this.countryCode);
    this.mobile = encrypt(this.mobile);
  }

  // decrypting values after fetching it from database.
  @AfterLoad()
  afterLoad() {
    this.countryCode = decrypt(this.countryCode);
    this.mobile = decrypt(this.mobile);
  }

  // relationships.
  @OneToOne(() => UserDetail, (userDetail) => userDetail.user)
  detail: Relation<UserDetail>;

  @OneToMany(() => MealType, (mealType) => mealType.user)
  mealType: Array<MealType>;
}
