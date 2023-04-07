import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { client } from '../utility/trpc';
import { UserState } from '../state/user';

export const useUser = () => {
  const [user, setUser] = useRecoilState(UserState);

  // checking user is sign in.
  const isSignIn = !!user;

  // checking user is authenticated.
  const isAuth = useCallback(() => {
    return !!user;
  }, [user]);

  // handling user sign in.
  const signIn = useCallback(async (authorization: string) => {
    // save authorization in local storage.
    localStorage.setItem('authorization', authorization);

    // get user information on basis of authorization token.
    try {
      const {
        mobile,
        detail: { first, last, email },
      } = await client.user.me.query();

      // setting user information.
      const u = {
        first,
        last,
        mobile,
        email,
        authorization,
      };
      setUser(u);

      return u;
    } catch (_) {
      // handling error in sign in.
      localStorage.removeItem('authorization');
    }
  }, []);

  // handling user sign out.
  const signOut = useCallback(() => {
    localStorage.removeItem('authorization');
    setUser(null);
  }, []);

  return {
    isSignIn,
    isAuth,
    signIn,
    signOut,
  };
};
