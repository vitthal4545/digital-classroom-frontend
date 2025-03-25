import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApprovedTeachers from "./ApprovedTeachers";
import TeacherRequests from "./TeacherRequests";
import StudentRequests from "./StudentRequests";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Container,
  Grid,
} from "@mui/material";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function HODDash() {
  const [hodInfo, setHodInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found! Redirecting to login...");
          navigate("/login");
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch HOD Information
        const hodResponse = await axios.get(`${BASE_URL}/api/hod/profile`, {
          headers,
          withCredentials: true,
        });
        setHodInfo(hodResponse.data);
      } catch (error) {
        console.error(
          "Error fetching HOD dashboard data",
          error.response?.data || error.message || error
        );
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.clear();
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: { xs: "20px", md: "40px" },
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        {/* HOD Info */}
        <Paper
          sx={{
            padding: "20px",
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            textAlign: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom color="white">
            HOD Dashboard
          </Typography>
          {hodInfo && (
            <Box sx={{ marginBottom: "15px" }}>
              <Typography variant="h5" color="lightgreen">
                Welcome, {hodInfo.name} Sir
              </Typography>
              <Typography variant="body1" color="gray">
                Email: {hodInfo.email}
              </Typography>
              <Typography variant="body1" color="gray">
                Department: {hodInfo.department}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/academic-record")}
          >
            View Academic Records
          </Button>
        </Paper>

        <Divider sx={{ my: 3, backgroundColor: "#444" }} />

        {/* Responsive Grid Layout */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ApprovedTeachers />
          </Grid>
          <Grid item xs={12} md={6}>
            <TeacherRequests />
          </Grid>
          <Grid item xs={12}>
            <StudentRequests />
          </Grid>
        </Grid>

        {/* Logout Button */}
        <Box sx={{ textAlign: "center", marginTop: "30px" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              fontSize: "16px",
              padding: "10px 30px",
              borderRadius: "8px",
              transition: "0.3s",
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default HODDash;
