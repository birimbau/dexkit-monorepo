import TradeWidget from "@dexkit/exchange/components/TradeWidget";
import { Container } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <TradeWidget makerToken="" takerToken="" />
    </Container>
  );
}
