import {  Container,  } from "@mui/material";
import { useState } from "react";
import UserFiles from "../components/UserFiles";

const ScriptSection = () => {
  const [queryParam, setQueryParam] = useState("scenario");
  return (
    <Container sx={{ py: 3 }}>
      <UserFiles queryParam={queryParam} />
    </Container>
  );
};

export default ScriptSection;
