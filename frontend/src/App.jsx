import React, { useEffect } from 'react'
import {Loader} from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';

const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();

  useEffect(() => { 
    checkAuth();
  },[checkAuth]);

  console.log(authUser);

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser? <HomePage/> : <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser? <SignupPage/>: <Navigate to="/"/>} />
        <Route path="/login" element={!authUser? <LoginPage/>: <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser?<ProfilePage/>: <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App