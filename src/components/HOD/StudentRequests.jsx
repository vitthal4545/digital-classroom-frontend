import { useState, useEffect } from "react";
import axios from "axios";
import ApproveStudentButton from "./ApproveStudentButton";
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

const StudentRequests = () => {
  const [pendingStudents, setPendingStudents] = useState([]);

  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found! Redirecting to login...");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/hod/students/pending`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setPendingStudents(response.data);
      } catch (error) {
        console.error(
          "Error fetching pending students:",
          error.response?.data || error.message
        );
      }
    };
    fetchPendingStudents();
  }, []);

  const handleApprove = (studentId) => {
    setPendingStudents((prev) =>
      prev.filter((student) => student._id !== studentId)
    );
  };

  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "#121212", minHeight: "100vh" }}
    >
      <Typography variant="h4" gutterBottom color="white">
        Student Requests
      </Typography>
      <Typography variant="body2" color="gray" sx={{ marginBottom: "10px" }}>
        (Note: Click "Approve" to verify a student)
      </Typography>

      <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Student Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell sx={{ color: "#bbb" }}>{student.name}</TableCell>
                <TableCell sx={{ color: "#bbb" }}>{student.email}</TableCell>
                <TableCell>
                  <ApproveStudentButton
                    studentId={student._id}
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

export default StudentRequests;
