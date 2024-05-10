import { ChainId } from "@dexkit/core/constants/enums";
import { useIsMobile } from "@dexkit/core/hooks";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";
import AppDialogTitle from "../../../components/AppDialogTitle";

import { ZeroExQuoteResponse } from "../../../services/zeroex/types";

import { Token } from "@dexkit/core/types";
import { useMemo } from "react";
import { formatBigNumber } from "../../../utils";
import SwapFeeSummary from "../SwapFeeSummary";
import { ExecSwapState } from "../constants/enum";

export interface SwapConfirmDialogProps {
  DialogProps: DialogProps;
  quote?: ZeroExQuoteResponse | null;
  chainId?: ChainId;
  execSwapState: ExecSwapState;
  isQuoting?: boolean;
  onConfirm: () => void;
  currency: string;
  isLoadingSignGasless?: boolean;
  sellToken?: Token;
  buyToken?: Token;
}

export default function SwapConfirmDialog({
  DialogProps,
  quote,
  isQuoting,
  chainId,
  onConfirm,
  execSwapState,
  isLoadingSignGasless,
  currency,
  sellToken,
  buyToken,
}: SwapConfirmDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const btnMessage = useMemo(() => {
    if (execSwapState === ExecSwapState.gasless_approval) {
      return (
        <FormattedMessage
          id="approve.token.gasless"
          defaultMessage="Approve {symbol}"
          values={{ symbol: sellToken?.symbol?.toUpperCase() || "" }}
        />
      );
    }
    if (execSwapState === ExecSwapState.gasless_trade_submit) {
      return (
        <FormattedMessage
          id="submitting.trade"
          defaultMessage="Submitting trade"
        />
      );
    }
    if (execSwapState === ExecSwapState.gasless_trade) {
      return (
        <FormattedMessage id="submit.trade" defaultMessage="Submit trade" />
      );
    }

    return <FormattedMessage id="confirm" defaultMessage="Confirm" />;
  }, [execSwapState, sellToken]);

  const isMobile = useIsMobile();

  return (
    <Dialog {...DialogProps} onClose={handleClose} fullScreen={isMobile}>
      <AppDialogTitle
        title={
          <FormattedMessage id="confirm.swap" defaultMessage="Confirm swap" />
        }
        onClose={handleClose}
      />
      {isQuoting ? (
        <LinearProgress color="primary" sx={{ height: "1px" }} />
      ) : (
        <Divider />
      )}
      <DialogContent>
        <Stack spacing={2}>
          {quote && sellToken && buyToken && (
            <>
              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    <FormattedMessage id="you.send" defaultMessage="You send" />
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {formatBigNumber(
                      BigNumber.from(quote.sellAmount),
                      sellToken.decimals
                    )}{" "}
                    {sellToken?.symbol?.toUpperCase()}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    <FormattedMessage
                      id="you.receive"
                      defaultMessage="You receive"
                    />
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {formatBigNumber(
                      BigNumber.from(quote.buyAmount),
                      buyToken.decimals
                    )}{" "}
                    {buyToken?.symbol?.toUpperCase()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
            </>
          )}
          <SwapFeeSummary
            quote={quote}
            chainId={chainId}
            currency={currency}
            sellToken={sellToken}
            buyToken={buyToken}
          />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        {isLoadingSignGasless ? (
          <Button
            disabled={isLoadingSignGasless}
            onClick={onConfirm}
            variant="contained"
            startIcon={<CircularProgress size={20} />}
          >
            <FormattedMessage
              id="confirm.on.wallet"
              defaultMessage="Confirm on wallet"
            />
          </Button>
        ) : (
          <Button disabled={isQuoting} onClick={onConfirm} variant="contained">
            {btnMessage}
          </Button>
        )}
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
