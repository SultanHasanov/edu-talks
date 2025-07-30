import { Container,  Box } from "@mui/material";

import UserFiles from "../components/UserFiles";
import { useState } from "react";

const TemplatesSection = () => {
  const [queryParam, setQueryParam] = useState("template"); 
  return (
    <Container  sx={{ py: 3 }}>
      
       

        <UserFiles queryParam={queryParam} />
    </Container>
  );
};

export default TemplatesSection;