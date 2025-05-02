import {createContext, useReducer, ReactNode} from "react";
import { UserState } from "./user";

const initialState: UserState = {
    email:"",
    password:"",
    name: "",
    phone:"",
    address: "",
    city:"",
    state:"",
    zip: ""
};

type UserAction = {
    type: "SET_USER",
    payload: Partial<UserState>;
}

const reducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, ...action.payload};
        default:
            return state;
    }
};

interface UserContextType {
    state: UserState;
    dispatch: React.Dispatch<UserAction>;
  }
  
  export const UserContext = createContext<UserContextType>({
    state: initialState,
    dispatch: () => null,
  });
  
  export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
      <UserContext.Provider value={{ state, dispatch }}>
        {children}
      </UserContext.Provider>
    );
  };
