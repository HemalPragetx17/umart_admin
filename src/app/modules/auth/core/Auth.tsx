import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from 'react';
import { LayoutSplashScreen } from '../../../../umart_admin/layout/core';
import { AuthModel, UserModel } from './_models';
import * as authHelper from './AuthHelpers';
import { WithChildren } from '../../../../umart_admin/helpers';
type AuthContextProps = {
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  saveCurrentUser: (auth: UserModel | undefined) => void;
  logout: () => void;
};
const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  saveCurrentUser: () => {},
  logout: () => {},
};
const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);
const useAuth = () => {
  return useContext(AuthContext);
};
let tokenFromUEat: any = '';
if (window?.location?.search && window?.location?.search.includes('token')) {
  let value = window.location.search.split('=')[1];
  if (value) {
    tokenFromUEat = value;
  }
}
const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(
    authHelper.getUser()
  );
  useEffect(() => {
    if (tokenFromUEat) {
      saveAuth(tokenFromUEat);
    }
  }, []);
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };
  const saveCurrentUser = (auth: UserModel | undefined) => {
    setCurrentUser(auth);
    if (auth) {
      authHelper.setUser(auth);
    } else {
      authHelper.removeUser();
    }
  };
  const logout = () => {
    saveAuth(undefined);
    saveCurrentUser(undefined);
  };
  return (
    <AuthContext.Provider
      value={{
        auth,
        saveAuth,
        currentUser,
        saveCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, logout, saveCurrentUser, saveAuth } = useAuth();
  const didRequest = useRef(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    let token = authHelper.getAuth();
    const requestUser = async (apiToken: AuthModel) => {
      try {
        if (!didRequest.current) {
          saveAuth(token);
          let user = authHelper.getUser();
          saveCurrentUser(user);
        }
      } catch (error) {
        console.error(error);
        if (!didRequest.current) {
          logout();
        }
      } finally {
        setShowSplashScreen(false);
      }
      return () => (didRequest.current = true);
    };
    if (token) {
      requestUser(token);
    } else {
      logout();
      setShowSplashScreen(false);
    }
    // eslint-disable-next-line
  }, []);
  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};
export { AuthProvider, AuthInit, useAuth };
