import React, { Dispatch, SetStateAction } from "react";

export interface AuthUser {
  address?: string;
}

interface IAuthContext {
  isLoggedIn: boolean;
  user?: AuthUser;
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
  setUser?: Dispatch<SetStateAction<AuthUser | undefined>>;
}

const AUTH_INITIAL_VALUES = {
  isLoggedIn: false,
  setIsLoggedIn: undefined,
  user: undefined,
  setUser: undefined,
};

export const AuthContext =
  React.createContext<IAuthContext>(AUTH_INITIAL_VALUES);
