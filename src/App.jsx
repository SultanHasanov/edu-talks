import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Avatar,
  Box,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
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
  AccountCircle,
  Settings,
  ExitToApp,
  Notifications,
  Help,
  KeyboardArrowDown,
  Close as CloseIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import ContainerRecomm from "./components/ContainerRecomm";
import TemplatesSection from "./components/TemplatesSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
const App = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { full_name, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLoginClick = () => {
    navigate("/auth");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    console.log(tabLabels);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleUserMenuClose();
  };

  const handleSettingsClick = () => {
    console.log("Переход в настройки");
    handleUserMenuClose();
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      handleUserMenuClose();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileTabClick = (index) => {
    setTabValue(index);
    handleMobileMenuClose();
  };

  const tabLabels = ["Рекомендации", "Шаблоны", "Сценарии", "Правовая база"];

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
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  flex: 1,
                  "& .MuiTab-root": {
                    fontSize: "15px",
                    textTransform: "none",
                    minWidth: "auto",
                    px: 2,
                    color: "#6b7280",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#7c3aed",
                  },
                  "& .Mui-selected": {
                    color: "#7c3aed !important",
                  },
                }}
              >
                {tabLabels.map((label, index) => (
                  <Tab key={index} label={label} />
                ))}
              </Tabs>
            </Box>
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
      {tabValue === 0 && (
        <ContainerRecomm tabValue={tabValue} tabLabels={tabLabels} />
      )}

      {tabValue === 1 && <TemplatesSection />}

      {tabValue !== 0 && tabValue !== 1 && (
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box
            sx={{
              minHeight: "500px",
              backgroundColor: "#f9fafb",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {tabLabels[tabValue]}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Здесь будет контент для раздела "{tabLabels[tabValue]}".
            </Typography>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default App;
