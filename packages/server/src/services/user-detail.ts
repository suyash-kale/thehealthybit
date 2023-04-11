import { UserDetail } from '../entities/mysql/user-detail';

// manipulating user detail.
export class UserDetailService {
  // creating new entry in user detail.
  async create(data: UserDetail): Promise<UserDetail> {
    const userDetail = new UserDetail();
    userDetail.first = data.first;
    userDetail.last = data.last;
    userDetail.email = data.email;
    userDetail.user = data.user;
    return userDetail.save();
  }
}

export const userDetailService = new UserDetailService();
