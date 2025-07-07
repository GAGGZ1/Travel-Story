import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home';
import './index.css' 

const App = () => {
  return (
  
    <div >
      <Router>
        <Routes>
           <Route path="/" extract element ={<Root/>}/>
          <Route path="/dashboard" extract element ={<Home/>}/>
           <Route path="/login" extract element ={<Login/>}/>
            <Route path="/signup" extract element ={<SignUp/>}/>
        </Routes>
      </Router>
    </div>
   
  )
}

// Define the Root component to handle the initial redirect
const Root=()=>{
  // Check if token exists in localStorage
  const isAuthenticated=!!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard"/>
  ):(
    <Navigate to="/login"/>
  );
;}


export default App