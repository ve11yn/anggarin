import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './login.tsx'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Dashboard from './dashboard.tsx'
import Register from './register.tsx'
import Landing from './landing.tsx'
import Details from './details.tsx'
import BudgetPlan from './budgetPlan.tsx'
import Profile from './profile.tsx'
import { UserProvider } from './entity/userContext.tsx'

const firebaseConfig = {
  apiKey: "AIzaSyD4BolheSft4GjYAYCg9MDgp2_69ICOBsU",
  authDomain: "anggarin-23d30.firebaseapp.com",
  projectId: "anggarin-23d30",
  storageBucket: "anggarin-23d30.firebasestorage.app",
  messagingSenderId: "521467913214",
  appId: "1:521467913214:web:e25a403e57152e66b616af",
  measurementId: "G-EL7WMXMQT0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 


import { enableIndexedDbPersistence } from "firebase/firestore";
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn("Offline persistence can only be enabled in one tab at a time.");
  } else if (err.code === 'unimplemented') {
    console.warn("The current browser does not support offline persistence");
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />  
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/details" element={<Details />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/budgetPlan" element={<BudgetPlan />}></Route>
        </Routes>
      </Router>
    </UserProvider>
  </StrictMode>,
)