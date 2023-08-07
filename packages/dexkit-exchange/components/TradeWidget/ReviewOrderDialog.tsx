import { useApproveToken, useTokenAllowanceQuery } from "@dexkit/core/hooks";
import { Token } from "@dexkit/core/types";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  lighten,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { BigNumberUtils, getZrxExchangeAddress } from "../../utils";

export interface ReviewOrderDialogProps {
  DialogProps: DialogProps;
  isPlacingOrder?: boolean;
  amount?: number;
  amountPerToken?: ethers.BigNumber;
  makerToken?: Token;
  takerToken?: Token;
  isMakerTokenApproval?: boolean;
  onConfirm: () => void;
}

enum ReviewLimitOrderStep {
  APPROVE,
  PLACE_ORDER,
  CONFIRMATION,
}

export default function ReviewOrderDialog({
  isMakerTokenApproval,
  DialogProps,
  makerToken,
  amount,
  amountPerToken,
  takerToken,
  isPlacingOrder,
  onConfirm,
}: ReviewOrderDialogProps) {
  const { account, provider, chainId } = useWeb3React();

  const [step, setStep] = useState<ReviewLimitOrderStep>();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: makerToken?.contractAddress,
  });

  const cost = useMemo(() => {
    if (amount && amountPerToken) {
      return new BigNumberUtils().multiply(amountPerToken, amount);
    }

    return ethers.BigNumber.from(0);
  }, [amount, amountPerToken]);

  const formattedCost = useMemo(() => {
    return ethers.utils.formatUnits(cost, makerToken?.decimals);
  }, [cost, makerToken]);

  const approveTokenMutation = useApproveToken();

  const handleApprove = async () => {
    await approveTokenMutation.mutateAsync({
      onSubmited: (hash: string) => {},
      spender: getZrxExchangeAddress(chainId),
      provider,
      tokenContract: makerToken?.contractAddress,
      amount: cost,
    });

    await tokenAllowanceQuery.refetch();
  };

  const hasSufficientBalance = useMemo(() => {}, []);

  const renderActions = () => {
    if (
      tokenAllowanceQuery.data !== null &&
      tokenAllowanceQuery.data?.lt(cost)
    ) {
      return (
        <Stack spacing={2}>
          <Box></Box>
          <Button
            onClick={handleApprove}
            disabled={approveTokenMutation.isLoading}
            startIcon={
              approveTokenMutation.isLoading ? (
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>
            <FormattedMessage id="price" defaultMessage="Price" />
          </Typography>
          <Typography></Typography>
        </Stack>
        <Button
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
      </Stack>
    );
  };

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="review.order" defaultMessage="Review Order" />
        }
        onClose={handleClose}
      />
      {tokenAllowanceQuery.isLoading ? (
        <LinearProgress color="primary" />
      ) : (
        <Divider />
      )}
      <DialogContent>
        <Stack spacing={2}>
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
                    <FormattedMessage id="cost" defaultMessage="Cost" />
                  </Typography>
                  <Typography variant="body1">
                    {formattedCost} {makerToken?.symbol.toUpperCase()}
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
