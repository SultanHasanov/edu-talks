import { Container,  Box } from "@mui/material";

import UserFiles from "../components/UserFiles";

const TemplatesSection = () => {

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
       

        <UserFiles  />
      </Box>
    </Container>
  );
};

export default TemplatesSection;