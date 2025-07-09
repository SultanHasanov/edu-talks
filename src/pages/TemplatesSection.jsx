import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TemplatesSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "90%" : 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    outline: "none",
  };

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

        {/* Шаблон приказа (имитация Word) */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            cursor: "pointer",
            width: "60%", // Занимает половину ширины
            minWidth: 300, // Минимальная ширина
            maxWidth: 700, // Максимальная ширина
            [theme.breakpoints.down("md")]: {
              width: "70%", // На средних экранах занимает 70%
            },
            [theme.breakpoints.down("sm")]: {
              width: "90%", // На маленьких экранах занимает 90%
            },
            "&:hover": {
              boxShadow: 6,
            },
          }}
          onClick={handleOpenModal}
        >
          <Box
            sx={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              ПРИКАЗ
            </Typography>

            <Typography align="right" sx={{ mb: 2 }}>
              № _______
            </Typography>

            <Typography align="right" sx={{ mb: 3 }}>
              от "___" ________ 20__ г.
            </Typography>

            <Typography paragraph sx={{ textIndent: "1.5cm", mb: 2 }}>
              В соответствии с
              _______________________________________________________
            </Typography>

            <Typography paragraph sx={{ textIndent: "1.5cm", mb: 2 }}>
              ПРИКАЗЫВАЮ:
            </Typography>

            <Typography paragraph sx={{ textIndent: "1.5cm", mb: 2 }}>
              1.
              ____________________________________________________________________
            </Typography>

            <Typography paragraph sx={{ textIndent: "1.5cm", mb: 2 }}>
              2.
              ____________________________________________________________________
            </Typography>

            <Typography paragraph sx={{ textIndent: "1.5cm", mb: 4 }}>
              3. Контроль за исполнением настоящего приказа оставляю за собой.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
              <Typography>Руководитель</Typography>
              <Typography sx={{}}>
                _________________/_________________/
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, alignSelf: "center" }}
        >
          Нажмите на шаблон, чтобы использовать его
        </Typography>

        {/* Модальное окно для подписки */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="subscription-modal"
          aria-describedby="subscription-modal-description"
        >
          <Box sx={modalStyle}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography id="subscription-modal" variant="h6" component="h2">
                Премиум доступ
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography id="subscription-modal-description" sx={{ mb: 3 }}>
              Для использования шаблонов документов необходимо оформить подписку
              на премиум-доступ.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                Преимущества подписки:
              </Typography>
              <ul style={{ marginLeft: "20px" }}>
                <li>Доступ ко всем шаблонам документов</li>
                <li>Возможность редактирования и скачивания</li>
                <li>Автоматическое заполнение данных</li>
                <li>Поддержка 24/7</li>
              </ul>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{ mr: 2 }}
              >
                Позже
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/auth");
                  handleCloseModal();
                }}
              >
                Оформить подписку
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default TemplatesSection;
