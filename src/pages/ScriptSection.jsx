import { Box, Container, Typography } from '@mui/material';

const ScriptSection = () => {
    return (
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
              Сценарии
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Здесь будет контент для раздела "Сценарии".
            </Typography>
          </Box>
        </Container>
    );
};

export default ScriptSection;