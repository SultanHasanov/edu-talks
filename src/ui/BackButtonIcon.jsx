import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

export default function BackButtonIcon() {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(-1)}
      sx={{
        mt: 2,
        mb: 2,
        borderRadius: 2,
        textTransform: "none",
        fontSize: "1rem",
        px: 2,
      }}
    >
      Назад
    </Button>
  );
}
