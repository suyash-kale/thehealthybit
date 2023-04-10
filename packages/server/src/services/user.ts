import bcryptjs from 'bcryptjs';
import { TRPCError } from '@trpc/server';

import { ENV } from '../utility/env';
import { User } from '../entities/mysql/user';
import { UserDetail } from '../entities/mysql/user-detail';
import { sign, verify } from '../utility/jwt';
import { userDetailService } from './user-detail';

// parameters for signing up new user.
interface SignUpParams {
  mobile: string;
  password: string;
  first: string;
  last?: string;
  email?: string;
}

// parameters for signing in user.
interface SignInParams {
  mobile: string;
  password: string;
}

// client session type for user.
export interface UserType {
  first: UserDetail['first'];
  last?: UserDetail['last'];
  mobile: User['mobile'];
  email?: UserDetail['email'];
  authorization: string;
}

interface SessionUserType extends Record<string, unknown> {
  id: User['id'];
}

// manipulating user.
class UserService {
  // signing up new user.
  async signUp(data: SignUpParams): Promise<UserType> {
    const { mobile, first, last, email } = data;

    // checking mobile is already registered.
    if (await User.findOne({ where: { mobile } })) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'MOBILE-ALREADY-REGISTERED',
      });
    }

    // hashing password.
    const password = await bcryptjs.hash(data.password, ENV.SALT_LENGTH);

    // saving user.
    const user = new User();
    user.mobile = mobile;
    user.password = password;
    await user.save();

    // saving user details.
    const userDetail = new UserDetail();
    userDetail.first = first;
    userDetail.last = last;
    userDetail.email = email;
    userDetail.user = user;
    await userDetailService.create(userDetail);

    // returning signed up user information.
    return this.me({ id: user.id });
  }

  // generating authorization token for user session from user id.
  getAuthorization(data: SessionUserType): string {
    return sign(data);
  }

  // decoding authorization token for user session.
  decodeAuthorization(
    authorization: UserType['authorization'],
  ): Promise<SessionUserType> {
    return verify<SessionUserType>(authorization);
  }

  // signing in user through mobile and password.
  async signIn({ mobile, password }: SignInParams): Promise<UserType> {
    // loading user with the mobile number.
    const user = await User.findOne({
      where: { mobile },
    });

    // check if mobile is registered.
    if (!user) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'MOBILE-NOT-REGISTERED',
      });
    }

    // comparing the user entered password with the stored hashed password.
    if (!(await bcryptjs.compare(password, user.password))) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'PASSWORD-INCORRECT',
      });
    }

    // returning signed in user information.
    return this.me({ id: user.id });
  }

  // get user information from session authorization token.
  async me(data: SessionUserType): Promise<UserType> {
    const { id } = data;

    const user = await User.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!user) {
      throw new Error('Unable to fetch you information.');
    }

    const authorization = this.getAuthorization(data);

    return {
      first: user.detail.first,
      last: user.detail.last,
      mobile: user.mobile,
      email: user.detail.email,
      authorization,
    };
  }
}

export const userService = new UserService();
