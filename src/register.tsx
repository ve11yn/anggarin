import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { useContext } from "react";
import { UserContext } from "./entity/userContext";
import { db } from "./main";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { dispatch } = useContext(UserContext);

    const [authingEmail, setAuthingEmail] = useState(false);
    const [authingGoogle, setAuthingGoogle] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const registerWithGoogle = async () => {
        setAuthingGoogle(true);
        setError("");
        
        try {
            const response = await signInWithPopup(auth, new GoogleAuthProvider());
            const user = response.user;
            
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                name: user.displayName || "",
                createdAt: new Date().toISOString(),
                provider: "google"
            });

            dispatch({ 
                type: "SET_USER", 
                payload: { 
                    uid: user.uid,
                    email: user.email || "",
                    name: user.displayName || ""
                } 
            });
            
            navigate("/details");
        } catch (error: any) {
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                setError("Email already registered.");
            } else {
                setError(error.message);
            }
            setAuthingGoogle(false);
        }
    };

    const registerWithEmail = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setAuthingEmail(true);
        setError("");

        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
                provider: "email"
            });

            dispatch({ 
                type: "SET_USER", 
                payload: { 
                    uid: user.uid,
                    email: email 
                } 
            });
            
            navigate("/details");
        } catch (error: any) {
            console.error(error);
            setError(error.message);
            setAuthingEmail(false);
        }
    };

    return (
        <div className="main-content">
            <div className="register-container">
                <h1 className="auth-title">Register to <span>Anggar.in</span></h1>
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
                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                        />
                        <button onClick={registerWithEmail}>
                            {authingEmail ? "Registering..." : "Register"}
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <p className="auth-link"><Link to="/login">Already have an account? Login here.</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;