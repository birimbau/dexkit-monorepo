import { useApproveToken, useTokenAllowanceQuery } from "@dexkit/core/hooks";
import { Token } from "@dexkit/core/types";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  lighten,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { FormattedMessage } from "react-intl";

export interface ReviewOrderDialogProps {
  DialogProps: DialogProps;
  takerAmount?: ethers.BigNumber;
  makerAmount?: ethers.BigNumber;
  makerToken?: Token;
  takerToken?: Token;
  isMakerTokenApproval?: boolean;
}

enum ReviewLimitOrderSteps {
  APPROVE,
  PLACE_ORDER,
  CONFIRMATION,
}

export default function ReviewOrderDialog({
  isMakerTokenApproval,
  DialogProps,
  makerToken,
  makerAmount,
}: ReviewOrderDialogProps) {
  const { account, provider, chainId } = useWeb3React();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    tokenAddress: makerToken?.contractAddress,
  });

  const approveTokenMutation = useApproveToken();

  const renderActions = () => {
    if (
      makerAmount !== undefined &&
      tokenAllowanceQuery.data?.lt(makerAmount)
    ) {
      return (
        <Stack spacing={2}>
          <Box>
            <Stepper activeStep={0} alternativeLabel>
              <Step>
                <StepLabel>
                  <FormattedMessage
                    id="approve.token"
                    defaultMessage="Approve Token"
                  />
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>
                  <FormattedMessage
                    id="place.order"
                    defaultMessage="Place Order"
                  />
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>
                  <FormattedMessage
                    id="confirmation"
                    defaultMessage="Confirmation"
                  />
                </StepLabel>
              </Step>
            </Stepper>
          </Box>
          <Button fullWidth variant="contained" color="primary">
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
      </Stack>
    );
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="review.order" defaultMessage="Review Order" />
        }
      />
      <Divider />
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
                  <Typography variant="body1"></Typography>
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
