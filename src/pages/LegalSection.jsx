import { Container } from "@mui/material";
import UserFiles from "../components/UserFiles";
import { useState } from "react";

const LegalSection = () => {
  const [queryParam, setQueryParam] = useState("order");
  return (
    <Container sx={{ py: 3 }}>
      <UserFiles queryParam={queryParam} />
    </Container>
  );
};

export default LegalSection;
