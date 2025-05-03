import { useContext, useState } from "react";
import { UserContext } from "./entity/userContext";
import { Link } from "react-router-dom";
import "./index.css";

const Navigation2 = () => {
    const {state} = useContext(UserContext);
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/budgetPlan" className="nav-link">Budget Plan</Link>
                    <Link to="/fundRequest" className="nav-link">Fund Request</Link>
                    <Link to="/Profile" className="nav-link">Profile</Link>
                </div>

                <button>Log Out</button>
            </div>
        </>
    )
};

export default Navigation2;