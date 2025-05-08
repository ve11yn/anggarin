import { UserContext } from "./entity/userContext";
import { useContext, useState } from "react";
import Navigation2 from "./navigation2";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const {state} = useContext(UserContext);
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    return (
        <div className="page-container">
            {/* <Navigation2/>
            <div className="dashboard">
                <h3>Welcome,</h3>
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
                </div> */}

            <Navigation2 
                collapsed={isNavCollapsed} 
                onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
            />

            <div className={`main-content-dashboard ${isNavCollapsed ? 'nav-collapsed' : ''}` }id="main-content-dashboard">
                <h3>Welcome, </h3>
                <h2><b>{state.name}</b></h2>

                <div className="content-container">
                    <div className="left">

                        <div className="fund">
                            <div className="total-budget" id="content-box">
                                <h2>{state.totalFund}</h2>
                                <p>Total Fund</p>
                            </div>

                            <div className="remaining-budget" id="content-box">
                                <h2>{state.remainingFund}</h2>
                                <p>Remaining Fund</p>
                            </div>
                        </div>


                        <Link to="/budgetPlan">
                            <div className="plan" id="content-box">
                                <p>Budget Plans</p>

                                <h1>TEST</h1>
                            </div>
                        </Link>
                        
                    </div>

                    <div className="right">
                        <div className="activity" id="content-box">
                            <p>Latest Activities</p>
                            <h1>TEST</h1>
                        </div>
                    </div>
                </div>
            </div>


        </div>
        
    );  
}

export default Dashboard;