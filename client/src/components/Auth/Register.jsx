import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../Auth/auth.css";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTasks } from "react-icons/fa";

/**
 * Register Component
 * 
 * This component handles new user registration with a form.
 * Features:
 * - Input fields for name, email, and password with validation
 * - Interactive emoji that changes based on focused field
 * - Password visibility toggle
 * - Form validation with visual feedback and error messages
 * - Auto-login after successful registration
 * - Direct navigation to user's profile/home page after registration
 * - Navigation to login page
 * - Animated submit button
 */

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const getEmoji = () => {
    if (!focusedField) {
      return ""; // no emoji when no field is focused
    }
    
    switch (focusedField) {
      case "name":
        return "😃";
      case "email":
        return "🐵";
      case "password":
        return "🙈";
      default:
        return "";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const getInputClassName = (field) => {
    if (!touched[field]) return "user-box";
    
    if (field === 'name' && inputs.name.length < 3) {
      return "user-box error";
    }
    
    if (field === 'email' && !validateEmail(inputs.email)) {
      return "user-box error";
    }
    
    if (field === 'password' && inputs.password.length < 6) {
      return "user-box error";
    }
    
    return "user-box success";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (inputs.name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    
    if (!validateEmail(inputs.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (inputs.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      const { data } = await axios.post("/api/auth/register", {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      if (data.success) {
        toast.success("User Registered Successfully");
        // Log the user in automatically after registration
        try {
          const loginResponse = await axios.post("/api/auth/login", {
            email: inputs.email,
            password: inputs.password,
          });
          if (loginResponse.data.success) {
            toast.success("Logged in automatically");
            navigate("/");
          }
        } catch (loginError) {
          console.log(loginError);
          toast.error("Auto login failed. Please login manually.");
          navigate("/auth");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-box">
      <div className="emoji-container">
        <span className="login-emoji">{getEmoji()}</span>
      </div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className={getInputClassName('name')}>
          <input
            type="text"
            name="name"
            id="name"
            value={inputs.name}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => handleFocus('name')}
            required
            placeholder="Enter your name"
          />
          <label htmlFor="name">Name</label>
          <FaUser className="input-icon" />
        </div>

        <div className={getInputClassName('email')}>
          <input
            type="email"
            name="email"
            id="email"
            value={inputs.email}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => handleFocus('email')}
            required
            placeholder="Enter your email"
          />
          <label htmlFor="email">Email</label>
          <FaEnvelope className="input-icon" />
        </div>

        <div className={getInputClassName('password')}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={inputs.password}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => handleFocus('password')}
            required
            placeholder="Enter your password"
          />
          <label htmlFor="password">Password</label>
          <div 
            onClick={togglePasswordVisibility} 
            style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
          >
            {showPassword ? 
              <FaEyeSlash className="input-icon" /> : 
              <FaEye className="input-icon" />
            }
          </div>
        </div>

        <button type="submit">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Register
        </button>
      </form>
      <p style={{ color: '#fff', marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <span className="sign" onClick={() => navigate("/auth")} style={{ cursor: 'pointer' }}>Login</span>
      </p>
    </div>
  );
};

export default Register; 