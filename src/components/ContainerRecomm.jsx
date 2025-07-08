import { Typography, Box, Container } from "@mui/material";
const ContainerRecomm = ({ tabValue, tabLabels }) => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: 600, color: "#1f2937" }}
        >
          Актуальное
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 3,
            mb: 4,
          }}
        >
          {/* Первая карточка */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                height: 200,
                backgroundColor: "#e8f2ff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  backgroundColor: "#93c5fd",
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <Typography style={{ fontWeight: 600 }}>
                  РЕКОМЕНДАЦИЯ
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 140,
                  height: 120,
                  backgroundColor: "#5b8def",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 60,
                    backgroundColor: "#4c6ef5",
                    borderRadius: 1,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 10,
                      left: 10,
                      right: 10,
                      bottom: 10,
                      border: "2px solid #fff",
                      borderRadius: "2px",
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  width: 80,
                  height: 80,
                  backgroundColor: "#4c6ef5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#364fc7",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
              >
                Как написать содержательный раздел ООП под ФОП
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Сегодня
              </Typography>
            </Box>
          </Box>

          {/* Вторая карточка */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                height: 200,
                backgroundColor: "#e8f2ff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 100,
                  height: 80,
                  backgroundColor: "#5b8def",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 50,
                    backgroundColor: "#4c6ef5",
                    borderRadius: 1,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 8,
                      left: 8,
                      right: 8,
                      bottom: 8,
                      border: "2px solid #fff",
                      borderRadius: "2px",
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  width: 70,
                  height: 70,
                  backgroundColor: "#4c6ef5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 35,
                    height: 35,
                    backgroundColor: "#364fc7",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
              >
                Поакальный акт
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Сегодня
              </Typography>
            </Box>
          </Box>

          {/* Третья карточка */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                height: 200,
                backgroundColor: "#e8f2ff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 80,
                  height: 60,
                  backgroundColor: "#4c6ef5",
                  borderRadius: 2,
                  // position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 8,
                    left: 8,
                    right: 8,
                    bottom: 8,
                    border: "2px solid #fff",
                    borderRadius: "2px",
                  },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  width: 70,
                  height: 70,
                  backgroundColor: "#5b8def",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 35,
                    height: 35,
                    backgroundColor: "#364fc7",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
              >
                Правила приема в школу
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Сегодня
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Вторая секция */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 3,
          }}
        >
          {/* Четвертая карточка */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                height: 200,
                backgroundColor: "#e8f2ff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  backgroundColor: "#93c5fd",
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <Typography style={{ fontWeight: 600 }}>ОБРАЗЕЦ</Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 100,
                  height: 80,
                  backgroundColor: "#5b8def",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 50,
                    backgroundColor: "#4c6ef5",
                    borderRadius: 1,
                    position: "relative",
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  width: 80,
                  height: 80,
                  backgroundColor: "#4c6ef5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#364fc7",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
              >
                Справка об обучении для сдающих ЕГЭ
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Сегодня
              </Typography>
            </Box>
          </Box>

          {/* Пятая карточка */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                height: 200,
                backgroundColor: "#e8f2ff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 80,
                  height: 60,
                  backgroundColor: "#5b8def",
                  borderRadius: 2,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  width: 70,
                  height: 70,
                  backgroundColor: "#4c6ef5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 35,
                    height: 35,
                    backgroundColor: "#364fc7",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
              >
                Сак оформить отношения с учеником, который не сдал ЕГЭ
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Сегодня
              </Typography>
            </Box>
          </Box>

          {/* Шестая карточка */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                height: 200,
                backgroundColor: "#e8f2ff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  backgroundColor: "#93c5fd",
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <Typography style={{ fontWeight: 600 }}>ИЗМЕНЕНИЯ</Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 80,
                  height: 60,
                  backgroundColor: "#5b8def",
                  borderRadius: 2,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  width: 70,
                  height: 70,
                  backgroundColor: "#4c6ef5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 35,
                    height: 35,
                    backgroundColor: "#364fc7",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
              >
                Изменения в учебных планах с 1 сентября 2025 года
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Сегодня
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ContainerRecomm;
