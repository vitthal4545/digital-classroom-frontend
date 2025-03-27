import React, { useState, useEffect } from "react";
import {
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";

const HODYearSelection = () => {
  const [year, setYear] = useState("1st Year");
  const [hodBranch, setHodBranch] = useState("");
  const [data, setData] = useState({ students: [], subjects: [] });

  useEffect(() => {
    fetchHODProfile();
  }, []);

  useEffect(() => {
    if (hodBranch) {
      console.log("hod brance:- ", hodBranch);
      fetchData();
    }
  }, [year, hodBranch]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchHODProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token missing! Please login again.");
        return;
      }

      const hodResponse = await axios.get(`${BASE_URL}/api/hod/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHodBranch(hodResponse.data.department);
    } catch (error) {
      console.error("Error fetching HOD profile:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token missing! Please login again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/hod/records?year=${year}&branch=${hodBranch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  return (
    <Container
      style={{ backgroundColor: "#121212", color: "#fff", padding: "20px" }}
    >
      <Typography variant="h4" gutterBottom>
        Academic-Records
      </Typography>
      <FormControl fullWidth>
        <InputLabel style={{ color: "#fff" }}>Select Year</InputLabel>
        <Select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ color: "#fff", backgroundColor: "#333" }}
        >
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
            <MenuItem key={yr} value={yr}>
              {yr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Students
      </Typography>
      <TableContainer component={Paper} style={{ backgroundColor: "#222" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "#fff" }}>Name</TableCell>
              <TableCell style={{ color: "#fff" }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.students.map((student) => (
              <TableRow key={student._id}>
                <TableCell style={{ color: "#fff" }}>{student.name}</TableCell>
                <TableCell style={{ color: "#fff" }}>{student.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Subjects
      </Typography>
      <TableContainer component={Paper} style={{ backgroundColor: "#222" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "#fff" }}>Subject Name</TableCell>
              <TableCell style={{ color: "#fff" }}>Semester</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.subjects.map((subject) => (
              <TableRow key={subject._id}>
                <TableCell style={{ color: "#fff" }}>{subject.name}</TableCell>
                <TableCell style={{ color: "#fff" }}>{subject.sem}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HODYearSelection;
