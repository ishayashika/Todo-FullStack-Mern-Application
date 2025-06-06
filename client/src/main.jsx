import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import "./Styles/global.css"
import axios from 'axios'

// Configure axios to include credentials with every request
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <App />
    </Router>
); 
