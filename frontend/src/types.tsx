// frontend/src/types.tsx

import { ChangeEvent, ReactElement, ReactPortal } from "react";

export interface Movie {
  id: string;
  title: string;
  year: number;
  image: string;
  synopsis: string;
  rating: number;
  t_imdb_id?: string;
  imdb_link?: string;
  summary?: string;
  language: string;
  trailer?: string;
  genres: Array<string>;
  length: number;
  torrent?: string;
}
export type YtsMovie = {
  id: string;
  title: string;
  year: number;
  medium_cover_image: string;
  synopsis: string;
  rating: number;
  imdb_code: string;
  summary?: string;
  language: string;
  yt_trailer_code?: string;
  genres: Array<string>;
  runtime: number;
  torrent?: string;
};
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}
export type FormInput = { name: string; value: string; placeholder: string; handleChange: (event: ChangeEvent<HTMLInputElement>) => void };
export type ReducerAction = {
  type: string;
  name: string;
  value: string;
};
export interface LoginType {
  username: string;
  password: string;
}

export interface RegisterType {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password1: string;
}
export type UserData = {
  id?: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  omniauth?: boolean;
};
export type Order = "asc" | "desc";
export type ProfileForm = {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
};

export type NotifyType = {
  type: "success" | "warning" | "error";
  msg: string;
};

export interface UserPatchInterface extends ProfileForm {
  avatar?: string;
}
export type crewUser = {
  character: string;
  known_for_department: string;
  name: string;
  profile_path: string;
};

type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = ReactNodeArray;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

export type Props = {
  children: ReactNode;
};

export type objectFilter = {
  id: number;
  name: string;
  placeholder?: string;
};

export type filter = {
  rating: number;
  genre: string;
  min_year_release: number;
  duration: string | "all" | "u_60" | "60-120" | "a_120";
  name: string;
};
