import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";


const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authingEmail, setAuthingEmail] = useState(false);
    const [authingGoogle, setAuthingGoogle] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginWithGoogle = async () => {
        setAuthingGoogle(true);
        setError("");
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate("/Dashboard", { replace: true });
            })
            .catch(error => {
                if (error.code === "auth/user-not-found") {
                    setError("Email is not registered.");
                  } else if (error.code === "auth/wrong-password") {
                    setError("Incorrect password.");
                  }
                console.log(error);
                setAuthingGoogle(false);
                setError(error.message);    
            });
    };

    const loginWithEmail = async () => {
        setAuthingEmail(true);
        setError("");
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate("/Dashboard", { replace: true });
            })
            .catch(error => {
                console.log(error);
                setAuthingEmail(false);
                setError(error.message);    
            });
    };


    return (
        <div className="main-content">
            <h1 className="auth-title">Login to Anggar.in</h1>

            <div className="login-container">

                <div className="auth-card">
                    <button onClick={loginWithGoogle} className="login-with-google">
                        {authingGoogle ? "Logging in..." : "Log in with Google"}
                    </button>
                    <p>or</p>
                    <div className="login-form-container">
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
                        <button onClick={loginWithEmail}>
                            {authingEmail ? "Logging in..." : "Log in"}
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <p className="auth-link"><Link to="/register">Don't have an account? Create one here.</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;