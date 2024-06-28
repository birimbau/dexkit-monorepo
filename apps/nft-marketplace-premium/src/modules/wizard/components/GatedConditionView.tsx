import { getNetworkSlugFromChainId } from '@dexkit/core/utils/blockchain';
import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import Check from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import ShieldIcon from '@mui/icons-material/Shield';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/legacy/image';
import { FormattedMessage } from 'react-intl';
import { LoginAppButton } from 'src/components/LoginAppButton';

export function GatedConditionView({
  conditions,
  partialResults,
  balances,
  account,
  isLoggedIn,
  layout,
}: {
  layout?: GatedPageLayout;
  conditions?: GatedCondition[];
  account?: string;
  result?: boolean;
  isLoggedIn?: boolean;
  partialResults?: { [key: number]: boolean };
  balances?: { [key: number]: string };
}) {
  const renderStatus = (index: number) => {
    return partialResults &&
      partialResults[index] &&
      partialResults[index] === true ? (
      <Paper
        sx={{
          px: 0.5,
          py: 0.25,
          border: (theme) => `2px solid ${theme.palette.success.main}`,
        }}
        variant="outlined"
      >
        <Typography variant="body2" color="success.dark">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Check fontSize="inherit" color="success" />{' '}
            <Box
              component="span"
              sx={{ color: (theme) => theme.palette.error.dark }}
            >
              <FormattedMessage id="pending" defaultMessage="Pending" />
            </Box>
          </Stack>
        </Typography>
      </Paper>
    ) : (
      <Paper
        sx={{
          px: 0.5,
          py: 0.25,
          border: (theme) => `2px solid ${theme.palette.error.main}`,
        }}
        variant="outlined"
      >
        <Typography variant="body2" color="error.main">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <InfoIcon fontSize="inherit" color="error" />{' '}
            <Box
              component="span"
              sx={{ color: (theme) => theme.palette.error.dark }}
            >
              <FormattedMessage id="pending" defaultMessage="Pending" />
            </Box>
          </Stack>
        </Typography>
      </Paper>
    );
  };

  const renderCondition = (condition: GatedCondition, index: number) => {
    if (condition.type === 'collection') {
      return (
        <Stack spacing={1}>
          <Typography fontWeight="bold" variant="body2">
            <FormattedMessage
              id="collection.collection"
              defaultMessage="Collection: {collection}"
              values={{
                collection: (
                  <Typography
                    fontWeight="400"
                    variant="inherit"
                    component="span"
                  >
                    {getNetworkSlugFromChainId(
                      condition.chainId,
                    )?.toUpperCase()}{' '}
                    - {condition.symbol}
                  </Typography>
                ),
              }}
            />
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">
              <b>
                <FormattedMessage
                  id="must.have.amount"
                  defaultMessage="Must Have: {amount}"
                  values={{
                    amount: (
                      <Typography
                        variant="inherit"
                        fontWeight="400"
                        component="span"
                      >
                        {condition.amount}
                      </Typography>
                    ),
                  }}
                />
              </b>
            </Typography>
            <Divider orientation="vertical" sx={{ height: '1rem' }} />
            {balances && balances[index] && (
              <Typography fontWeight="bold" variant="body2">
                <FormattedMessage
                  id="your.balance.amount"
                  defaultMessage="Your Balance: {amount}"
                  values={{
                    amount: (
                      <Typography
                        variant="inherit"
                        fontWeight="400"
                        component="span"
                      >
                        {balances[index]}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            )}

            {renderStatus(index)}
          </Stack>
        </Stack>
      );
    }

    if (condition.type === 'coin') {
      return (
        <Stack spacing={1}>
          <Typography variant="body2" fontWeight="bold">
            <FormattedMessage
              id="coin.coin"
              defaultMessage="Coin: {coin}"
              values={{
                coin: (
                  <Typography
                    fontWeight="400"
                    variant="inherit"
                    component="span"
                  >
                    {condition.name}
                  </Typography>
                ),
              }}
            />
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" fontWeight="bold">
              <FormattedMessage
                id="must.have.amount"
                defaultMessage="Must Have: {amount}"
                values={{
                  amount: (
                    <Typography
                      fontWeight="400"
                      variant="inherit"
                      component="span"
                    >
                      {condition.amount} {condition.symbol}
                    </Typography>
                  ),
                }}
              />
            </Typography>

            <Divider orientation="vertical" sx={{ height: '1rem' }} />
            {balances && balances[index] && (
              <Typography variant="body2" fontWeight="bold">
                <FormattedMessage
                  id="your.balance.amount"
                  defaultMessage="Your balance: {amount}"
                  values={{
                    amount: (
                      <Typography
                        fontWeight="400"
                        variant="inherit"
                        component="span"
                      >
                        {balances[index]}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            )}

            {renderStatus(index)}
          </Stack>
        </Stack>
      );
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box>
          <Stack
            justifyContent={'center'}
            alignContent={'center'}
            alignItems={'center'}
          >
            {layout?.frontImage ? (
              <Image
                src={layout?.frontImage}
                alt={'gated page front image'}
                height={
                  layout?.frontImageHeight
                    ? Number(layout?.frontImageHeight)
                    : 20 * 8
                }
                width={
                  layout?.frontImageWidth
                    ? Number(layout?.frontImageWidth)
                    : 20 * 8
                }
              />
            ) : (
              <ShieldIcon sx={{ fontSize: 80 }} />
            )}
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="warning">
          <AlertTitle>
            <FormattedMessage
              id="access.requirements"
              defaultMessage="Access Requirements"
            />
          </AlertTitle>
          {layout?.accessRequirementsMessage ? (
            layout?.accessRequirementsMessage
          ) : (
            <FormattedMessage
              id="access.requirements.description.gated.view.conditions"
              defaultMessage="To access this private page, please ensure that you meet all the conditions below, as defined by the page owner:"
            />
          )}
        </Alert>
      </Grid>
      <Grid item xs={12}>
        {account && isLoggedIn ? (
          <Grid container spacing={2}>
            {(conditions || []).map((condition, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="body1" fontWeight="bold">
                        <FormattedMessage
                          id="condition.index"
                          defaultMessage="Condition {index}"
                          values={{ index: index + 1 }}
                        />
                      </Typography>
                      {renderCondition(condition, index)}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack justifyContent={'center'} alignItems={'center'}>
            <Box sx={{ maxWidth: '500px' }}>
              <LoginAppButton />
            </Box>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
