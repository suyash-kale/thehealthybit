import bcryptjs from 'bcryptjs';
import { TRPCError } from '@trpc/server';

import { ENV } from '../utility/env';
import { SessionUserType } from '../types';
import { User } from '../entities/mysql/user';
import { UserDetail } from '../entities/mysql/user-detail';
import { sign, verify } from '../utility/jwt';
import { userDetailService } from './user-detail';
import { eOtpType } from '../entities/mongodb/otp';
import otp from '../utility/otp';
import { encrypt } from '../utility/crypto';
import { mealTypeService } from './meal-type';

interface CheckInParams {
  countryCode: string;
  mobile: string;
}

interface VerifyParams {
  countryCode: string;
  mobile: string;
}

interface SignUpParams {
  countryCode: string;
  mobile: string;
  password: string;
  code: string;
}

interface SignInParams {
  countryCode: string;
  mobile: string;
  password: string;
}

export interface ForgotParams {
  countryCode: string;
  mobile: string;
  code: string;
  password: string;
}

// client session type for user.
export interface UserType {
  mobile: User['mobile'];
  authorization: string;
}

class UserService {
  // checking if user exist.
  public async exist(data: CheckInParams): Promise<boolean> {
    const { countryCode, mobile } = data;
    // checking mobile is registered.
    return !!(await User.count({
      where: { countryCode: encrypt(countryCode), mobile: encrypt(mobile) },
    }));
  }

  // verifying signing up requests.
  public async verify(data: VerifyParams): Promise<void> {
    const { countryCode, mobile } = data;
    // sending mobile OTP for verification.
    await otp.send(countryCode + mobile, eOtpType.mobile);
  }

  // signing up new user once verified.
  public async signUp(data: SignUpParams): Promise<UserType> {
    const { countryCode, mobile, code } = data;

    // validating user input data.
    await this.validate(data);

    // verifying mobile otp.
    await otp.verify(countryCode + mobile, code, eOtpType.mobile);

    // hashing password.
    const password = await bcryptjs.hash(data.password, ENV.SALT_LENGTH);

    // saving user.
    const user = new User();
    user.countryCode = countryCode;
    user.mobile = mobile;
    user.password = password;
    await user.save();

    // saving user details.
    const userDetail = new UserDetail();
    userDetail.user = user;
    await userDetailService.create(userDetail);

    // adding default meal types for the user.
    await Promise.all([
      mealTypeService.create({
        label: 'Breakfast',
        start: 8,
        end: 10,
        user,
      }),
      mealTypeService.create({
        label: 'Lunch',
        start: 12,
        end: 14,
        user,
      }),
      mealTypeService.create({
        label: 'Snack',
        start: 17,
        end: 19,
        user,
      }),
      mealTypeService.create({
        label: 'Dinner',
        start: 20,
        end: 22,
        user,
      }),
    ]);

    // returning signed up user information.
    return this.me(user);
  }

  // signing in user through mobile and password.
  public async signIn({
    countryCode,
    mobile,
    password,
  }: SignInParams): Promise<UserType> {
    // loading user with the mobile number.
    const user = await User.findOne({
      where: { countryCode: encrypt(countryCode), mobile: encrypt(mobile) },
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
    return this.me(user);
  }

  // get user information from session authorization token.
  public async me(user: User): Promise<UserType> {
    if (!user) {
      throw new Error();
    }

    const authorization = this.getAuthorization({ id: user.id });

    return {
      mobile: user.mobile,
      authorization,
    };
  }

  // forgot password for user through otp verification.
  public async forgot(data: ForgotParams): Promise<void> {
    const { countryCode, mobile, code } = data;

    // loading user with the mobile number.
    const user = await User.findOne({
      where: { countryCode: encrypt(countryCode), mobile: encrypt(mobile) },
    });

    // making sure the mobile is available.
    if (!user) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'MOBILE-NOT-REGISTERED',
      });
    }

    // verifying mobile OTP for verification.
    await otp.verify(countryCode + mobile, code, eOtpType.mobile);

    // hashing password.
    const password = await bcryptjs.hash(data.password, ENV.SALT_LENGTH);

    // updating user password.
    user.password = password;
    await user.save();
  }

  // validating user input data.
  private async validate(data: VerifyParams): Promise<void> {
    const { countryCode, mobile } = data;
    // checking mobile is already registered.
    if (
      await User.findOne({
        where: { countryCode: encrypt(countryCode), mobile: encrypt(mobile) },
      })
    ) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'MOBILE-ALREADY-REGISTERED',
      });
    }
  }

  // generating authorization token for user session from user id.
  private getAuthorization(data: SessionUserType): string {
    return sign(data);
  }

  // decoding authorization token for user session.
  public async decodeAuthorization(
    authorization: UserType['authorization'],
  ): Promise<null | User> {
    const { id } = await verify<SessionUserType>(authorization);
    return await User.findOne({ where: { id } });
  }
}

export const userService = new UserService();
