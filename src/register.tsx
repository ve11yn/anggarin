import {useState} from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";   
import { useContext } from "react";
import { UserContext } from "./entity/userContext";

const Register = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authingEmail, setAuthingEmail] = useState(false);
    const [authingGoogle, setAuthingGoogle] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [error, setError] = useState("");

    const {dispatch} = useContext(UserContext);

    const registerWithGoogle = async () => {
        setAuthingGoogle(true);
        setError("");
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate("/Details", { replace: true });
            })
            .catch(error => {
                if (error.code === "auth/email-already-in-use") {
                    setError("Email already registered.");
                  }
                console.log(error);
                setAuthingGoogle(false);
                setError(error.message);    
            });
    }

    const registerWithEmail = async () => {
        if (password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        setAuthingEmail(true);
        setError("");

        createUserWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                dispatch({ type: "SET_USER", payload: { email, password } }); 
                navigate("/Details", { replace: true });
            })
            .catch(error => {
                console.log(error);
                setError(error.message);    
                setAuthingEmail(false);
            })
    }

    return (
        <div className="main-content">
            <h1 className="auth-title">Register to Anggar.in</h1>

            <div className="register-container">
                <div className="auth-card">
                    <button onClick={registerWithGoogle} className="login-with-google">
                        {authingGoogle ? "Registering..." : "Register with Google"}
                    </button>
                    <p>or</p>
                    <div className="register-form-container">
                        <input 
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value);setError("");}} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value);setError("");}} />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e)=>{setConfirmPassword(e.target.value);setError("");}} />
                        <button onClick={registerWithEmail}>
                            {authingEmail ? "Registering..." : "Register"}
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <p className="auth-link"><Link to="/login">Already have an account? Login here.</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register;