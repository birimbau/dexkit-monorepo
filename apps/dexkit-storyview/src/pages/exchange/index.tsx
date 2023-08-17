import OrdersTable from "@dexkit/exchange/components/OrdersTable";
import TradeWidget from "@dexkit/exchange/components/TradeWidget";
import { KIT_TOKEN, USDT_TOKEN } from "@dexkit/exchange/constants";
import { DexkitExchangeContext } from "@dexkit/exchange/contexts";
import { Container, Grid } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

export default function ExchangePage() {
  const { provider, account, chainId } = useWeb3React();

  return (
    <DexkitExchangeContext.Provider
      value={{
        baseToken: KIT_TOKEN,
        quoteToken: USDT_TOKEN,
        zrxApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY,
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TradeWidget />
          </Grid>
          <Grid item xs={12} sm={8}>
            <OrdersTable
              account={account}
              chainId={chainId}
              provider={provider}
            />
          </Grid>
        </Grid>
      </Container>
    </DexkitExchangeContext.Provider>
  );
}
