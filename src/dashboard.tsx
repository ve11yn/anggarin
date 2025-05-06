import { UserContext } from "./entity/userContext";
import { useContext } from "react";
import Navigation2 from "./navigation2";

const Dashboard = () => {
    const {state} = useContext(UserContext);
    return (
        <div className="page-container">
            <Navigation2/>
            <div className="dashboard">
                <h3>Welcome back,</h3>
                <h2>{state.name || "User"}</h2>
            </div>

            <div className="user-details">
                    <div className="detail-row">
                        <div className="detail-item">
                            <h4>Email</h4>
                            <p>{state.email || "Not provided"}</p>
                        </div>
                        <div className="detail-item">
                            <h4>Phone</h4>
                            <p>{state.phone || "Not provided"}</p>
                        </div>
                    </div>
                    
                    <div className="detail-row">
                        <div className="detail-item">
                            <h4>Address</h4>
                            <p>{state.address || "Not provided"}</p>
                        </div>
                        <div className="detail-item">
                            <h4>City</h4>
                            <p>{state.city || "Not provided"}</p>
                        </div>
                    </div>
                    
                    <div className="detail-row">
                        <div className="detail-item">
                            <h4>State/ZIP</h4>
                            <p>{state.state ? `${state.state}, ${state.zip}` : "Not provided"}</p>
                        </div>
                        <div className="detail-item">
                            <h4>Funds</h4>
                            <p>
                                Total: {state.totalFund || "0"} | 
                                Remaining: {state.remainingFund || "0"}
                            </p>
                        </div>
                    </div>
                </div>
        </div>
        
    );  
}

export default Dashboard;