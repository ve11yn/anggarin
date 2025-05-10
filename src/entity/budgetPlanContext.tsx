import { createContext, useContext, useReducer, ReactNode } from "react";
import { 
  doc, collection, setDoc, updateDoc, 
  arrayUnion, increment, getDocs, query, where, 
  getDoc
} from "firebase/firestore";
import { db } from "../main";

// document structure in firestore
export interface BudgetPlan {
    planId: string;
    userId: string; 
    title: string;
    description: string;
    members: string[];
    totalFund: number;
    remainingFund: number;
    createdAt: string;
    updatedAt? : string;
    fundRequests?: string[]
}

interface BudgetPlanState {
    plans: BudgetPlan[],
    currentPlan: BudgetPlan | null;
}

// enums all state modification
type BudgetPlanAction = 
    | { type: "SET_PLANS"; payload: BudgetPlan[] }
    | { type: "SET_CURRENT_PLAN"; payload: BudgetPlan }
    | { type: "ADD_PLAN"; payload: BudgetPlan }
    | { type: "UPDATE_PLAN"; payload: BudgetPlan }
    | { type: "ADD_MEMBER"; payload: { planId: string; userId: string } }
    | { type: "ADD_FUND_REQUEST"; payload: { planId: string; requestId: string } }
    | { type: "UPDATE_FUNDS"; payload: { planId: string; amount: number } };



// const BudgetPlanContext = createContext<{ ... }>(null!);
// Creates a context that holds the state and functions to manipulate BudgetPlan data. null! bypasses TypeScript null checks.
const BudgetPlanContext = createContext<{
    state: BudgetPlanState;
    createPlan: (plan: Omit<BudgetPlan, "planId" | "createdAt">) => Promise<string>;
    getPlan: (planId: string) => Promise<BudgetPlan | null>;
    addMember: (planId: string, userId: string) => Promise<void>;
    addFundRequest: (planId: string, requestId: string) => Promise<void>;
    updateFunds: (planId: string, amount: number) => Promise<void>;
    getUserPlans: (userId: string) => Promise<BudgetPlan[]>;
}>(null!);
      

// reducer function
// Updates the state based on the action dispatched (adds plans, updates funds, etc.).
const budgetPlanReducer = (state: BudgetPlanState, action: BudgetPlanAction): BudgetPlanState => {
    switch (action.type) {
      case "SET_PLANS":
        return { ...state, plans: action.payload };
      case "SET_CURRENT_PLAN":
        return { ...state, currentPlan: action.payload };
      case "ADD_PLAN":
        return { ...state, plans: [...state.plans, action.payload] };
      case "UPDATE_PLAN":
        return {
          ...state,
          plans: state.plans.map(plan =>
            plan.planId === action.payload.planId ? action.payload : plan
          ),
          currentPlan: state.currentPlan?.planId === action.payload.planId 
            ? action.payload 
            : state.currentPlan
        };
      case "ADD_MEMBER":
        return {
          ...state,
          plans: state.plans.map(plan =>
            plan.planId === action.payload.planId
              ? { ...plan, members: [...plan.members, action.payload.userId] }
              : plan
          )
        };
      case "ADD_FUND_REQUEST":
        return {
          ...state,
          plans: state.plans.map(plan =>
            plan.planId === action.payload.planId
              ? { 
                  ...plan, 
                  fundRequests: [...(plan.fundRequests || []), action.payload.requestId]
                }
              : plan
          )
        };
      case "UPDATE_FUNDS":
        return {
          ...state,
          plans: state.plans.map(plan =>
            plan.planId === action.payload.planId
              ? { 
                  ...plan, 
                  remainingFund: plan.remainingFund + action.payload.amount 
                }
              : plan
          )
        };
      default:
        return state;
    }
  };
  

// provider component
// provide context in the app, such as:
// createPlan, getPlan, addMember, addFundRequest, updateFunds, getUserPlans
  export const BudgetPlanProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(budgetPlanReducer, {
      plans: [],
      currentPlan: null
    });
  
    const createPlan = async (planData: Omit<BudgetPlan, "planId" | "createdAt">) => {
      const planRef = doc(collection(db, "budgetPlans"));
      const newPlan: BudgetPlan = {
        ...planData,
        planId: planRef.id,
        createdAt: new Date().toISOString(),
        remainingFund: planData.totalFund,
        fundRequests: []
      };
      
      await setDoc(planRef, newPlan);
      dispatch({ type: "ADD_PLAN", payload: newPlan });
      
      // Update user's plan list
      await updateDoc(doc(db, "users", planData.userId), {
        budgetPlans: arrayUnion(planRef.id)
      });
      
      return planRef.id;
    };
  
    const getPlan = async (planId: string) => {
      const planSnap = await getDoc(doc(db, "budgetPlans", planId));
      if (planSnap.exists()) {
        const plan = planSnap.data() as BudgetPlan;
        dispatch({ type: "SET_CURRENT_PLAN", payload: plan });
        return plan;
      }
      return null;
    };
  
    const addMember = async (planId: string, userId: string) => {
      await updateDoc(doc(db, "budgetPlans", planId), {
        members: arrayUnion(userId),
        updatedAt: new Date().toISOString()
      });
      dispatch({ type: "ADD_MEMBER", payload: { planId, userId } });
      
      // Update user's memberPlans
      await updateDoc(doc(db, "users", userId), {
        memberPlans: arrayUnion(planId)
      });
    };
  
    const addFundRequest = async (planId: string, requestId: string) => {
      await updateDoc(doc(db, "budgetPlans", planId), {
        fundRequests: arrayUnion(requestId),
        updatedAt: new Date().toISOString()
      });
      dispatch({ type: "ADD_FUND_REQUEST", payload: { planId, requestId } });
    };
  
    const updateFunds = async (planId: string, amount: number) => {
      await updateDoc(doc(db, "budgetPlans", planId), {
        remainingFund: increment(amount),
        updatedAt: new Date().toISOString()
      });
      dispatch({ type: "UPDATE_FUNDS", payload: { planId, amount } });
    };
  
    const getUserPlans = async (userId: string) => {
      const q = query(
        collection(db, "budgetPlans"),
        where("members", "array-contains", userId)
      );
      const snapshot = await getDocs(q);
      const plans = snapshot.docs.map(doc => doc.data() as BudgetPlan);
      dispatch({ type: "SET_PLANS", payload: plans });
      return plans;
    };
  
    // exporting the provider context so this is available to any component
    return (
      <BudgetPlanContext.Provider value={{
        state,
        createPlan,
        getPlan,
        addMember,
        addFundRequest,
        updateFunds,
        getUserPlans
      }}>
        {children}
      </BudgetPlanContext.Provider>
    );
  };
  
  export const useBudgetPlans = () => useContext(BudgetPlanContext);
