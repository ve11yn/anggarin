import { createContext, useReducer, ReactNode, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../main";

export interface UserState {
    uid: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    fundCount: string;
    totalFund: string;
    remainingFund: string;
    createdAt: string;
    updatedAt: string;
}

const initialState: UserState = {
    uid: "",
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    fundCount: "",
    totalFund: "",
    remainingFund: "",
    createdAt: "",
    updatedAt: ""
};

type UserAction = 
    | { type: "SET_USER"; payload: Partial<UserState> }
    | { type: "LOGOUT" };

const reducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, ...action.payload };
        case "LOGOUT":
            return initialState;
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
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        dispatch({
                            type: "SET_USER",
                            payload: {
                                uid: user.uid,
                                email: user.email || "",
                                ...userDoc.data()
                            }
                        });
                    } else {
                        await setDoc(doc(db, "users", user.uid), {
                            email: user.email,
                            createdAt: new Date().toISOString()
                        });
                        dispatch({
                            type: "SET_USER",
                            payload: {
                                uid: user.uid,
                                email: user.email || "",
                                ...userDoc.data()
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                dispatch({ type: "LOGOUT" });
            }
        });

        return () => unsubscribe();
    }, [auth]);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};