import { UserContext } from "./entity/userContext";
import { useContext } from "react";

const Dashboard = () => {
    const {state} = useContext(UserContext);
    return (
        <div>
        <h1>Hello, {state.name}</h1>
        <p>Email: {state.email}</p>
            <p>Phone: {state.phone}</p>
            <p>Address: {state.address}, {state.city}, {state.state} {state.zip}</p>
        </div>
        
    );  
}

export default Dashboard;