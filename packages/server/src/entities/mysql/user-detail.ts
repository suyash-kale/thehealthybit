import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { encrypt, decrypt } from '../../utility/crypto';
import { User } from './user';

// user detail information.
@Entity()
export class UserDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  first?: string;

  @Column('text', { nullable: true })
  last?: string;

  @Column('text', { nullable: true })
  email?: string;

  @Column('datetime')
  createdAt: Date = new Date();

  @Column('datetime')
  updatedAt: Date = new Date();

  // encrypting values before saving it in database.
  @BeforeInsert()
  @BeforeUpdate()
  beforeInsert() {
    if (this.first) {
      this.first = encrypt(this.first);
    }
    if (this.last) {
      this.last = encrypt(this.last);
    }
    if (this.email) {
      this.email = encrypt(this.email);
    }
  }

  // decrypting values after fetching it from database.
  @AfterLoad()
  afterLoad() {
    if (this.first) {
      this.first = decrypt(this.first);
    }
    if (this.last) {
      this.last = decrypt(this.last);
    }
    if (this.email) {
      this.email = decrypt(this.email);
    }
  }

  // relationships.
  @OneToOne(() => User, (user) => user.detail)
  @JoinColumn()
  user: User;
}
