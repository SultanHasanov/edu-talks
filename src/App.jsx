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
} from "@mui/icons-material";
import ContainerRecomm from "./components/ContainerRecomm";
import TemplatesSection from "./components/TemplatesSection";
import { useNavigate } from "react-router-dom";
const App = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
 const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    console.log("Переход в профиль");
    handleUserMenuClose();
  };

  const handleSettingsClick = () => {
    console.log("Переход в настройки");
    handleUserMenuClose();
  };

  const handleLogoutClick = () => {
    console.log("Выход из системы");
    handleUserMenuClose();
    navigate("/auth");
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

  const tabLabels = [
    "Рекомендации",
    "Шаблоны",
    "Сценарии",
    "Правовая база",
  ];

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
        <Container maxWidth="xl" sx={{padding: "0 !important",}}>
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
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
                  Эсет Джабраилова
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
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
