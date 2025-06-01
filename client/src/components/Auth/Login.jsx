import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../Auth/auth.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTasks } from "react-icons/fa";

/**
 * Login Component
 * 
 * This component handles user authentication by providing a login form.
 * Features:
 * - Email and password input fields with validation
 * - Interactive emoji that changes based on focused field
 * - Password visibility toggle
 * - Form validation with visual feedback
 * - "Forgot Password" link
 * - Navigation to register page
 * - Animated submit button
 */

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
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
      return ""; // default emoji when no field is focused
    }
    
    switch (focusedField) {
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
    if (!validateEmail(inputs.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (inputs.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      const { data } = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
  {
    email: inputs.email,
    password: inputs.password,
  },
  {
    withCredentials: true,
  }
);

      if (data.success) {
        toast.success("Login Successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-box">
      <div className="emoji-container">
        <span className="login-emoji">{getEmoji()}</span>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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

        <div className="auth-links">
          <span className="forgot-password" onClick={() => toast.success("Password reset feature coming soon!")}>
            Forgot Password?
          </span>
        </div>

        <button type="submit">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Login
        </button>
      </form>
      <p style={{ color: '#fff', marginTop: '20px', textAlign: 'center' }}>
        Don't have an account? <span className="sign" onClick={() => navigate("/register")} style={{ cursor: 'pointer' }}>Register</span>
      </p>
    </div>
  );
};

export default Login; 
