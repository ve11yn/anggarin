import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Children, createContext, ReactNode, useContext, useReducer } from "react";
import { db } from "../main";

export interface FundRequest {
    requestId: string;
    planId: string;
    requesterId: string; // user uid yang request
    fundAmount: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    approverId?: string;
    transactionHash?: string; // blockchain hash 
}

interface FundRequestState {
    requests: FundRequest[];
    currentRequest: FundRequest | null;
}

type FundRequestAction =
  | { type: "SET_REQUESTS"; payload: FundRequest[] }
  | { type: "SET_CURRENT_REQUEST"; payload: FundRequest }
  | { type: "ADD_REQUEST"; payload: FundRequest }
  | { type: "UPDATE_REQUEST"; payload: FundRequest };


const FundRequestContext = createContext<{
    state: FundRequestState;
    createRequest: (request: Omit<FundRequest, "requestId" | "status" | "createdAt">) => Promise<string>;
    getRequest: (requestId: string) => Promise<FundRequest | null>;
    approveRequest: (requestId: string, approverId:string) => Promise<void>;
    rejectRequest: (requestId:string, rejectorId: string) => Promise<void>;
    completeRequest: (requestId: string, txHash: string) => Promise<void>;
    getPlanRequests: (planId: string) => Promise<FundRequest[]>;
    getUserRequests: (userId: string) => Promise<FundRequest[]>;
}>(null!);

// what is promise, omit, request snap, explain me every basics and in firebase what is doc, getdoc, requestdoc etc etc make me know


const FundRequestReducer = (state: FundRequestState, action: FundRequestAction): FundRequestState => {
    switch (action.type) {
      case "SET_REQUESTS":
        return { ...state, requests: action.payload };
      case "SET_CURRENT_REQUEST":
        return { ...state, currentRequest: action.payload };
      case "ADD_REQUEST":
        return { ...state, requests: [...state.requests, action.payload] };
      case "UPDATE_REQUEST":
        return {
          ...state,
          requests: state.requests.map(req =>
            req.requestId === action.payload.requestId ? action.payload : req
          ),
          currentRequest: state.currentRequest?.requestId === action.payload.requestId 
            ? action.payload 
            : state.currentRequest
        };
      default:
        return state;
    }
  };


export const FundRequestProvider = ({Children}: {Children: ReactNode}) => {
    const [state, dispatch] = useReducer(FundRequestReducer, {
        requests: [],
        currentRequest: null
    });

    const createRequest = async (request: Omit<FundRequest, "requestId" | "status" | "createdAt">) => {
        const requestRef = doc(collection(db, "fundRequest"));
        const newRequest: FundRequest = {
            ...request,
            requestId: requestRef.id,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        await setDoc(requestRef, newRequest);
        dispatch({type: "ADD_REQUEST", payload: newRequest});
        return requestRef.id;
    };

    const getRequest = async (requestId: string) => {
        const requestSnap = await getDoc(doc(db, "fundRequest", requestId));
        if (requestSnap.exists()){
            const request = requestSnap.data() as FundRequest;
            dispatch({type: "SET_CURRENT_REQUEST", payload: request});
            return request;
        }
        return null;
    };

    const approveRequest = async (requestId: string, approverId: string) => {
        const update: Partial<FundRequest> = {
            status: "approved",
            approverId: approverId,
            approvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await updateDoc(doc(db, "fundRequest", requestId), update);
        const updatedRequest = await getRequest(requestId);
        if (updatedRequest){
            dispatch({type: "UPDATE_REQUEST", payload: updatedRequest});
        }
    };

    const rejectRequest = async (requestId: string, rejectorId: string) => {
        const update: Partial<FundRequest> = {
            status: "rejected",
            approverId: rejectorId,
            updatedAt: new Date().toISOString()
        };

        await updateDoc(doc(db, "fundRequests", requestId), update);
        const updatedRequest = await getRequest(requestId);
        if (updatedRequest) {
        dispatch({ type: "UPDATE_REQUEST", payload: updatedRequest });
        }
    };

    const completeRequest = async (requestId: string, txHash: string) => {
        const update: Partial<FundRequest> = {
          status: "completed",
          transactionHash: txHash,
          updatedAt: new Date().toISOString()
        };
        
        await updateDoc(doc(db, "fundRequests", requestId), update);
        const updatedRequest = await getRequest(requestId);
        if (updatedRequest) {
          dispatch({ type: "UPDATE_REQUEST", payload: updatedRequest });
        }
      };

    const getPlanRequests = async (planId: string) => {
        const q = query(
            collection(db, "fundRequest"),
            where("planId", "==", planId)
        );
        const snapshot = await getDocs(q);
        const requests = snapshot.docs.map(doc => doc.data() as FundRequest);
        dispatch({type:"SET_REQUESTS", payload: requests});
        return requests;
    }

    const getUserRequests = async (userId: string) => {
        const q = query(
            collection(db, "fundRequest"),
            where("requesterId", "==", userId)
        );
        const snapshot = await getDocs(q);
        const requests = snapshot.docs.map(doc => doc.data() as FundRequest);
        dispatch({ type: "SET_REQUESTS", payload: requests });
        return requests;
    }


    return (
        <FundRequestContext.Provider value={{
            state,
            createRequest,
            getRequest,
            approveRequest,
            rejectRequest,
            completeRequest,
            getPlanRequests,
            getUserRequests
        }}>
            {Children}
        </FundRequestContext.Provider>
    )
}

export const useFundRequests = () => useContext(FundRequestContext);
