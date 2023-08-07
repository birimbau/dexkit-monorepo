import TradeWidget from "@dexkit/exchange/components/TradeWidget";
import { KIT_TOKEN, USDT_TOKEN } from "@dexkit/exchange/constants";
import { DexkitExchangeContext } from "@dexkit/exchange/contexts";
import { Container, Grid } from "@mui/material";

export default function ExchangePage() {
  return (
    <Container>
      <Grid container spacing={12} justifyContent="center">
        <Grid item xs={12} sm={5}>
          <DexkitExchangeContext.Provider
            value={{ zrxApiKey: process.env.ZRX_API_KEY }}
          >
            <TradeWidget makerToken={USDT_TOKEN} takerToken={KIT_TOKEN} />
          </DexkitExchangeContext.Provider>
        </Grid>
      </Grid>
    </Container>
  );
}
