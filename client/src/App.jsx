import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx"
import Edit from "./pages/Edit.jsx";
import Register from "./pages/Register.jsx"

/**
 * App Component
 * 
 * Main application component that sets up the routing structure.
 * Features:
 * - Route configuration for all pages (public and protected)
 * - Toast notification system for user feedback
 * - Protected routes using PrivateRoute component
 * - Authentication flow with login/register routes
 */

function App() {
  
  return (
    <>
    {/* A toaster (or toast) is a small, non-blocking popup notification that appears on the screen to give feedback to the user — like success, error, warning, or info messages.

🟢 Example: “✅ Login Successful” or “❌ Something went wrong” */}
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            fontSize: "1.8rem",
          },
        }}
      />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/edit' element={<EditProfile />} />
        </Route>
        <Route path='/auth' element={<Auth/>} />
        <Route path="/edittask" element={<Edit/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  );
}

export default App; 