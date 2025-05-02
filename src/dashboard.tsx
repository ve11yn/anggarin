import { UserContext } from "./entity/userContext";
import { useContext } from "react";
import Navigation2 from "./navigation2";

const Dashboard = () => {
    const {state} = useContext(UserContext);
    return (
        <div className="page-container">
            <Navigation2/>
            <div className="dashboard">
                <h3>Welcome Back,</h3>
                <h1>{state.name}</h1>
             </div>
        </div>
        
    );  
}

export default Dashboard;