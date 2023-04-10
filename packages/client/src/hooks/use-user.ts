import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { client } from '../utility/trpc';
import { UserState } from '../state/user';
import { UserType } from '../types/user';

export const useUser = () => {
  const [user, setUser] = useRecoilState(UserState);

  // checking user is sign in.
  const isSignIn = !!user;

  // checking user is authenticated.
  const isAuth = useCallback(() => {
    return !!user;
  }, [user]);

  // handling user sign in.
  const signIn = useCallback(
    (u: UserType) => {
      localStorage.setItem('authorization', u.authorization);
      setUser(u);
    },
    [setUser],
  );

  // handling user sign in.
  const reSignIn = useCallback(async () => {
    // will try to re-sign in the user if the authorization token is present.
    if (localStorage.getItem('authorization')) {
      try {
        // trying to get user information on basis of authorization token.
        const u = await client.user.me.query();
        signIn(u);
        return u;
      } catch (_) {
        // handling error in sign in.
        localStorage.removeItem('authorization');
      }
    }
  }, [signIn]);

  // handling user sign out.
  const signOut = useCallback(() => {
    localStorage.removeItem('authorization');
    setUser(null);
  }, [setUser]);

  return {
    isSignIn,
    isAuth,
    signIn,
    reSignIn,
    signOut,
  };
};
