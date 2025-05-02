import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./entity/userContext";

const Details = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");   
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [error, setError] = useState("");

    const { dispatch } = useContext(UserContext);

    const handleSubmit = () => {
        const phoneRegex = /^[0-9]{12}$/; 
        if (!name || !phone || !address || !city || !state || !zip){
            setError("All fields are required.");
            return;
        } 
        
        if (!phoneRegex.test(phone)) {
            setError("Phone must be a 12-digit number.");
            return;
        }
        dispatch({ 
            type: "SET_USER", 
            payload: { name, phone, address, city, state, zip } 
        });

        setError("")
        navigate("/Dashboard");
    }

    return (
        <div className="details">
            <h1 className="details-h1">Fill in your details.</h1>

            <div className="details-container">

                <div className="details-form-container">
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                    <input type="text" placeholder="Zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button onClick={handleSubmit}>Save</button>
            </div>

        </div>
    )
}

export default Details;