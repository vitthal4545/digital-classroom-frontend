import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Loader from "../Loader";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DarkPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1e1e1e",
  color: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
}));

const CreateSubjectPage = () => {
  const [subjectName, setSubjectName] = useState("");
  const [className, setClassName] = useState("");
  const [sem, setSem] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        return;
      }
      const teacherId = localStorage.getItem("teacherId");
      const response = await axios.post(
        `${BASE_URL}/api/subjects`,
        {
          name: subjectName,
          className,
          sem,
          department,
          description,
          teacherId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Subject Created 🕊️");
      setTimeout(() => navigate("/Teacher-dash"), 2000);
    } catch (err) {
      toast.error("Subject Creation Failed 🤡");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <DarkPaper>
        <Typography variant="h4" gutterBottom align="center">
          Create New Subject
        </Typography>
        <form onSubmit={handleCreateSubject}>
          <TextField
            fullWidth
            label="Subject Name"
            variant="outlined"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel style={{ color: "white" }}>Department</InputLabel>
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              sx={{ color: "white" }}
            >
              <MenuItem value="CSE">Computer Science (CSE)</MenuItem>
              <MenuItem value="Mechanical">Mechanical Engineering</MenuItem>
              <MenuItem value="Civil">Civil Engineering</MenuItem>
              <MenuItem value="Electrical">Electrical Engineering</MenuItem>
              <MenuItem value="Electronics">Electronics Engineering</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel style={{ color: "white" }}>Class</InputLabel>
            <Select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              sx={{ color: "white" }}
            >
              <MenuItem value="1st Year">1st Year</MenuItem>
              <MenuItem value="2nd Year">2nd Year</MenuItem>
              <MenuItem value="3rd Year">3rd Year</MenuItem>
              <MenuItem value="4th Year">4th Year</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel style={{ color: "white" }}>Semester</InputLabel>
            <Select
              value={sem}
              onChange={(e) => setSem(e.target.value)}
              required
              sx={{ color: "white" }}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <MenuItem key={i} value={`Sem ${i + 1}`}>{`Sem ${
                  i + 1
                }`}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#0077cc", color: "white" }}
            disabled={loading}
          >
            {loading ? <Loader /> : "Create Subject"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2, color: "white", borderColor: "white" }}
            onClick={() => navigate("/Teacher-dash")}
          >
            Cancel
          </Button>
        </form>
      </DarkPaper>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </Container>
  );
};

export default CreateSubjectPage;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Subjects.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function CreateSubjectPage() {
//   const [subjectName, setSubjectName] = useState("");
//   const [className, setClassName] = useState("");
//   const [sem, setSem] = useState("");
//   const [department, setDepartment] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const navigate = useNavigate();

//   const handleCreateSubject = async (e) => {
//     e.preventDefault();
//     console.log("✅ handleCreateSubject function called!");
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found! Redirecting to login...");
//         return;
//       }
//       const teacherId = localStorage.getItem("teacherId");

//       if (!teacherId) {
//         setError("Teacher ID not found. Please log in again.");
//         setLoading(false);
//         return;
//       }
//       const response = await axios.post(
//         "http://localhost:5000/api/subjects",
//         {
//           name: subjectName,
//           className,
//           sem,
//           department,
//           description,
//           teacherId,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       toast.success("Subject Created 🕊️", {
//         position: "top-right",
//       });
//       console.log("response from create sub page", response.data);
//       setSuccess("Subject created successfully!");
//       setSubjectName("");
//       setClassName("");
//       setSem("");
//       setDescription("");

//       // Redirect to dashboard after 2 seconds
//       setTimeout(() => navigate("/Teacher-dash"), 2000);
//     } catch (err) {
//       setError("Failed to create subject. Try again!");
//       toast.error("Subject Creation Failed 🤡", {
//         position: "top-right",
//       });
//       console.error("create sub error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="create-subject-container">
//       <h2>Create New Subject</h2>
//       {error && <p className="error-message">{error}</p>}
//       {success && <p className="success-message">{success}</p>}

//       <form onSubmit={handleCreateSubject}>
//         <div className="form-group">
//           <label htmlFor="subjectname" className="">
//             Subject Name
//           </label>
//           <input
//             name="subjectname"
//             type="text"
//             value={subjectName}
//             onChange={(e) => setSubjectName(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <select
//             value={department}
//             onChange={(e) => setDepartment(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             required
//           >
//             <option value="">Select Department</option>
//             <option value="CSE">Computer Science (CSE)</option>
//             <option value="Mechanical">Mechanical Engineering</option>
//             <option value="Civil">Civil Engineering</option>
//             <option value="Electrical">Electrical Engineering</option>
//             <option value="Electronics">Electronics Engineering</option>
//           </select>
//         </div>
//         <div className="form-group">
//           <label className="">Class</label>
//           <select
//             value={className}
//             onChange={(e) => setClassName(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             required
//           >
//             <option value="">Select Class</option>
//             <option value="1st Year">1st Year</option>
//             <option value="2nd Year">2nd Year</option>
//             <option value="3rd Year">3rd Year</option>
//             <option value="4th Year">4th Year</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Semester</label>
//           <select
//             value={sem}
//             onChange={(e) => setSem(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             required
//           >
//             <option value="">Select Semester</option>
//             <option value="Sem 1">Sem 1</option>
//             <option value="Sem 2">Sem 2</option>
//             <option value="Sem 3">Sem 3</option>
//             <option value="Sem 4">Sem 4</option>
//             <option value="Sem 5">Sem 5</option>
//             <option value="Sem 6">Sem 6</option>
//             <option value="Sem 7">Sem 7</option>
//             <option value="Sem 8">Sem 8</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label className="">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             rows="4"
//             required
//           ></textarea>
//         </div>

//         <button type="submit" className="" disabled={loading}>
//           {loading ? "Creating..." : "Create Subject"}
//         </button>
//       </form>
//       <br />
//       <button className="" onClick={() => navigate("/Teacher-dash")}>
//         Cancel
//       </button>
//     </div>
//   );
// }

// export default CreateSubjectPage;
