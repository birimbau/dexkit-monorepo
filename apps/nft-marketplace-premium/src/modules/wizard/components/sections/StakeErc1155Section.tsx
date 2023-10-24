import { formatBigNumber } from '@dexkit/core/utils';
import Token from '@mui/icons-material/Token';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  useContract,
  useContractRead,
  useContractWrite,
  useTokenBalance,
} from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { SyntheticEvent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { StakeErc155PageSection } from '../../types/section';
import SelectNFTEditionClaimDialog from '../dialogs/SelectNFTEditionClaimDialog';
import SelectNFTEditionDialog from '../dialogs/SelectNFTEditionDialog';

export interface StakeErc1155SectionProps {
  section: StakeErc155PageSection;
}

export default function StakeErc1155Section({
  section,
}: StakeErc1155SectionProps) {
  const { address, network } = section.settings;

  const [tab, setTab] = useState<'stake' | 'unstake'>('stake');

  const [amount, setAmount] = useState<number>();

  const { data: contract } = useContract(address, 'custom');

  const { mutateAsync: withdraw, isLoading: isClaiming } = useContractWrite(
    contract,
    'withdraw',
  );

  const { mutateAsync: claimRewards } = useContractWrite(
    contract,
    'claimRewards',
  );

  const [selectedTokenId, setSelectedTokenId] = useState<string>();

  const { account } = useWeb3React();

  const { data: rewardTokenAddress } = useContractRead(contract, 'rewardToken');

  const { data: stakeInfo } = useContractRead(contract, 'getStakeInfo', [
    account,
  ]);

  const { data: rewardToken } = useContract(rewardTokenAddress || '', 'token');

  const { data: rewardTokenBalance } = useTokenBalance(rewardToken, account);

  const [stakedTokenIds, rewards] = useMemo(() => {
    if (stakeInfo) {
      const [n, d, r] = stakeInfo;

      return [
        Array.isArray(n) ? (n as BigNumber[])?.map((v) => v.toNumber()) : [],
        r,
      ];
    }

    return [[] as number[], BigNumber.from(0)];
  }, [stakeInfo, rewardTokenBalance]);

  const { data: rewardRatio } = useContractRead(
    contract,
    'getDefaultRewardsPerUnitTime',
  );
  const { data: rewardTimeUnit } = useContractRead(
    contract,
    'getDefaultTimeUnit',
  );

  const rewardPerUnitTime = useMemo(() => {
    if (rewardRatio) {
      return rewardRatio.toNumber();
    }

    return 0;
  }, [rewardRatio]);

  const { data: rewardsBalance } = useContractRead(
    contract,
    'getRewardTokenBalance',
  );

  const handleClaim = async (tokenId: string) => {
    await claimRewards({ args: [tokenId] });
  };

  const handleChangeTab = (e: SyntheticEvent, value: 'stake' | 'unstake') => {
    setTab(value);
    setAmount(undefined);
    setSelectedTokenId(undefined);
  };

  const { data: stakingAddress } = useContractRead(contract, 'stakingToken');

  const [open, setOpen] = useState(false);

  const handleOpenSelectNFT = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectNFT = (tokenId: string, amount: number) => {
    setSelectedTokenId(tokenId);
    setAmount(amount);
    handleClose();
  };

  const { mutateAsync: stake, isLoading: isStaking } = useContractWrite(
    contract,
    'stake',
  );

  const { mutateAsync: unstake, isLoading: isUnstaking } = useContractWrite(
    contract,
    'withdraw',
  );

  const { data: stakingTokenContract } = useContract(stakingAddress, 'custom');

  const { mutateAsync: setApproveForAll } = useContractWrite(
    stakingTokenContract,
    'setApprovalForAll',
  );
  const { data: isApprovedForAll } = useContractRead(
    stakingTokenContract,
    'isApprovedForAll',
    [account, address],
  );

  const handleStake = async () => {
    if (!isApprovedForAll) {
      await setApproveForAll({ args: [address, true] });
    }

    if (amount && selectedTokenId) {
      await stake({ args: [selectedTokenId, amount] });
    }

    setSelectedTokenId(undefined);
    setAmount(undefined);
  };

  const handleUnstake = async () => {
    await unstake({ args: [selectedTokenId, amount] });

    setSelectedTokenId(undefined);
    setAmount(undefined);
  };

  const [showClaim, setShowClaim] = useState(false);

  const handleCloseClaim = () => {
    setShowClaim(false);
  };

  const handleOpenClaim = () => {
    setShowClaim(true);
  };

  return (
    <>
      <SelectNFTEditionDialog
        DialogProps={{
          open,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: 'lg',
        }}
        stakingContractAddress={address}
        address={stakingAddress}
        network={network}
        onSelect={handleSelectNFT}
        isUnstake={tab === 'unstake'}
      />
      <SelectNFTEditionClaimDialog
        DialogProps={{
          open: showClaim,
          onClose: handleCloseClaim,
          fullWidth: true,
          maxWidth: 'lg',
        }}
        stakingContractAddress={address}
        address={stakingAddress}
        onClaim={handleClaim}
      />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Tabs
                    onChange={handleChangeTab}
                    variant="fullWidth"
                    value={tab}
                  >
                    <Tab
                      value="stake"
                      label={
                        <FormattedMessage id="stake" defaultMessage="Stake" />
                      }
                    />
                    <Tab
                      value="unstake"
                      label={
                        <FormattedMessage
                          id="unstake"
                          defaultMessage="Unstake"
                        />
                      }
                    />
                  </Tabs>
                  {tab === 'stake' && (
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Paper variant="outlined">
                            {stakedTokenIds && stakedTokenIds?.length > 0 ? (
                              <CardActionArea
                                sx={{ py: 2 }}
                                onClick={handleOpenSelectNFT}
                              >
                                <Typography align="center" variant="h5">
                                  {stakedTokenIds?.length}
                                </Typography>
                                <Typography
                                  align="center"
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="nfts.staked"
                                    defaultMessage="NFTs staked"
                                  />
                                </Typography>
                              </CardActionArea>
                            ) : (
                              <CardActionArea
                                onClick={handleOpenSelectNFT}
                                sx={{ p: 2 }}
                              >
                                <Stack spacing={1} alignItems="center">
                                  <Token />
                                  <Typography color="text.secondary">
                                    <FormattedMessage
                                      id="select.an.nft"
                                      defaultMessage="Select an NFT"
                                    />
                                  </Typography>
                                </Stack>
                              </CardActionArea>
                            )}
                          </Paper>
                        </Grid>
                        {selectedTokenId && (
                          <Grid item xs={12}>
                            <Typography color="text.secondary" variant="body1">
                              <FormattedMessage
                                id="nft.tokenId.is.selected.to.stake"
                                defaultMessage='NFT "{tokenId}" is selected to stake'
                                values={{ tokenId: selectedTokenId }}
                              />
                            </Typography>
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Box>
                            <Stack>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="total.rewards"
                                    defaultMessage="Total Rewards"
                                  />
                                </Typography>
                                <Typography color="text.secondary">
                                  {rewardsBalance && rewardTokenBalance ? (
                                    `${formatBigNumber(
                                      rewardsBalance,
                                      rewardTokenBalance?.decimals || 18,
                                    )} ${rewardTokenBalance?.symbol}`
                                  ) : (
                                    <Skeleton />
                                  )}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="rewards.second"
                                    defaultMessage="Rewards/second"
                                  />
                                </Typography>
                                <Typography color="text.secondary">
                                  {rewardTimeUnit ? (
                                    <>
                                      {rewardPerUnitTime}{' '}
                                      {rewardTokenBalance?.symbol}/
                                      {rewardTimeUnit?.toNumber()}
                                    </>
                                  ) : (
                                    <Skeleton />
                                  )}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="available.rewards"
                                    defaultMessage="Available rewards"
                                  />
                                </Typography>
                                <Typography color="text.secondary">
                                  {rewardTokenBalance ? (
                                    `${rewards} ${rewardTokenBalance?.symbol}`
                                  ) : (
                                    <Skeleton />
                                  )}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            disabled={isStaking || !selectedTokenId}
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            startIcon={
                              isStaking ? (
                                <CircularProgress size="1rem" color="inherit" />
                              ) : undefined
                            }
                            onClick={handleStake}
                          >
                            <FormattedMessage
                              id="stake"
                              defaultMessage="Stake"
                            />
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            onClick={handleOpenClaim}
                            variant="outlined"
                            color="primary"
                            fullWidth
                            size="large"
                          >
                            <FormattedMessage
                              id="claim.rewards"
                              defaultMessage="Claim rewards"
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  {tab === 'unstake' && (
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Paper variant="outlined">
                            {stakedTokenIds && stakedTokenIds?.length > 0 ? (
                              <CardActionArea
                                sx={{ py: 2 }}
                                onClick={handleOpenSelectNFT}
                              >
                                <Typography align="center" variant="h5">
                                  {stakedTokenIds?.length}
                                </Typography>
                                <Typography
                                  align="center"
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="nfts.staked"
                                    defaultMessage="NFTs staked"
                                  />
                                </Typography>
                              </CardActionArea>
                            ) : (
                              <CardActionArea
                                onClick={handleOpenSelectNFT}
                                sx={{ p: 2 }}
                              >
                                <Stack spacing={1} alignItems="center">
                                  <Token />
                                  <Typography color="text.secondary">
                                    <FormattedMessage
                                      id="select.nfts"
                                      defaultMessage="Select NFTs"
                                    />
                                  </Typography>
                                </Stack>
                              </CardActionArea>
                            )}
                          </Paper>
                        </Grid>
                        {selectedTokenId && (
                          <Grid item xs={12}>
                            <Typography color="text.secondary" variant="body1">
                              <FormattedMessage
                                id="nft.tokenId.is.selected.to.unstake"
                                defaultMessage='NFT "{tokenId}" is selected to unstake'
                                values={{ tokenId: selectedTokenId }}
                              />
                            </Typography>
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Box>
                            <Stack>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="total.rewards"
                                    defaultMessage="Total Rewards"
                                  />
                                </Typography>
                                <Typography color="text.secondary">
                                  {rewardsBalance && rewardTokenBalance ? (
                                    `${formatBigNumber(
                                      rewardsBalance,
                                      rewardTokenBalance?.decimals || 18,
                                    )} ${rewardTokenBalance?.symbol}`
                                  ) : (
                                    <Skeleton />
                                  )}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="rewards.second"
                                    defaultMessage="Rewards/second"
                                  />
                                </Typography>
                                <Typography color="text.secondary">
                                  {rewardTimeUnit ? (
                                    <>
                                      {rewardPerUnitTime}{' '}
                                      {rewardTokenBalance?.symbol}/
                                      {rewardTimeUnit?.toNumber()}
                                    </>
                                  ) : (
                                    <Skeleton />
                                  )}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="available.rewards"
                                    defaultMessage="Available rewards"
                                  />
                                </Typography>
                                <Typography color="text.secondary">
                                  {rewardTokenBalance ? (
                                    `${rewards} ${rewardTokenBalance?.symbol}`
                                  ) : (
                                    <Skeleton />
                                  )}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            disabled={isUnstaking || !selectedTokenId}
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            startIcon={
                              isUnstaking ? (
                                <CircularProgress size="1rem" color="inherit" />
                              ) : undefined
                            }
                            onClick={handleUnstake}
                          >
                            <FormattedMessage
                              id="unstake"
                              defaultMessage="Unstake"
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
