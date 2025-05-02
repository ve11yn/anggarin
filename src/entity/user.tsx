import { createContext, useReducer } from "react";

export interface UserState {
    email:string;
    password:string;
    name: string;
    phone:string;
    address: string;
    city:string;
    state:string;
    zip: string;
}

export type UserAction =
  | { type: "SET_USER"; payload: Partial<UserState> };