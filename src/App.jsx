import React from "react";
import {
  Typography,
  Box,
  IconButton,
  Container,
  ListItemText,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileTabClick = (index) => {
    navigate(tabRoutes[index]);
    handleMobileMenuClose();
  };

  return (
    <Box>
      {/* Navigation Tabs */}
      {!isMobile && (
        <Box
          sx={{
            backgroundColor: "#fff",
            // borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
              }}
            ></Box>
          </Container>
        </Box>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <Box
          sx={{
            backgroundColor: "#fff",
            // borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: 3,
                py: 1,
              }}
            >
              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{
                  color: "#6b7280",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Container>
        </Box>
      )}

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: "#fff",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "#1f2937" }}>
              Навигация
            </Typography>
            <IconButton onClick={handleMobileMenuClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {tabLabels.map((label, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleMobileTabClick(index)}
                  selected={tabValue === index}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#f3f4f6",
                      color: "#7c3aed",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: "15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default App;
