import { DeepPartial } from 'typeorm';

import { UserDetail } from '../entities/mysql/user-detail';

// manipulating user detail.
export class UserDetailService {
  // creating new entry in user detail.
  async create(data: DeepPartial<UserDetail>): Promise<UserDetail> {
    return UserDetail.create(data).save();
  }
}

export const userDetailService = new UserDetailService();
