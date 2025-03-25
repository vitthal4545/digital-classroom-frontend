import { useState, useEffect } from "react";
import axios from "axios";
import ApproveButton from "./ApproveButton";
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

const TeacherRequests = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);

  useEffect(() => {
    const fetchPendingTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found! Redirecting to login...");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/hod/teachers/pending`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setPendingTeachers(response.data);
      } catch (error) {
        console.error(
          "Error fetching pending teachers:",
          error.response?.data || error.message
        );
      }
    };
    fetchPendingTeachers();
  }, []);

  const handleApprove = (teacherId) => {
    setPendingTeachers((prev) =>
      prev.filter((teacher) => teacher._id !== teacherId)
    );
  };

  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "#121212", minHeight: "100vh" }}
    >
      <Typography variant="h4" gutterBottom color="white">
        Teacher Requests
      </Typography>
      <Typography variant="body2" color="gray" sx={{ marginBottom: "10px" }}>
        (Note: Click "Approve" to verify a teacher)
      </Typography>

      <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Teacher Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingTeachers.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell sx={{ color: "#bbb" }}>{teacher.name}</TableCell>
                <TableCell sx={{ color: "#bbb" }}>{teacher.email}</TableCell>
                <TableCell>
                  <ApproveButton
                    teacherId={teacher._id}
                    onApprove={handleApprove}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherRequests;
