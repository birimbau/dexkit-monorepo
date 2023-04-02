import { copyToClipboard, truncateAddress } from "@dexkit/core/utils";
import { AppDialogTitle } from "@dexkit/ui/components";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import { useDexKitContext } from "@dexkit/ui/hooks";
import FileCopy from "@mui/icons-material/FileCopy";

import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Connector } from "@web3-react/types";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CoinTypes } from "../../enum";
import {
  useErc20BalanceQuery,
  useEvmNativeBalance,
  useEvmTransferMutation,
} from "../../hooks";
import { Coin, EvmCoin } from "../../types";
import { EvmSendForm } from "../forms/EvmSendForm";

interface Props {
  dialogProps: DialogProps;
  account?: string;
  chainId?: number;
  provider?: ethers.providers.Web3Provider;
  coins?: EvmCoin[];
  defaultCoin?: EvmCoin;
  evmAccounts?: { address: string }[];
  connector?: Connector;
  to?: string;
  amount?: number;
  toAddress: string;
}

export default function EvmSendDialog({
  dialogProps,
  account,
  chainId,
  provider,
  evmAccounts,
  defaultCoin,
  coins,
  connector,
  to,
  amount,
}: Props) {
  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();

  const [values, setValues] = useState<{
    address?: string;
    amount?: number;
    coin?: Coin | null;
  }>({ address: to, amount: amount, coin: defaultCoin });

  const { data: nativeBalance, isLoading: isNativeBalanceLoading } =
    useEvmNativeBalance({
      provider,
      account,
    });

  const { data: erc20Balance, isLoading } = useErc20BalanceQuery({
    provider,
    account,
    tokenAddress:
      values.coin?.coinType === CoinTypes.EVM_ERC20
        ? values.coin?.contractAddress
        : undefined,
  });

  const { enqueueSnackbar } = useSnackbar();

  const { createNotification } = useDexKitContext();

  const handleSubmitTransaction = (
    hash: string,
    params: {
      address: string;
      amount: number;
      coin: Coin;
    }
  ) => {
    enqueueSnackbar(
      formatMessage({
        id: "transaction.submitted",
        defaultMessage: "Transaction Submitted",
      }),
      {
        variant: "info",
      }
    );
    if (chainId !== undefined) {
      const now = Date.now();

      createNotification({
        type: "transaction",
        subtype: "transfer",
        icon: "receipt",
        metadata: { chainId, hash },
        values: {
          amount: params.amount.toString(),
          symbol: params.coin.symbol,
          address: params.address,
        },
      });
    }
  };

  const evmTransferMutation = useEvmTransferMutation({
    provider,
    onSubmit: handleSubmitTransaction,
  });

  const handleCopy = () => {
    if (account) {
      copyToClipboard(account);
    }
  };

  const handleChange = (values: {
    address?: string;
    amount?: number;
    coin?: Coin | null;
  }) => {
    setValues(values);
  };

  const handleSubmit = async () => {
    if (values.address && values.amount && values.coin) {
      try {
        await evmTransferMutation.mutateAsync({
          address: values.address,
          amount: values.amount,
          coin: values.coin as EvmCoin,
        });
      } catch (err: any) {
        enqueueSnackbar(
          formatMessage(
            {
              id: "transaction.failed.reason",
              defaultMessage: "Transaction failed: {reason}",
            },
            { reason: String(err) }
          ),
          {
            variant: "error",
          }
        );
      }
    }
  };

  const evmCoins = useMemo(() => {
    return coins?.filter((c) => c.network.chainId === chainId);
  }, [coins]);

  const balance = useMemo(() => {
    if (values.coin) {
      if (values.coin.coinType === CoinTypes.EVM_ERC20 && erc20Balance) {
        return ethers.utils.formatUnits(erc20Balance, values.coin.decimals);
      } else if (
        values.coin.coinType === CoinTypes.EVM_NATIVE &&
        nativeBalance
      ) {
        return ethers.utils.formatUnits(nativeBalance, values.coin.decimals);
      }
    }

    return "0.0";
  }, [erc20Balance, values.coin, nativeBalance]);

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");

      evmTransferMutation.reset();
      setValues({
        address: "",
        amount: 0,
        coin: defaultCoin,
      });
    }
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={<FormattedMessage id="send" defaultMessage="Send" />}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Stack
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <Typography color="textSecondary" variant="caption">
              {truncateAddress(account)}{" "}
              <CopyIconButton
                iconButtonProps={{
                  onClick: handleCopy,
                  size: "small",
                  color: "inherit",
                }}
                tooltip={formatMessage({
                  id: "copy",
                  defaultMessage: "Copy",
                  description: "Copy text",
                })}
                activeTooltip={formatMessage({
                  id: "copied",
                  defaultMessage: "Copied!",
                  description: "Copied text",
                })}
              >
                <FileCopy fontSize="inherit" color="inherit" />
              </CopyIconButton>
            </Typography>

            <Typography variant="h4">
              {isLoading ? (
                <Skeleton />
              ) : (
                <>
                  {balance} {values.coin?.symbol}
                </>
              )}
            </Typography>
          </Stack>
          <Divider />
          <EvmSendForm
            isSubmitting={evmTransferMutation.isLoading}
            accounts={evmAccounts}
            values={values}
            onChange={handleChange}
            coins={evmCoins}
            onSubmit={handleSubmit}
            connector={connector}
            chainId={chainId}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
