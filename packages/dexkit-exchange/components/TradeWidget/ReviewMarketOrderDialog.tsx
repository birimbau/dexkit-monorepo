import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import { useNetworkMetadata } from "@dexkit/ui/hooks/app";
import CheckIcon from "@mui/icons-material/Check";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  lighten,
} from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

export interface ReviewMarketOrderDialogProps {
  DialogProps: DialogProps;
  isPlacingOrder?: boolean;
  quoteAmount?: BigNumber;
  baseAmount?: BigNumber;
  price?: string;
  quoteToken?: Token;
  baseToken?: Token;
  isApproval?: boolean;
  isApproving?: boolean;
  side?: "sell" | "buy";
  hash?: string;
  chainId?: ChainId;
  onApprove?: () => void;
  onConfirm: () => void;
}

export default function ReviewMarketOrderDialog({
  DialogProps,
  quoteToken,
  quoteAmount,
  isPlacingOrder,
  price,
  onApprove,
  baseToken,
  isApproving,
  isApproval,
  onConfirm,
  side,
  baseAmount: amount,
  chainId,
  hash,
}: ReviewMarketOrderDialogProps) {
  const { getBlockExplorerUrl } = useNetworkMetadata();

  const pricePerTokenInverseFormatted = useMemo(() => {
    if (price && Number(price) > 0) {
      return new Intl.NumberFormat(undefined, {
        maximumSignificantDigits: 3,
      }).format(1 / Number(price) || 0);
    }
  }, [price]);

  const amountFormatted = useMemo(() => {
    if (amount) {
      return ethers.utils.formatUnits(amount, baseToken?.decimals);
    }

    return "0.00";
  }, [amount, baseToken]);

  const total = useMemo(() => {
    if (quoteAmount) {
      return ethers.utils.formatUnits(quoteAmount, quoteToken?.decimals);
    }

    return "0.00";
  }, [quoteAmount, quoteToken]);

  const renderActions = () => {
    if (isApproval) {
      return (
        <Stack spacing={2}>
          <Button
            size="large"
            onClick={onApprove}
            disabled={isApproving}
            startIcon={
              isApproving ? (
                <CircularProgress color="inherit" size="1rem" />
              ) : (
                <CheckIcon />
              )
            }
            fullWidth
            variant="contained"
            color="primary"
          >
            <FormattedMessage id="approve" defaultMessage="Approve" />
          </Button>
        </Stack>
      );
    }

    return (
      <Stack spacing={1}>
        <Button
          size="large"
          startIcon={
            isPlacingOrder ? (
              <CircularProgress size="1rem" color="inherit" />
            ) : undefined
          }
          disabled={isPlacingOrder}
          onClick={onConfirm}
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="place.order" defaultMessage="Place Order" />
        </Button>
        {hash && (
          <Button
            size="large"
            href={`${getBlockExplorerUrl(chainId)}/tx/${hash}`}
            target="_blank"
            variant="outlined"
            color="primary"
          >
            <FormattedMessage
              id="view.transaction"
              defaultMessage="View transaction"
            />
          </Button>
        )}
      </Stack>
    );
  };

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const [swapPrices, setSwapPrices] = useState(true);

  const handleSwapPrices = () => setSwapPrices((val) => !val);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="review.order" defaultMessage="Review Order" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Stack>
            <Typography align="center" variant="body1" color="text.secondary">
              {side === "sell" ? (
                <FormattedMessage
                  id="you.are.selling"
                  defaultMessage="You are selling"
                />
              ) : (
                <FormattedMessage
                  id="you.are.buying"
                  defaultMessage="You are buying"
                />
              )}
            </Typography>
            <Stack
              justifyContent="center"
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <Typography
                sx={(theme) => ({
                  fontWeight: 600,
                  color:
                    side === "sell"
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                })}
                align="right"
                variant="h5"
              >
                {amountFormatted} {baseToken?.symbol.toUpperCase()}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: (theme) =>
                  lighten(theme.palette.background.default, 0.2),
              }}
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">
                    <FormattedMessage id="price" defaultMessage="Price" />
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {swapPrices ? (
                      <Typography color="text.secondary" variant="body1">
                        1 {baseToken?.symbol.toUpperCase()} = {price}{" "}
                        {quoteToken?.symbol.toUpperCase()}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary" variant="body1">
                        1 {quoteToken?.symbol.toUpperCase()} ={" "}
                        {pricePerTokenInverseFormatted}{" "}
                        {baseToken?.symbol.toUpperCase()}
                      </Typography>
                    )}
                    <IconButton onClick={handleSwapPrices} size="small">
                      <SwapHorizIcon />
                    </IconButton>
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">
                    {side === "sell" ? (
                      <FormattedMessage id="total" defaultMessage="Total" />
                    ) : (
                      <FormattedMessage id="cost" defaultMessage="Cost" />
                    )}
                  </Typography>
                  <Typography color="text.secondary" variant="body1">
                    {total} {quoteToken?.symbol.toUpperCase()}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
          {renderActions()}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
