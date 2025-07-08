import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Avatar,
  Box,
  InputAdornment,
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  AccountCircle,
  Settings,
  ExitToApp,
  Notifications,
  Help,
  KeyboardArrowDown,
  Login as LoginIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const { full_name, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const handleLoginClick = () => {
    navigate("/auth");
  };

  return (
    <Box>
      {/* Main Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          color: "#1f2937",
          // borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Container maxWidth="xl" sx={{ padding: "0 !important" }}>
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo */}
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#7c3aed",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  B
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#1f2937",
                  fontSize: "24px",
                }}
              >
                EduTalks
              </Typography>
            </Box>

            {/* Search */}
            <Box
              sx={{
                flex: 1,
                maxWidth: "400px",
                mx: 4,
                transition: "max-width 0.3s ease-in-out",
                "&:focus-within": {
                  maxWidth: "500px",
                },
              }}
            >
              <TextField
                fullWidth
                placeholder="Поиск по всем материалам"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "8px",
                    height: "40px",
                    backgroundColor: "#fff",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7c3aed",
                        borderWidth: "2px",
                      },
                    },
                  },
                }}
              />
            </Box>

            {/* User Info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleUserMenuOpen}
                    endIcon={<KeyboardArrowDown />}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      textTransform: "none",
                      color: "#374151",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: "transparent",
                        color: "#6b7280",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#374151",
                        fontSize: "14px",
                      }}
                    >
                      {full_name}
                    </Typography>
                  </Button>

                  {/* User Menu */}
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    onClick={handleUserMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        minWidth: 200,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleProfileClick}>
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Профиль</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleSettingsClick}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Настройки</ListItemText>
                    </MenuItem>

                    <MenuItem>
                      <ListItemIcon>
                        <Notifications fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Уведомления</ListItemText>
                    </MenuItem>

                    <MenuItem>
                      <ListItemIcon>
                        <Help fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Помощь</ListItemText>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogoutClick}>
                      <ListItemIcon>
                        <ExitToApp fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Выйти</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  onClick={handleLoginClick}
                  sx={{
                    textTransform: "none",
                    color: "#374151",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                      borderColor: "#9ca3af",
                    },
                  }}
                >
                  Войти
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;