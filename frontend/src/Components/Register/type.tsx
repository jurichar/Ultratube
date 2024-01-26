import { ChangeEvent } from "react";

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
