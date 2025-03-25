// import { useNavigate } from "react-router-dom";
// import { Button, Container, Box, Typography, Paper } from "@mui/material";

// function Welcome() {
//   const navigate = useNavigate();

//   return (
//     <Container
//       maxWidth="md"
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100vh",
//         background: "#0d1117",
//         color: "#ffffff",
//         textAlign: "center",
//       }}
//     >
//       <Paper
//         elevation={10}
//         sx={{
//           padding: "50px",
//           borderRadius: "15px",
//           background:
//             "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
//           backdropFilter: "blur(12px)",
//           textAlign: "center",
//           border: "1px solid rgba(255, 255, 255, 0.2)",
//           boxShadow: "0px 10px 30px rgba(0, 255, 255, 0.2)",
//           transition: "all 0.3s ease-in-out",
//           "&:hover": {
//             boxShadow: "0px 15px 40px rgba(0, 255, 255, 0.3)",
//           },
//         }}
//       >
//         <Typography
//           variant="h3"
//           gutterBottom
//           sx={{
//             fontWeight: "bold",
//             textShadow: "0px 0px 10px rgba(0, 255, 255, 0.6)",
//           }}
//         >
//           Welcome to Digital Classroom
//         </Typography>

//         <Box sx={{ display: "flex", gap: 3, mt: 4, justifyContent: "center" }}>
//           <Button
//             variant="contained"
//             onClick={() => navigate("/signup")}
//             sx={{
//               fontSize: "1.2rem",
//               padding: "14px 28px",
//               borderRadius: "12px",
//               background: "#00ffff",
//               color: "#000",
//               fontWeight: "bold",
//               boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.5)",
//               "&:hover": {
//                 background: "#00e6e6",
//                 boxShadow: "0px 0px 30px rgba(0, 255, 255, 0.7)",
//               },
//             }}
//           >
//             Signup
//           </Button>

//           <Button
//             variant="outlined"
//             onClick={() => navigate("/login")}
//             sx={{
//               fontSize: "1.2rem",
//               padding: "14px 28px",
//               borderRadius: "12px",
//               border: "2px solid #00ffff",
//               color: "#00ffff",
//               fontWeight: "bold",
//               boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.5)",
//               "&:hover": {
//                 background: "rgba(0, 255, 255, 0.2)",
//                 boxShadow: "0px 0px 25px rgba(0, 255, 255, 0.8)",
//               },
//             }}
//           >
//             Login
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// }

// export default Welcome;

import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <h1>Welcome to Digital Classroom</h1>
      <div className="button-container">
        <button onClick={() => navigate("/signup")}>Signup</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Welcome;
