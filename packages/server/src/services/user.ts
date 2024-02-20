import bcryptjs from 'bcryptjs';
import { TRPCError } from '@trpc/server';

import { ENV } from '../utility/env';
import { User } from '../entities/mysql/user';
import { UserDetail } from '../entities/mysql/user-detail';
import { sign, verify } from '../utility/jwt';
import { userDetailService } from './user-detail';
import { Otp, eOtpType } from '../entities/mongodb/otp';
import { encrypt } from '../utility/crypto';

interface CheckInParams {
  countryCode: string;
  mobile: string;
}

interface VerifyParams {
  countryCode: string;
  mobile: string;
  password: string;
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

// client session type for user.
export interface UserType {
  mobile: User['mobile'];
  authorization: string;
}

interface SessionUserType extends Record<string, unknown> {
  id: User['id'];
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
    // validating user input data.
    await this.validate(data);
    // sending mobile OTP for verification.
    await this.sendOtp(countryCode + mobile, eOtpType.mobile, 'user');
  }

  // signing up new user once verified.
  public async signUp(data: SignUpParams): Promise<UserType> {
    const { countryCode, mobile, code } = data;

    // validating user input data.
    await this.validate(data);

    // fetching OTP for the identity, type and code.
    const otp = code
      ? await Otp.findOne({
          where: {
            type: eOtpType.mobile,
            identity: encrypt(countryCode + mobile),
            code: encrypt(code),
          },
        })
      : null;

    // making sure the OTP is valid.
    if (!otp) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'INVALID-OTP',
      });
    }

    // removing OTP after use.
    otp.remove();

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

    // returning signed up user information.
    return this.me({ id: user.id });
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
    return this.me({ id: user.id });
  }

  // get user information from session authorization token.
  public async me(data: SessionUserType): Promise<UserType> {
    const { id } = data;

    const user = await User.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!user) {
      throw new Error();
    }

    const authorization = this.getAuthorization(data);

    return {
      mobile: user.mobile,
      authorization,
    };
  }

  // sending OTP to user's identity.
  private async sendOtp(identity: string, type: eOtpType, name: string) {
    const code = Math.floor(1000 + Math.random() * 9000); // generating random 4 digit code.
    // saving OTP to database.
    const otp = new Otp();
    otp.type = type;
    otp.identity = identity;
    otp.code = code.toString();
    await otp.save();

    if (ENV.NODE_ENV === 'development') {
      console.log(code);
    } else {
      if (type === eOtpType.mobile) {
        // sending OTP to mobile through MSG91.
        return await (
          await fetch('https://control.msg91.com/api/v5/flow/', {
            method: 'POST',
            headers: {
              authkey: ENV.SMS_AUTH_KEY,
              accept: 'application/json',
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              template_id: '6436e9e3d6fc052a7e3937c2',
              short_url: '0',
              recipients: [{ mobiles: identity, name, code }],
            }),
          })
        ).json();
      }
    }
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
  public decodeAuthorization(
    authorization: UserType['authorization'],
  ): Promise<SessionUserType> {
    return verify<SessionUserType>(authorization);
  }
}

export const userService = new UserService();
