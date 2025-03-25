import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  Box,
} from "@mui/material";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ApprovedTeachers = () => {
  const [approvedTeachers, setApprovedTeachers] = useState([]);

  const fetchApprovedTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! Redirecting to login...");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/hod/teachers/approved`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setApprovedTeachers(response.data);
    } catch (error) {
      console.error(
        "Error fetching approved teachers:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchApprovedTeachers();
  }, []);

  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "#121212", minHeight: "100vh" }}
    >
      <Typography variant="h4" gutterBottom color="white">
        Approved Teachers
      </Typography>
      <Typography variant="body2" color="gray" sx={{ marginBottom: "10px" }}>
        (Note: ✅ This checkmark indicates verified teachers)
      </Typography>

      <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Teacher Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvedTeachers.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell sx={{ color: "#bbb" }}>{teacher.name} ✅</TableCell>
                <TableCell sx={{ color: "#bbb" }}>{teacher.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ApprovedTeachers;
