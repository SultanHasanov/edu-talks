import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import FileUploadSection from "../components/FileUploadSection";

const TemplatesSection = () => {
  const access_token = localStorage.getItem("access_token");

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, alignSelf: "flex-start" }}
        >
          Шаблоны документов
        </Typography>

        <FileUploadSection access_token={access_token} />
      </Box>
    </Container>
  );
};

export default TemplatesSection;