import { EditionDropPageSection } from '@/modules/wizard/types/section';
import {
  useActiveClaimConditionForWallet,
  useClaimConditions,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
} from '@thirdweb-dev/react';

import { useDexKitContext } from '@dexkit/ui/hooks';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ClaimEligibility, NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';
import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useErc20AllowanceMutation,
  useErc20ApproveMutationV2,
} from 'src/hooks/balances';

interface Props {
  section: EditionDropPageSection;
}

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

export function EditionDropSection({ section }: Props) {
  const { tokenId, address } = section.config;
  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { account, chainId, provider } = useWeb3React();
  const [quantity, setQuantity] = useState(1);
  const { contract: editionDrop } = useContract(address);

  const allowanceMutation = useErc20AllowanceMutation(provider);

  const { data: contractMetadata } = useContractMetadata(editionDrop);

  const claimConditions = useClaimConditions(editionDrop, tokenId);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    editionDrop,
    account,
    tokenId,
  );

  const handleApproveAssetSuccess = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (swapAsset.type === 'ERC20') {
        createNotification({
          type: 'transaction',
          subtype: 'approve',
          values: {
            name: activeClaimCondition.data?.currencyMetadata.symbol || '',
            symbol: activeClaimCondition.data?.currencyMetadata.symbol || '',
          },
          metadata: {
            chainId,
            hash,
          },
        });

        watchTransactionDialog.watch(hash);
      }
    },
    [
      watchTransactionDialog,
      activeClaimCondition.data?.currencyMetadata.symbol,
      chainId,
    ],
  );

  const approveMutation = useErc20ApproveMutationV2(
    provider,
    handleApproveAssetSuccess,
  );

  const claimerProofs = useClaimerProofs(editionDrop, account || '', tokenId);
  const claimIneligibilityReasons = useClaimIneligibilityReasons(
    editionDrop,
    {
      quantity,
      walletAddress: account || '',
    },
    tokenId,
  );

  const claimedSupply = useTotalCirculatingSupply(editionDrop, tokenId);

  const totalAvailableSupply = useMemo(() => {
    try {
      return BigNumber.from(activeClaimCondition.data?.availableSupply || 0);
    } catch {
      return BigNumber.from(1_000_000);
    }
  }, [activeClaimCondition.data?.availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(BigNumber.from(claimedSupply.data || 0));
    if (n.gte(1_000_000)) {
      return '';
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const totalAmount = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0,
    );
    return bnPrice.mul(quantity);
  }, [quantity, activeClaimCondition.data?.currencyMetadata.value]);

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

    let max;
    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
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
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
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
    return (
      activeClaimCondition.isLoading || claimedSupply.isLoading || !editionDrop
    );
  }, [activeClaimCondition.isLoading, editionDrop, claimedSupply.isLoading]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading],
  );
  const priceText = useMemo(() => {
    const pricePerToken = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0,
    );
    if (pricePerToken.eq(0)) {
      return <FormattedMessage id={'Free'} defaultMessage={'Free'} />;
    }
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0,
    );
    return `${utils.formatUnits(
      bnPrice.toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18,
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,

    activeClaimCondition.data?.currencyMetadata.value,
  ]);

  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return 'Sold Out';
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0,
      );
      if (pricePerToken.eq(0)) {
        return (
          <FormattedMessage id={'mint.free'} defaultMessage={'Mint (free)'} />
        );
      }
      return (
        <FormattedMessage
          id={'mint.price.value'}
          defaultMessage={`Mint ({priceToMint})`}
          values={{ priceToMint: priceToMint }}
        />
      );
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
    }
    if (buttonLoading) {
      return (
        <>
          <FormattedMessage
            id={'checking.eligibility'}
            defaultMessage={`Checking eligibility`}
          />
          {'...'}
        </>
      );
    }

    return (
      <FormattedMessage
        id={'claiming.not.available'}
        defaultMessage={'Claiming not available'}
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

  const isLoadingConditions =
    activeClaimCondition.isLoading || claimConditions.isLoading;

  return (
    <Box py={4}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant={'h6'}>
            <FormattedMessage
              id={'drop.details'}
              defaultMessage={'Drop details'}
            />{' '}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} direction={'row'}>
            <Typography>
              <FormattedMessage
                id={'total.minted'}
                defaultMessage={'Total minted'}
              />{' '}
              :
            </Typography>
            <Typography>
              {' '}
              {claimedSupply ? (
                <>{numberClaimed}</>
              ) : (
                <>
                  <FormattedMessage id={'loading'} defaultMessage={'Loading'} />
                  {'...'}
                </>
              )}
            </Typography>
          </Stack>
          <Stack spacing={2} direction={'row'}>
            <Typography>
              <FormattedMessage
                id={'total.to.mint'}
                defaultMessage={'Total to mint'}
              />{' '}
              :
            </Typography>
            <Typography>
              {' '}
              {claimedSupply ? (
                <>{numberTotal || 'unlimited'}</>
              ) : (
                <>
                  <FormattedMessage id={'loading'} defaultMessage={'Loading'} />
                  {'...'}
                </>
              )}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {isLoadingConditions && !activeClaimCondition.data ? (
            <Card>
              <CardContent>
                <Skeleton width={'300px'}></Skeleton>
                <Skeleton width={'300px'}></Skeleton>
                <Skeleton width={'300px'}></Skeleton>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                {claimConditions.data?.length === 0 ||
                !claimConditions.data ||
                claimConditions.data?.every(
                  (cc) => cc.maxClaimableSupply === '0',
                ) ? (
                  <Alert severity="info">
                    <FormattedMessage
                      id={'drop.not.ready.to.mint.yet'}
                      defaultMessage={
                        'This drop is not ready to be minted yet. (No claim condition set)'
                      }
                    />
                  </Alert>
                ) : activeClaimCondition.data ? (
                  <Stack spacing={1}>
                    <Typography variant="h5">
                      {' '}
                      {activeClaimCondition.data?.metadata?.name || ''}
                    </Typography>

                    <Typography variant="body1">
                      <FormattedMessage
                        id={'price'}
                        defaultMessage={'Price'}
                      ></FormattedMessage>
                      : <b>{priceText}</b>
                    </Typography>
                    <Typography variant="body2">
                      {activeClaimCondition.data?.maxClaimablePerWallet.toString() ||
                        'unlimited'}{' '}
                      <FormattedMessage
                        id={'per.wallet'}
                        defaultMessage={'per wallet'}
                      />
                    </Typography>
                    <Stack direction={'row'} spacing={2}>
                      {/* <Button
                        size={'large'}
                        onClick={() => setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>*/}
                      <TextField
                        id="standard-basic"
                        type={'number'}
                        value={quantity}
                        onChange={(ev) =>
                          setQuantity(Number(ev.currentTarget.value))
                        }
                        label={
                          <FormattedMessage
                            id={'quantity'}
                            defaultMessage={'Quantity'}
                          />
                        }
                        disabled={quantity >= maxClaimable}
                        variant="standard"
                        inputProps={{
                          min: 1,
                          max: maxClaimable,
                        }}
                      />
                      {/*   <Typography variant="h4">{quantity}</Typography>*/}

                      {/* <Button
                        size={'large'}
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= maxClaimable}
                      >
                        +
                      </Button>*/}
                    </Stack>

                    {isSoldOut ? (
                      <Typography variant={'h2'}>
                        <FormattedMessage
                          id={'sold.out'}
                          defaultMessage={'Sold out'}
                        />
                      </Typography>
                    ) : (
                      <Button
                        disabled={!canClaim || buttonLoading}
                        sx={{ maxWidth: '300px' }}
                        variant="outlined"
                        onClick={async () => {
                          if (editionDrop) {
                            // it's an erc 20 we need to check allowance
                            if (
                              activeClaimCondition.data?.currencyAddress.toLowerCase() !==
                              NATIVE_TOKEN_ADDRESS
                            ) {
                              const allowance =
                                await allowanceMutation.mutateAsync({
                                  spender: address,
                                  account,
                                  tokenAddress:
                                    activeClaimCondition.data?.currencyAddress,
                                });
                              // we need to approve token
                              if (
                                allowance &&
                                (allowance as BigNumber).lt(totalAmount)
                              ) {
                                const values = {
                                  name: activeClaimCondition.data
                                    ?.currencyMetadata.symbol,
                                  symbol:
                                    activeClaimCondition.data?.currencyMetadata
                                      .symbol,
                                };

                                watchTransactionDialog.open('approve', values);
                                await approveMutation.mutateAsync({
                                  spender: address,
                                  amount: totalAmount,
                                  tokenAddress:
                                    activeClaimCondition.data?.currencyAddress,
                                });
                              }
                            }

                            const values = {
                              tokenId,
                              quantity: String(quantity),
                              name: String(contractMetadata?.name || ' '),
                            };

                            watchTransactionDialog.open(
                              'mintEditionDrop',
                              values,
                            );
                            const result = await editionDrop.erc1155.claim(
                              tokenId,
                              quantity,
                            );

                            createNotification({
                              type: 'transaction',
                              subtype: 'mintEditionDrop',
                              values,
                              metadata: {
                                chainId,
                                hash: result.receipt.transactionHash,
                              },
                            });

                            watchTransactionDialog.watch(
                              result.receipt.transactionHash,
                            );
                          }
                        }}
                      >
                        {buttonLoading ? (
                          <>
                            <FormattedMessage
                              id={'loading'}
                              defaultMessage={'Loading'}
                            />
                            {'...'}
                          </>
                        ) : (
                          buttonText
                        )}
                      </Button>
                    )}
                  </Stack>
                ) : (
                  <Alert severity="info">
                    <FormattedMessage
                      id={'drop.not.ready.to.mint.yet'}
                      defaultMessage={
                        'This drop is not ready to be minted yet.'
                      }
                    />
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditionDropSection;
