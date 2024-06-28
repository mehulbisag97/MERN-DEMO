import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/verify`, { token })
        .then((response) => {
          setMessage("Welcome to the Dashboard!");
        })
        .catch((error) => {
          console.error("Verification error:", error);
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/logout`, { token });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {message}
        </Typography>
        <Button
          onClick={handleLogout}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
