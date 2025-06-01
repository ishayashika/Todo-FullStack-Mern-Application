import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout.jsx";

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#333",
    textAlign: "center"
  },
  formGroup: {
    marginBottom: "1.5rem"
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#555"
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem"
  },
  disabledInput: {
    width: "100%",
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: "#f5f5f5",
    cursor: "not-allowed",
    color: "#777"
  },
  btnContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem"
  },
  cancelBtn: {
    padding: "0.7rem 1.5rem",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#f1f1f1",
    color: "#555"
  },
  saveBtn: {
    padding: "0.7rem 1.5rem",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#4b70e2",
    color: "white"
  }
};

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get("/api/users/me");
        setUser({
          name: data.name,
          email: data.email,
        });
      } catch (error) {
        console.log(error);
      }
    };

    getUserInfo();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/users/profile", {
        name: user.name,
      });
      
      if (data.success) {
        toast.success("Profile updated successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Name</label>
            <input
              style={styles.input}
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email (cannot be changed)</label>
            <input
              style={styles.disabledInput}
              type="email"
              id="email"
              value={user.email}
              readOnly
              disabled
            />
          </div>
          
          <div style={styles.btnContainer}>
            <button 
              type="button" 
              onClick={() => navigate("/")} 
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProfile; 