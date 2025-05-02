import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom' 
import Login from './login.tsx'
import { initializeApp } from "firebase/app";
import Dashboard from './dashboard.tsx'
import Register from './register.tsx'
import Landing from './landing.tsx'
import Details from './details.tsx'
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

initializeApp(firebaseConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />  
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/home" element={<Dashboard/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/landing" element={<Landing/>} />
          <Route path="/details" element={<Details/>} />
        </Routes>
      </Router>
    </UserProvider>
  </StrictMode>,
)
