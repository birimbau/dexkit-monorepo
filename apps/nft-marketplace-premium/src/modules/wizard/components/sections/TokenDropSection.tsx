import LazyTextField from '@dexkit/ui/components/LazyTextField';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
  ClaimEligibility,
  useActiveClaimConditionForWallet,
  useClaimConditions,
  useClaimIneligibilityReasons,
  useClaimerProofs,
  useContract,
  useContractMetadata,
  useTokenSupply,
} from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { TokenDropPageSection } from '../../types/section';

export function parseIneligibility(
  reasons: ClaimEligibility[],
  quantity = 0,
): string {
  if (!reasons.length) {
    return '';
  }

  const reason = reasons[0];

  if (
    reason === ClaimEligibility.Unknown ||
    reason === ClaimEligibility.NoActiveClaimPhase ||
    reason === ClaimEligibility.NoClaimConditionSet
  ) {
    return 'This drop is not ready to be minted.';
  } else if (reason === ClaimEligibility.NotEnoughTokens) {
    return "You don't have enough currency to mint.";
  } else if (reason === ClaimEligibility.AddressNotAllowed) {
    if (quantity > 1) {
      return `You are not eligible to mint ${quantity} tokens.`;
    }

    return 'You are not eligible to mint at this time.';
  }

  return reason;
}

export interface TokenDropSectionProps {
  section: TokenDropPageSection;
}

export default function TokenDropSection({ section }: TokenDropSectionProps) {
  const { formatMessage } = useIntl();

  const { address: tokenAddress, network } = section.settings;

  const { contract } = useContract(tokenAddress as string, 'token-drop');

  const { account } = useWeb3React();

  const [lazyQuantity, setQuantity] = useState(1);

  const { data: contractMetadata } = useContractMetadata(contract);

  const claimConditions = useClaimConditions(contract);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    contract,
    account,
  );

  const claimerProofs = useClaimerProofs(contract, account || '');

  const claimIneligibilityReasons = useClaimIneligibilityReasons(contract, {
    quantity: lazyQuantity,
    walletAddress: account || '',
  });

  const claimedSupply = useTokenSupply(contract);

  const availableSupply = useMemo(() => {
    const supplyStr = activeClaimCondition.data?.availableSupply;

    let amount = '0';

    if (supplyStr && supplyStr?.indexOf('.') > -1) {
      amount = activeClaimCondition.data?.availableSupply.split('.')[0] || '0';
    }

    return BigNumber.from(amount);
  }, [activeClaimCondition.data?.availableSupply]);

  const totalAvailableSupply = useMemo(() => {
    try {
      return availableSupply;
    } catch {
      return BigNumber.from(1_000_000_000);
    }
  }, [availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data?.value || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(claimedSupply.data?.value || 0);
    if (n.gte(1_000_000_000)) {
      return '';
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const priceToMint = useMemo(() => {
    if (lazyQuantity) {
      const bnPrice =
        activeClaimCondition.data?.currencyMetadata.value || BigNumber.from(0);

      return `${utils.formatUnits(
        bnPrice.mul(lazyQuantity).toString(),
        activeClaimCondition.data?.currencyMetadata.decimals || 18,
      )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
    }
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    lazyQuantity,
  ]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable =
        BigNumber.from(activeClaimCondition.data?.maxClaimableSupply) ||
        BigNumber.from(0);
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0,
      );
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === '0') {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigNumber.from(1_000_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

    let max;

    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000_000)) {
      return 1_000_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    console.log(
      availableSupply,
      numberClaimed,
      numberTotal,
      activeClaimCondition.data,
    );

    if (
      activeClaimCondition.data?.maxClaimablePerWallet === 'unlimited' &&
      activeClaimCondition.data?.maxClaimablePerWallet === 'unlimited'
    ) {
      return false;
    }

    try {
      return (
        (activeClaimCondition.isSuccess && availableSupply.lte(0)) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      console.log('e', e);
      return false;
    }
  }, [
    availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
  ]);

  const canClaim = useMemo(() => {
    return (
      activeClaimCondition.isSuccess &&
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data?.length === 0 &&
      !isSoldOut
    );
  }, [
    activeClaimCondition.isSuccess,
    claimIneligibilityReasons.data?.length,
    claimIneligibilityReasons.isSuccess,
    isSoldOut,
  ]);

  const isLoading = useMemo(() => {
    return activeClaimCondition.isLoading || !contract;
  }, [activeClaimCondition.isLoading, contract]);

  const buttonLoading = useMemo(() => {
    return isLoading || claimIneligibilityReasons.isFetching;
  }, [claimIneligibilityReasons.isLoading, isLoading]);

  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return <FormattedMessage id="sold.out" defaultMessage="Sold out" />;
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0,
      );
      if (pricePerToken.eq(0)) {
        return <FormattedMessage id="mint.free" defaultMessage="Mint (Free)" />;
      }
      return (
        <FormattedMessage
          id="mint.priceToMint"
          defaultMessage="Mint {priceToMint}"
          values={{ priceToMint }}
        />
      );
    }

    if (
      claimIneligibilityReasons.data &&
      claimIneligibilityReasons.data?.length > 0
    ) {
      return parseIneligibility(claimIneligibilityReasons.data, lazyQuantity);
    }

    if (buttonLoading) {
      return (
        <FormattedMessage
          id="checking.eligibility"
          defaultMessage="Checking eligibility..."
        />
      );
    }

    return (
      <FormattedMessage
        id="claiming.not.available"
        defaultMessage="Claiming not available"
      />
    );
  }, [
    isSoldOut,
    canClaim,
    claimIneligibilityReasons.data,
    buttonLoading,
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    lazyQuantity,
  ]);

  const handleChangeQuantity = (val: string) => {
    const value = parseInt(val);

    if (value > maxClaimable) {
      setQuantity(maxClaimable);
    } else if (value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  const claimMutation = useMutation(async () => {
    if (account) {
      return await contract?.erc20.claimTo(account, lazyQuantity.toString());
    }
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleExecute = async () => {
    if (canClaim) {
      try {
        await claimMutation.mutateAsync();
      } catch (err) {
        enqueueSnackbar(
          <FormattedMessage
            id="error.while.minting"
            defaultMessage="Error while minting"
          />,
          { variant: 'error' },
        );
      }
    }
  };

  return (
    <Container>
      <Stack spacing={2} alignItems={{ sm: 'flex-start', xs: 'center' }}>
        {(claimConditions.data &&
          claimConditions.data.length > 0 &&
          activeClaimCondition.isError) ||
          (activeClaimCondition.data &&
            activeClaimCondition.data.startTime > new Date() && (
              <Alert severity="warning">
                <FormattedMessage
                  id="drop.is.starting.soon.please.check.back.later"
                  defaultMessage="Drop is starting soon. Please check back later."
                />
              </Alert>
            ))}

        {claimConditions.data?.length === 0 ||
          (claimConditions.data?.every(
            (cc) => cc.maxClaimableSupply === '0',
          ) && (
            <Alert severity="info">
              <FormattedMessage
                id="this.drop.is.not.ready.to.be.minted.yet.no.claim.condition.set"
                defaultMessage="This drop is not ready to be minted yet. (No claim condition set)"
              />
            </Alert>
          ))}

        {isLoading ? (
          <Box>
            <Stack>
              <Skeleton height="4rem" width="4rem" variant="circular" />
              <Box>
                <Typography align="center" variant="h5">
                  <Skeleton />
                </Typography>
                <Typography align="center" variant="body1">
                  <Skeleton />
                </Typography>
              </Box>
            </Stack>
          </Box>
        ) : (
          <>
            {contractMetadata?.image && (
              <Avatar style={{ height: '6rem', width: '6rem' }}>
                <img
                  src={contractMetadata?.image}
                  alt={contractMetadata?.name!}
                  style={{ objectFit: 'contain', aspectRatio: '1/1' }}
                />
              </Avatar>
            )}

            <Box>
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="h5"
              >
                <FormattedMessage
                  id="claim.tokens"
                  defaultMessage="Claim tokens"
                />
              </Typography>
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="body1"
              >
                <FormattedMessage
                  id="claim.erc20.tokens.from.contractName"
                  defaultMessage="Claim ERC20 Tokens from {contractName}"
                  values={{ contractName: contractMetadata?.name }}
                />
              </Typography>
            </Box>
          </>
        )}

        <Divider />

        <Stack spacing={2} justifyContent="flex-start" alignItems="flex-start">
          <LazyTextField
            TextFieldProps={{
              type: 'number',
              sx: { width: { xs: '100%', sm: 'auto' } },
              placeholder: formatMessage({
                defaultMessage: 'Enter amount to claim',
                id: 'enter.amount.to.claim',
              }),
            }}
            value="1"
            onChange={handleChangeQuantity}
          />
          <Button
            size="large"
            disabled={!canClaim || claimMutation.isLoading}
            startIcon={
              claimMutation.isLoading ? (
                <CircularProgress size="1rem" color="inherit" />
              ) : undefined
            }
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={handleExecute}
            variant="contained"
          >
            {buttonText}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
