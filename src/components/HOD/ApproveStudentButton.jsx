import React from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ApproveStudentButton = ({ studentId, onApprove }) => {
  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/hod/students/approve/${studentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const data = response.data;
      onApprove(studentId);
    } catch (error) {
      console.error("❌ Error approving student:", error.message);
    }
  };

  return <button onClick={handleApprove}>Approve</button>;
};
export default ApproveStudentButton;
