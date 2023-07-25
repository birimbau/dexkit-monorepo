import Button from "@mui/material/Button";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useAppConfig } from "../hooks";
import { useCurrency } from "../hooks/currency";
//import "./Transak";

interface Props {
  label?: string;
}

export function TransakButton({ label }: Props) {
  const { account, isActive } = useWeb3React();
  const appConfig = useAppConfig();
  const currency = useCurrency();
  const transak = useRef<any>();

  useEffect(() => {
    if (appConfig.transak?.enabled) {
      if (account !== undefined) {
        import("@transak/transak-sdk").then((transakSDK) => {
          transak.current = new transakSDK({
            apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY, // Your API Key
            environment:
              process.env.NODE_ENV === "production"
                ? "PRODUCTION"
                : "PRODUCTION", // STAGING/PRODUCTION
            hostURL: window.location.origin,
            widgetHeight:
              window.innerHeight > 840
                ? "770px"
                : `${window.innerHeight - 70}px`,
            widgetWidth:
              window.innerWidth > 500 ? "500px" : `${window.innerWidth - 10}px`,
            walletAddress: account, // Your customer's wallet address
            fiatCurrency: currency.toUpperCase(), // If you want to limit fiat selection eg 'USD'
          });
        });
      }
    }
  }, [account, currency]);

  const handleBuy = () => {
    transak.current?.init();
  };

  return (
    <Button
      onClick={handleBuy}
      disabled={!isActive}
      variant="contained"
      color="primary"
    >
      <FormattedMessage id="buy" defaultMessage={label || "Buy"} />
    </Button>
  );
}
