import { useIsMobile } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { useCurrency } from "@dexkit/ui/hooks";
import { Box, Divider, Paper, Stack, Typography, lighten } from "@mui/material";
import { useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import PairButton from "../PairButton";

export interface PairInfoProps {
  quoteToken: Token;
  baseToken: Token;
  onSelectPair?: () => void;
  volume?: string;
  marketCap?: string;
  priceChangeH24?: string;
  lastPrice?: string;
}

export default function PairInfo({
  quoteToken,
  baseToken,
  onSelectPair,
  volume,
  marketCap,
  priceChangeH24,
  lastPrice,
}: PairInfoProps) {
  const [priceChange, color] = useMemo(() => {
    if (priceChangeH24) {
      let value = parseFloat(priceChangeH24);

      let color = "success.light";
      let formatted = `+${value}`;

      if (value < 0) {
        color = "error.main";
        formatted = priceChangeH24;
      }

      return [formatted, color];
    }

    return ["0.0", "text.primary"];
  }, [priceChangeH24]);

  const formattedVolume = useMemo(() => {
    if (volume) {
      return parseFloat(volume).toFixed(2);
    }
  }, [volume]);

  const formattedLastPrice = useMemo(() => {
    if (lastPrice) {
      return parseFloat(lastPrice).toFixed(2);
    }
  }, [lastPrice]);

  const formattedMarketCap = useMemo(() => {
    if (marketCap) {
      return parseFloat(marketCap).toFixed(2);
    }
  }, [lastPrice]);

  const { currency } = useCurrency();

  const renderHorizontal = () => {
    return (
      <Box>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          divider={
            <Divider
              orientation="vertical"
              sx={{
                height: "1rem",
                color: (theme) => lighten(theme.palette.divider, 0.2),
              }}
            />
          }
        >
          {formattedLastPrice && (
            <Typography color="text.secondary" variant="body2">
              <FormattedMessage
                id="last.price.amount"
                defaultMessage="Last price: {amount}"
                values={{
                  amount: (
                    <Typography color="text.primary" component="span">
                      <FormattedNumber
                        value={parseFloat(formattedLastPrice)}
                        currency={currency}
                        currencyDisplay="narrowSymbol"
                        style="currency"
                      />
                    </Typography>
                  ),
                }}
              />
            </Typography>
          )}
          <Typography color="text.secondary" variant="body2">
            <FormattedMessage
              id="market.cap.amount"
              defaultMessage="Price Change 24h: {amount}"
              values={{
                amount: (
                  <Typography sx={{ color }} component="span">
                    {priceChange}
                  </Typography>
                ),
              }}
            />
          </Typography>
          {formattedMarketCap && (
            <Typography color="text.secondary" variant="body2">
              <FormattedMessage
                id="market.cap.amount"
                defaultMessage="Market Cap: {amount}"
                values={{
                  amount: (
                    <Typography color="text.primary" component="span">
                      <FormattedNumber
                        value={parseFloat(formattedMarketCap)}
                        currency={currency}
                        currencyDisplay="narrowSymbol"
                        style="currency"
                      />
                    </Typography>
                  ),
                }}
              />
            </Typography>
          )}

          {formattedVolume && (
            <Typography color="text.secondary" variant="body2">
              <FormattedMessage
                id="24h.volume.amount"
                defaultMessage="24h volume: {amount}"
                values={{
                  amount: (
                    <Typography color="text.primary" component="span">
                      <FormattedNumber
                        value={parseFloat(formattedVolume)}
                        currency={currency}
                        currencyDisplay="narrowSymbol"
                        style="currency"
                      />
                    </Typography>
                  ),
                }}
              />
            </Typography>
          )}
        </Stack>
      </Box>
    );
  };

  const renderDataList = () => {
    return (
      <>
        <Divider />
        <Stack spacing={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" variant="body2">
              <FormattedMessage
                id="price.change.24h"
                defaultMessage="Price Change 24h"
              />
            </Typography>
            <Typography sx={{ color }} component="span">
              {priceChange}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" variant="body2">
              <FormattedMessage id="last.price" defaultMessage="Last price" />
            </Typography>
            {formattedLastPrice && (
              <Typography color="text.primary" component="span">
                <FormattedNumber
                  value={parseFloat(formattedLastPrice)}
                  currency={currency}
                  currencyDisplay="narrowSymbol"
                  style="currency"
                />
              </Typography>
            )}
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" variant="body2">
              <FormattedMessage
                id="24h.volume"
                defaultMessage="24h volume"
                values={{}}
              />
            </Typography>
            {formattedVolume && (
              <Typography color="text.primary" component="span">
                <FormattedNumber
                  value={parseFloat(formattedVolume)}
                  currency={currency}
                  currencyDisplay="narrowSymbol"
                  style="currency"
                />
              </Typography>
            )}
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" variant="body2">
              <FormattedMessage id="market.cap" defaultMessage="Market Cap" />
            </Typography>
            {formattedMarketCap && (
              <Typography color="text.primary" component="span">
                <FormattedNumber
                  value={parseFloat(formattedMarketCap)}
                  currency={currency}
                  currencyDisplay="narrowSymbol"
                  style="currency"
                />
              </Typography>
            )}
          </Stack>
        </Stack>
      </>
    );
  };

  const isMobile = useIsMobile();

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction={{ sm: "row" }}
        spacing={{ sm: 2, xs: 2 }}
        justifyContent={{ sm: "space-between" }}
        alignItems={{ sm: "center" }}
      >
        <PairButton
          quoteToken={quoteToken}
          baseToken={baseToken}
          onClick={onSelectPair}
        />
        {isMobile ? renderDataList() : renderHorizontal()}
      </Stack>
    </Paper>
  );
}
