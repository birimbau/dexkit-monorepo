import { useIsMobile } from '@dexkit/core';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import {
  ClaimEligibility,
  detectContractFeature,
  useActiveClaimConditionForWallet,
  useClaimIneligibilityReasons,
  useClaimedNFTSupply,
  useClaimerProofs,
  useContract,
  useContractMetadata,
  useNFT,
  useOwnedNFTs,
  useUnclaimedNFTSupply,
} from '@thirdweb-dev/react';
import { ContractWrapper } from '@thirdweb-dev/sdk/dist/declarations/src/evm/core/classes/contract-wrapper';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useClaimNft } from '../../hooks';
import { NftDropPageSection } from '../../types/section';
import NFTGrid from '../NFTGrid';
import NFTDropSummary from '../NftDropSummary';

export interface NftDropSectionProps {
  section: NftDropPageSection;
}

export default function NftDropSection({ section }: NftDropSectionProps) {
  const { address, network } = section.settings;

  const { contract } = useContract(address as string, 'nft-drop');

  const { account } = useWeb3React();

  const contractMetadataQuery = useContractMetadata(contract);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    contract,
    account || '',
  );

  const claimerProofs = useClaimerProofs(contract, address || '');

  const [quantity, setQuantity] = useState(1);

  const claimIneligibilityReasons = useClaimIneligibilityReasons(contract, {
    quantity,
    walletAddress: account || '',
  });

  const unclaimedSupply = useUnclaimedNFTSupply(contract);

  const claimedSupply = useClaimedNFTSupply(contract);

  const nfts = useOwnedNFTs(contract, account || '');

  const parseIneligibility = (reasons: ClaimEligibility[], quantity = 0) => {
    if (!reasons.length) {
      return '';
    }

    const reason = reasons[0];

    if (
      reason === ClaimEligibility.Unknown ||
      reason === ClaimEligibility.NoActiveClaimPhase ||
      reason === ClaimEligibility.NoClaimConditionSet
    ) {
      return (
        <FormattedMessage
          id="this.drop.is.not.ready.to.be.minted."
          defaultMessage="This drop is not ready to be minted."
        />
      );
    } else if (reason === ClaimEligibility.NotEnoughTokens) {
      return (
        <FormattedMessage
          id="you.dont.have.enough.currency.to.mint"
          defaultMessage="You don't have enough currency to mint."
        />
      );
    } else if (reason === ClaimEligibility.AddressNotAllowed) {
      if (quantity > 1) {
        return (
          <FormattedMessage
            id="you.are.not.eligible.to.mint.quantity.tokens"
            defaultMessage="You are not eligible to mint {quantity} tokens."
            values={{ quantity }}
          />
        );
      }

      return (
        <FormattedMessage
          id="You.are.not.eligible.to.mint.at.this.time."
          defaultMessage="You are not eligible to mint at this time."
        />
      );
    }

    return reason.toString();
  };

  const { data: firstNft, isLoading: firstNftLoading } = useNFT(contract, 0);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0)
      .add(BigNumber.from(unclaimedSupply.data || 0))
      .toString();
  }, [claimedSupply.data, unclaimedSupply.data]);

  const isOpenEdition = useMemo(() => {
    if (contract) {
      const contractWrapper = (contract as any)
        .contractWrapper as ContractWrapper<any>;

      const featureDetected = detectContractFeature(
        contractWrapper,
        'ERC721SharedMetadata',
      );

      return featureDetected;
    }
    return false;
  }, [contract]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimableSupply || 0,
      );
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0,
      );
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === '0') {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigNumber.from(1_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

    const maxAvailable = BigNumber.from(unclaimedSupply.data || 0);

    let max;
    if (maxAvailable.lt(bnMaxClaimable) && !isOpenEdition) {
      max = maxAvailable;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    unclaimedSupply.data,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0,
          )) ||
        (numberClaimed === numberTotal && !isOpenEdition)
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
    isOpenEdition,
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
    return (
      activeClaimCondition.isLoading ||
      unclaimedSupply.isLoading ||
      claimedSupply.isLoading ||
      !contract
    );
  }, [
    activeClaimCondition.isLoading,
    contract,
    claimedSupply.isLoading,
    unclaimedSupply.isLoading,
  ]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0,
    );
    return `${utils.formatUnits(
      bnPrice.mul(quantity).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18,
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading],
  );

  const buttonMessage = useMemo(() => {
    if (isSoldOut) {
      return <FormattedMessage id="sold.out" defaultMessage="Sold Out" />;
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0,
      );

      if (pricePerToken.eq(0)) {
        return <FormattedMessage id="claim.free" defaultMessage="Claim free" />;
      }

      return (
        <FormattedMessage
          id="clain.priceToMint"
          defaultMessage="Claim ({priceToMint})"
          values={{ priceToMint }}
        />
      );
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
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
        id="Claiming not available"
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
    quantity,
  ]);

  const nftDropClaim = useClaimNft({ contract });

  const handleClaimNft = async () => {
    await nftDropClaim.mutateAsync({ quantity });
  };

  const isMobile = useIsMobile();

  const renderContent = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">
            <FormattedMessage id="my.nfts" defaultMessage="My NFTs" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {nfts.data && (
            <NFTGrid nfts={nfts.data} network={network} address={address} />
          )}
        </Grid>
      </Grid>
    );
  };

  const renderClaim = () => {
    return (
      <Box>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: { sm: 'flex-start', xs: 'center' } }}
        >
          <Grid item xs={12}>
            <Stack
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
              alignItems="center"
              direction="row"
            >
              {contractMetadataQuery.data?.image && (
                <Avatar
                  src={contractMetadataQuery.data?.image}
                  alt={contractMetadataQuery.data?.name!}
                  sx={{
                    height: '6rem',
                    width: '6rem',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                />
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="h5"
              >
                <FormattedMessage id="claim.nfts" defaultMessage="Claim NFTs" />
              </Typography>
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="body1"
              >
                <FormattedMessage
                  id="claim.erc721.tokens.from.contractName"
                  defaultMessage="Claim ERC721 Tokens from {contractName}"
                  values={{
                    contractName: (
                      <strong>{contractMetadataQuery.data?.name}</strong>
                    ),
                  }}
                />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
          {section.settings.variant === 'detailed' && (
            <Grid item xs={12}>
              <NFTDropSummary contract={contract} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              onClick={handleClaimNft}
              startIcon={
                nftDropClaim.isLoading ? (
                  <CircularProgress size="1rem" color="inherit" />
                ) : undefined
              }
              sx={{ width: { sm: 'auto', xs: '100%' } }}
              disabled={!canClaim || nftDropClaim.isLoading}
              variant="contained"
            >
              {buttonMessage}
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderClaim()}
        </Grid>
        {section.settings.variant === 'detailed' ? (
          <Grid item xs={12}>
            <Box>{renderContent()}</Box>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
}
