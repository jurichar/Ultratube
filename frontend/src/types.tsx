// frontend/src/types.tsx

import { ChangeEvent } from "react";

export interface Movie {
  id: string;
  title: string;
  release: string;
  image: string;
  synopsis: string;
  trailer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}
export type FormInput = { name: string; value: string; placeholder: string; handleChange: (event: ChangeEvent<HTMLInputElement>) => void };
export type AppAction = {
  type: string;
  name: string;
  value: string;
};
export interface ReducerType {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password1: string;
}
