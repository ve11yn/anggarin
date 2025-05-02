import {Link} from "react-router-dom";  
import "./index.css";

const Navigation1 = () => {
    return (
        <div className="navigation1">
            <div className="nav-inner">
                <div>
                    <p>Anggar.in</p>
                </div>

                <div className="nav-links">
                    <Link to="/register" className="nav-link">Register</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Navigation1;  