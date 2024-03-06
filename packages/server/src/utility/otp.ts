import { ENV } from './env';
import { Otp, eOtpType } from '../entities/mongodb/otp';
import { encrypt } from './crypto';
import { TRPCError } from '@trpc/server';

export const send = async (identity: string, type: eOtpType, name = 'user') => {
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
};

export const verify = async (
  identity: string,
  code: string,
  type: eOtpType,
) => {
  // fetching OTP for the identity, type and code.
  const otp = code
    ? await Otp.findOne({
        where: {
          type,
          identity: encrypt(identity),
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
};

export default {
  send,
  verify,
};
