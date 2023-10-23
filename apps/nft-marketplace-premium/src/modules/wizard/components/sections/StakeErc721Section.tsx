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
import { StakeErc721PageSection } from '../../types/section';
import SelectNFTDialog from '../dialogs/SelectNFTDialog';

export interface StakeErc721SectionProps {
  section: StakeErc721PageSection;
}

export default function StakeErc721Section({
  section,
}: StakeErc721SectionProps) {
  const { address, network } = section.settings;

  const [tab, setTab] = useState<'stake' | 'unstake'>('stake');

  const { data: contract } = useContract(address, 'custom');

  const { mutateAsync: withdraw, isLoading: isClaiming } = useContractWrite(
    contract,
    'withdraw',
  );

  const { mutateAsync: claimRewards } = useContractWrite(
    contract,
    'claimRewards',
  );

  const { account } = useWeb3React();

  const { data: rewardTokenAddress } = useContractRead(contract, 'rewardToken');

  const { data: stakeInfo } = useContractRead(contract, 'getStakeInfo', [
    account,
  ]);

  const { data: rewardToken } = useContract(rewardTokenAddress || '', 'token');

  const { data: rewardTokenBalance } = useTokenBalance(rewardToken, account);

  const [stakedTokenIds, rewards] = useMemo(() => {
    if (stakeInfo) {
      const [n, d] = stakeInfo;

      return [
        Array.isArray(n) ? (n as BigNumber[])?.map((v) => v.toNumber()) : [],
        d,
      ];
    }

    return [[] as number[], BigNumber.from(0)];
  }, [stakeInfo, rewardTokenBalance]);

  const { data: rewardRatio } = useContractRead(
    contract,
    'getRewardsPerUnitTime',
  );
  const { data: rewardTimeUnit } = useContractRead(contract, 'getTimeUnit');

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

  const handleSubmit = async ({ amount }: { amount: string }) => {};

  const handleClaim = async () => {
    await claimRewards({});
  };

  const handleSubmitUnstake = async ({ amount }: { amount: string }) => {};

  const handleChangeTab = (e: SyntheticEvent, value: 'stake' | 'unstake') => {
    setTab(value);
  };

  const { data: stakingAddress } = useContractRead(contract, 'stakingToken');

  const [open, setOpen] = useState(false);

  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);

  const handleOpenSelectNFT = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectNFT = (tokenIds: string[]) => {
    setSelectedTokenIds(tokenIds);
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

    await stake({ args: [selectedTokenIds] });

    setSelectedTokenIds([]);
  };

  const handleUnstake = async () => {
    await unstake({ args: [selectedTokenIds] });

    setSelectedTokenIds([]);
  };

  return (
    <>
      <SelectNFTDialog
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
                                    id="tokens.staked"
                                    defaultMessage="Tokens staked"
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
                        {selectedTokenIds.length > 0 && (
                          <Grid item xs={12}>
                            <Typography color="text.secondary" variant="body1">
                              {selectedTokenIds.length > 1 ? (
                                <FormattedMessage
                                  id="amount.tokens.selected.to.stake"
                                  defaultMessage="Tokens {tokens} are selected to stake"
                                  values={{
                                    tokens: selectedTokenIds.join(','),
                                  }}
                                />
                              ) : (
                                <FormattedMessage
                                  id="amount.tokens.selected.to.stake"
                                  defaultMessage='Token "{tokens}" is selected to stake'
                                  values={{ tokens: selectedTokenIds[0] }}
                                />
                              )}
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
                            disabled={
                              isStaking || selectedTokenIds.length === 0
                            }
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
                            onClick={handleClaim}
                            startIcon={
                              isClaiming ? (
                                <CircularProgress color="inherit" size="1rem" />
                              ) : undefined
                            }
                            disabled={isClaiming}
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
                                    id="tokens.staked"
                                    defaultMessage="Tokens staked"
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
                        {selectedTokenIds.length > 0 && (
                          <Grid item xs={12}>
                            <Typography color="text.secondary" variant="body1">
                              {selectedTokenIds.length > 1 ? (
                                <FormattedMessage
                                  id="amount.tokens.selected.to.stake"
                                  defaultMessage="Tokens {tokens} are selected to unstake"
                                  values={{
                                    tokens: selectedTokenIds.join(','),
                                  }}
                                />
                              ) : (
                                <FormattedMessage
                                  id="amount.tokens.selected.to.stake"
                                  defaultMessage='Token "{tokens}" is selected to stake'
                                  values={{ tokens: selectedTokenIds[0] }}
                                />
                              )}
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
                            disabled={
                              isUnstaking || selectedTokenIds.length === 0
                            }
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
