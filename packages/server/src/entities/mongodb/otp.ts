import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ObjectIdColumn,
} from 'typeorm';

import { encrypt, decrypt } from '../../utility/crypto';

export enum eOtpType {
  mobile = 'mobile',
}

@Entity()
export class Otp extends BaseEntity {
  @ObjectIdColumn()
  _id: string;

  @Column('text')
  type: eOtpType;

  @Column('text')
  identity: string;

  @Column('text')
  code: string;

  @Column('datetime')
  createdAt: Date = new Date();

  // encrypting values before saving it in database.
  @BeforeInsert()
  @BeforeUpdate()
  beforeInsert() {
    this.identity = encrypt(this.identity);
    this.code = encrypt(this.code);
  }

  // decrypting values after fetching it from database.
  @AfterLoad()
  afterLoad() {
    this.identity = decrypt(this.identity);
    this.code = decrypt(this.code);
  }
}
