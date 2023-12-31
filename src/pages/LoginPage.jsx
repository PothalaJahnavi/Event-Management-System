import React from 'react'
import { useState } from "react";
import { Link, useLocation } from 'react-router-dom'
import { useFirebase } from '../context/firebase';
import { useNavigate } from "react-router-dom"
const LoginPage = () => {
  const navigate=useNavigate()
  const firebase=useFirebase()
  const location=useLocation()
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const isAdmin=location.pathname.includes('admin')||location.pathname.includes('create-event')

  
  const handleLogin=async()=>{
    if(isAdmin){
      const result=await firebase.login(email,password,'admin')
      if(result.user){
        alert("Admin Logged in successfully.")
        navigate('/admin-dashboard')
      }
      else{
        alert("Invalid credentials.Please login again")
      }

    }
    else{
      const result=await firebase.login(email,password,'user')
      if(result.user){
        alert("User Logged in successfully.")
        navigate('/user-dashboard')
      }
      else{
        alert("Invalid credentials.Please login again")
      }
    }
    setEmail('')
    setPassword('')
  }
  return (
    <div className='card mt-5 p-3 w-50' style={{margin:'auto'}}>
        <h6 className='text-center'>{!isAdmin? 'User':'Admin'} Login</h6>
        <div>
        <div class="mb-3">
          <label for="email" class="form-label">
            Email address
          </label>
          <input type="email" class="form-control" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">
            Password
          </label>
          <input type="password" class="form-control" id="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        <button  class="btn btn-primary" style={{ width: "100%" }} onClick={handleLogin}>
          Submit
        </button>
    </div>
      <p className='mt-4'>Don't Have An Account?<Link to={`/register-${isAdmin?'admin':'user'}`}>Register</Link></p>
    </div>
  )
}

export default LoginPage
