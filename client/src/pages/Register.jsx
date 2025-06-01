import React, { useEffect } from 'react'
import Register from "../components/Auth/Register.jsx";
import classes from "./auth.module.css"
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';

const Auth = () => {
/*The proccess is once you login that no one can be able to visit any route like login,register,edit ..any */  
const navigate = useNavigate();
const {auth} = useAuth();
/*The vision: if this auth is true that mean you already logged in user so instead of rendaring this belew auth page we'll back to our home page  */

useEffect(()=>{
if(auth){
  navigate("/")
}
},[auth, navigate])

  return (  
    <div className={classes.auth_page}>
      <div className={classes.form_container}>
        <Register/>
      </div>
    </div>
  )
}

export default Auth