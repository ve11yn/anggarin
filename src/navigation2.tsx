import { useContext, useState } from "react";
import { UserContext } from "./entity/userContext";
import { Link, useLocation } from "react-router-dom";
import "./index.css";

const Navigation2 = () => {
    const {state} = useContext(UserContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const toggleNavigation = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <button 
                className="nav-toggle-btn"
                onClick={toggleNavigation}
            >
                {isCollapsed ? "→" : "←"}
            </button>
            <div className={`navigation2 ${isCollapsed ? 'collapsed' : ''}`}>
                <div>
                    <h2>Anggar.in</h2>
                </div>

                <div className="nav-links-2">
                    <Link to="/dashboard" className={`nav-link${location.pathname === "/dashboard" ? " active" : ""}`}>Dashboard</Link>
                    <Link to="/budgetPlan" className={`nav-link${location.pathname === "/budgetPlan" ? " active" : ""}`}>Budget Plan</Link>
                    <Link to="/fundRequest" className={`nav-link${location.pathname === "/fundRequest" ? " active" : ""}`}>Fund Request</Link>
                    <Link to="/profile" className={`nav-link${location.pathname === "/profile" ? " active" : ""}`}>Profile</Link>
                </div>

                <button>Log Out</button>
            </div>
        </>
    )
};

export default Navigation2;