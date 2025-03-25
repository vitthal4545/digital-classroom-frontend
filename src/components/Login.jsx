import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );

      const data = response.data;

      if (response.status === 200 && data.user) {
        toast.success("Login Successful 🎉", { position: "top-right" });
        localStorage.setItem("token", data.token);

        if (response.data.user.userType === "teacher") {
          console.log("✅ Setting teacherId:", response.data.user.teacherId);
          localStorage.setItem("teacherId", response.data.user.teacherId);
        } else {
          localStorage.removeItem("teacherId");
        }

        setTimeout(() => {
          if (data.user.userType === "student") navigate("/student-dash");
          else if (data.user.userType === "teacher") navigate("/teacher-dash");
          else if (data.user.userType === "hod") navigate("/hod-dash");
        }, 1000);
      }
    } catch (error) {
      console.error("🔴 Login Error:", error);

      if (error.response) {
        console.error("🔴 Error Response Data:", error.response.data);
        toast.error(`Login failed: ${error.response.data.message}`, {
          position: "top-right",
        });
      } else if (error.request) {
        console.error("⚠️ No Response from Server!");
        toast.error("Server not responding. Please try again later.", {
          position: "top-right",
        });
      } else {
        console.error("❌ Request Setup Error:", error.message);
        toast.error("Unexpected error. Check console for details.", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Paper
        elevation={3}
        style={{
          padding: "30px",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#bbb" } }}
              sx={{ bgcolor: "#333", borderRadius: "5px" }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#bbb" } }}
              sx={{ bgcolor: "#333", borderRadius: "5px" }}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
