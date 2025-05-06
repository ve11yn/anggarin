import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./main";
import { UserContext } from "./entity/userContext";

const Details = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { state, dispatch } = useContext(UserContext);
    
    const [formData, setFormData] = useState({
        name: state.name || "",
        address: state.address || "",
        city: state.city || "",
        phone: state.phone || "",
        email: state.email || "",
        state: state.state || "",
        zip: state.zip || "",
        fundCount: state.fundCount || "0",
        totalFund: state.totalFund || "0",
        remainingFund: state.remainingFund || "0"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const user = auth.currentUser;
            if (user) {
                const updatedData = {
                    ...formData,
                    updatedAt: new Date().toISOString()
                };
                
                await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });
                
                dispatch({
                    type: "SET_USER",
                    payload: updatedData
                });
                
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error saving user details:", error);
        }
    };

    return (
        <div className="details-container">
            <h2>Complete your details.</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Address</label>
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>City</label>
                    <input 
                        type="text" 
                        name="city" 
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>State</label>
                    <input 
                        type="text" 
                        name="state" 
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>ZIP Code</label>
                    <input 
                        type="text" 
                        name="zip" 
                        value={formData.zip}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div>
                    <input 
                        type="hidden" 
                        name="email" 
                        value={formData.email}
                    />
                </div>
                
                {/* <div className="form-group">
                    <label>Initial Fund Count</label>
                    <input 
                        type="number" 
                        name="fundCount" 
                        value={formData.fundCount}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label>Total Fund</label>
                    <input 
                        type="number" 
                        name="totalFund" 
                        value={formData.totalFund}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label>Remaining Fund</label>
                    <input 
                        type="number" 
                        name="remainingFund" 
                        value={formData.remainingFund}
                        onChange={handleChange}
                    />
                </div> */}
                
                <button type="submit">Save Details</button>
            </form>
        </div>
    );
};

export default Details;