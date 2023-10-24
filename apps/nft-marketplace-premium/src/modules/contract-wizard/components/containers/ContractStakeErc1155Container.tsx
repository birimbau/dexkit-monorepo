import { formatBigNumber } from '@dexkit/core/utils';
import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useContract,
  useContractRead,
  useContractWrite,
  useTokenBalance,
} from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { Field, Formik } from 'formik';
import { Switch, TextField } from 'formik-mui';
import moment from 'moment';
import { SyntheticEvent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';

export interface ContractStakeErc1155ContainerProps {
  address: string;
  network: string;
}

export default function ContractStakeErc1155Container({
  address,
  network,
}: ContractStakeErc1155ContainerProps) {
  const [tab, setTab] = useState<string>('deposit');

  const handleChangeTab = (e: SyntheticEvent, value: string) => {
    setTab(value);
  };

  const { data: contract } = useContract(address, 'custom');

  const { mutateAsync: depositRewardTokens } = useContractWrite(
    contract,
    'depositRewardTokens',
  );

  const { account } = useWeb3React();

  const { data: rewardTokenAddress } = useContractRead(contract, 'rewardToken');

  const { data: rewardsBalance } = useContractRead(
    contract,
    'getRewardTokenBalance',
  );

  const { data: totalStakedBalance } = useContractRead(
    contract,
    'stakingTokenBalance',
  );

  const { data: stakingTokenAddress } = useContractRead(
    contract,
    'stakingToken',
  );
  const { data: rewardToken } = useContract(rewardTokenAddress || '', 'token');

  const { data: stakingToken } = useContract(
    stakingTokenAddress || '',
    'token',
  );

  const { data: rewardTokenBalance } = useTokenBalance(rewardToken, account);

  const { data: rewardsPerUnitTime } = useContractRead(
    contract,
    'getDefaultRewardsPerUnitTime',
  );
  const { data: rewardTimeUnit } = useContractRead(
    contract,
    'getDefaultTimeUnit',
  );

  const rewardsPerUnitTimeValue = useMemo(() => {
    return rewardsPerUnitTime?.toNumber();
  }, [rewardsPerUnitTime]);

  const { data: allowance } = useQuery(
    ['REWARD_TOKEN_ALLOWANCE', rewardTokenAddress],
    async () => {
      return await rewardToken?.erc20.allowance(address);
    },
  );

  const { mutateAsync: approve } = useMutation(
    async ({ amount }: { amount: string }) => {
      let call = await rewardToken?.erc20.setAllowance.prepare(address, amount);
      let tx = await call?.send();

      return (await tx)?.wait();
    },
  );

  const { mutateAsync: withdrawRewards } = useContractWrite(
    contract,
    'withdrawRewardTokens',
  );

  const handleSubmitRewards = async ({
    amount,
    withdraw,
  }: {
    amount: string;
    withdraw: boolean;
  }) => {
    const amountParsed = ethers.utils.parseUnits(
      amount,
      rewardTokenBalance?.decimals,
    );

    if (withdraw) {
      return await withdrawRewards({ args: [amountParsed] });
    }

    if (!allowance?.value.gte(amountParsed)) {
      await approve({ amount });
    }

    await depositRewardTokens({
      args: [ethers.utils.parseUnits(amount, rewardTokenBalance?.decimals)],
    });
  };

  const { mutateAsync: setTimeUnit } = useContractWrite(
    contract,
    'setDefaultTimeUnit',
  );

  const { mutateAsync: setRewardsPerUnitTime } = useContractWrite(
    contract,
    'setDefaultRewardsPerUnitTime',
  );

  const handleSubmitTimeUnit = async ({ timeUnit }: { timeUnit: string }) => {
    await setTimeUnit({ args: [timeUnit] });
  };

  const handleSubmitRewardRatio = async ({
    rewardsPerUnitTime,
  }: {
    rewardsPerUnitTime: string;
  }) => {
    await setRewardsPerUnitTime({ args: [rewardsPerUnitTime] });
  };

  // TODO: add info of reward ratio as a tooltip.

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="your.balance"
                defaultMessage="Your balance"
              />
            </Typography>
            <Typography variant="h5">
              {formatBigNumber(
                rewardTokenBalance?.value || BigNumber.from('0'),
                rewardTokenBalance?.decimals || 18,
              )}{' '}
              {rewardTokenBalance?.symbol}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="reward.per.time.unit"
                defaultMessage="Reward per time Unit"
              />
            </Typography>
            <Typography variant="h5">{rewardsPerUnitTimeValue}</Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="rewards" defaultMessage="Rewards" />
            </Typography>
            <Typography variant="h5">
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
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="reward.time" defaultMessage="Reward Time" />
            </Typography>
            <Typography variant="h5">
              {moment
                .duration(rewardTimeUnit?.toNumber(), 'seconds')
                .humanize()}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab
            label={<FormattedMessage id="deposit" defaultMessage="Deposit" />}
            value="deposit"
          />
          <Tab
            label={<FormattedMessage id="settings" defaultMessage="Settings" />}
            value="settings"
          />
          <Tab
            label={<FormattedMessage id="admin" defaultMessage="Admin" />}
            value="admin"
          />
          <Tab
            label={<FormattedMessage id="metadata" defaultMessage="Metadata" />}
            value="metadata"
          />
        </Tabs>
      </Grid>

      <Grid item xs={12}>
        {tab === 'deposit' && (
          <Formik
            initialValues={{ amount: '', withdraw: false }}
            onSubmit={handleSubmitRewards}
          >
            {({ submitForm, isSubmitting, isValid, values, setFieldValue }) => (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Field component={Switch} name="withdraw" />}
                    label={
                      <FormattedMessage
                        id="withdraw.rewards"
                        defaultMessage="Withdraw rewards"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikDecimalInput
                    name="amount"
                    decimals={rewardTokenBalance?.decimals}
                    TextFieldProps={{
                      fullWidth: true,
                      disabled: isSubmitting,
                      label: (
                        <FormattedMessage id="amount" defaultMessage="Amount" />
                      ),
                      InputProps: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              onClick={() => {
                                if (values.withdraw) {
                                  return setFieldValue(
                                    'amount',
                                    ethers.utils.formatUnits(
                                      rewardsBalance,
                                      rewardTokenBalance?.decimals,
                                    ),
                                  );
                                }

                                setFieldValue(
                                  'amount',
                                  rewardTokenBalance?.displayValue,
                                );
                              }}
                              size="small"
                            >
                              <FormattedMessage id="max" defaultMessage="Max" />
                            </Button>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Stack direction="row" spacing={2}>
                      <Button
                        disabled={isSubmitting || !isValid}
                        startIcon={
                          isSubmitting ? (
                            <CircularProgress color="inherit" size="1rem" />
                          ) : undefined
                        }
                        onClick={submitForm}
                        variant="contained"
                        color="primary"
                      >
                        {!values.withdraw ? (
                          <FormattedMessage
                            id="deposit.reward"
                            defaultMessage="Deposit Reward"
                          />
                        ) : (
                          <FormattedMessage
                            id="withdraw.rewards"
                            defaultMessage="Withdraw Reward"
                          />
                        )}
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Formik>
        )}
        {tab === 'settings' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="reward.per.unit.time"
                          defaultMessage="Reward per Unit Time"
                        />
                      </strong>
                    </Typography>
                    <Box>
                      <Formik
                        initialValues={{
                          rewardsPerUnitTime: rewardsPerUnitTimeValue,
                        }}
                        onSubmit={handleSubmitRewardRatio}
                      >
                        {({ submitForm, isSubmitting, isValid }) => (
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Field
                                fullWidth
                                component={TextField}
                                name="rewardsPerUnitTime"
                                type="number"
                                label={
                                  <FormattedMessage
                                    id="numerator"
                                    defaultMessage="Rewards per Unit Time"
                                  />
                                }
                                inputProps={{ type: 'number' }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                disabled={isSubmitting || !isValid}
                                startIcon={
                                  isSubmitting ? (
                                    <CircularProgress
                                      color="inherit"
                                      size="1rem"
                                    />
                                  ) : undefined
                                }
                                onClick={submitForm}
                                variant="contained"
                                color="primary"
                              >
                                <FormattedMessage
                                  id="deposit"
                                  defaultMessage="Update"
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                      </Formik>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="reward.time"
                          defaultMessage="Reward time"
                        />
                      </strong>
                    </Typography>
                    <Box>
                      <Formik
                        initialValues={{
                          timeUnit: rewardTimeUnit?.toNumber().toString(),
                        }}
                        onSubmit={handleSubmitTimeUnit}
                      >
                        {({ submitForm, isSubmitting, isValid }) => (
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <Field
                                  fullWidth
                                  component={TextField}
                                  name="timeUnit"
                                  type="number"
                                  label={
                                    <FormattedMessage
                                      id="time.unit"
                                      defaultMessage="Time unit"
                                    />
                                  }
                                  inputProps={{ type: 'number' }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                disabled={isSubmitting || !isValid}
                                startIcon={
                                  isSubmitting ? (
                                    <CircularProgress
                                      color="inherit"
                                      size="1rem"
                                    />
                                  ) : undefined
                                }
                                onClick={submitForm}
                                variant="contained"
                                color="primary"
                              >
                                <FormattedMessage
                                  id="deposit"
                                  defaultMessage="Update"
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                      </Formik>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {tab === 'admin' && <ContractAdminTab address={address} />}
        {tab === 'metadata' && <ContractMetadataTab address={address} />}
      </Grid>
    </Grid>
  );
}
