import React from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ApproveButton = ({ teacherId, onApprove }) => {
  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/hod/teachers/approve/${teacherId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log("✅ API Response:", data);
      onApprove(teacherId);
    } catch (error) {
      console.error("❌ Error approving teacher:", error.message);
    }
  };
  return <button onClick={handleApprove}>Approve</button>;
};

export default ApproveButton;
