import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * PrivateRoute Component
 * 
 * This component implements protected route functionality.
 * Features:
 * - Prevents unauthorized access to protected pages
 * - Redirects unauthenticated users to the login page
 * - Uses the useAuth hook to check authentication status
 * - Renders child routes (via Outlet) only for authenticated users
 */

const PrivateRoute = () => {
const {auth} = useAuth();
// console.log({auth})
/*to make this true it will go in hooks */

if(auth === undefined) return "Loading....";
return auth === true ? <Outlet/> : <Navigate to="/auth"/>
}

export default PrivateRoute