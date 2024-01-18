import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShieldIcon from '@mui/icons-material/Shield';
import {
  Alert,
  AlertTitle,
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { FormattedMessage } from 'react-intl';
import { LoginAppButton } from 'src/components/LoginAppButton';
import { GatedCondition, GatedPageLayout } from '../types';
function ShowBalance({ balance }: { balance: string }) {
  return (
    <Typography>
      <b>
        {' '}
        <FormattedMessage id={'your.balance'} defaultMessage={'Your Balance'} />
        : {balance}
      </b>
    </Typography>
  );
}

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
  const theme = useTheme();

  const { getNetworkSlugFromChainId } = useNetworkMetadata();

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
                    ? `${layout?.frontImageHeight}px`
                    : theme.spacing(20)
                }
                width={
                  layout?.frontImageWidth
                    ? `${layout?.frontImageWidth}px`
                    : theme.spacing(20)
                }
              />
            ) : (
              <ShieldIcon sx={{ fontSize: 80 }} />
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="warning">
            <AlertTitle>
              <FormattedMessage
                id={'access.requirements'}
                defaultMessage={'Access Requirements'}
              />
            </AlertTitle>
            {layout?.accessRequirementsMessage ? (
              layout?.accessRequirementsMessage
            ) : (
              <FormattedMessage
                id={'access.requirements.description.gated.view.conditions'}
                defaultMessage={
                  'To access this private page, please ensure that you meet all the conditions below, as defined by the page owner:'
                }
              />
            )}
          </Alert>
        </Grid>
        <Grid item xs={12}>
          {account && isLoggedIn ? (
            (conditions || []).map((condition, index) => (
              <>
                {condition.condition && (
                  <Stack
                    key={index}
                    spacing={2}
                    direction={'row'}
                    justifyContent={'center'}
                  >
                    <Typography variant="h6"> {condition.condition}</Typography>
                  </Stack>
                )}
                <Box py={1}>
                  <Stack key={index} spacing={2} direction={'row'}>
                    {partialResults &&
                    partialResults[index] &&
                    partialResults[index] === true ? (
                      <CheckCircleOutlineIcon color={'success'} />
                    ) : (
                      <CheckCircleOutlineIcon color={'error'} />
                    )}
                    {condition.type === 'collection' && (
                      <>
                        <b>
                          <FormattedMessage
                            id={'collection'}
                            defaultMessage={'Collection'}
                          />
                        </b>
                        :
                        <Typography>
                          {getNetworkSlugFromChainId(
                            condition.chainId
                          )?.toUpperCase()}
                        </Typography>{' '}
                        - {condition.symbol}
                        <Typography>
                          <b>
                            <FormattedMessage
                              id={'must.have'}
                              defaultMessage={'Must Have'}
                            />
                            : {condition.amount}{' '}
                          </b>
                        </Typography>
                        <Typography>|</Typography>
                        {balances && balances[index] && (
                          <ShowBalance balance={balances[index]} />
                        )}
                      </>
                    )}
                    {condition.type === 'coin' && (
                      <>
                        <Typography>
                          <b>
                            <FormattedMessage
                              id={'coin'}
                              defaultMessage={'Coin'}
                            />{' '}
                          </b>
                          :
                        </Typography>
                        <Typography>
                          {getNetworkSlugFromChainId(
                            condition.chainId
                          )?.toUpperCase()}{' '}
                          - {condition.symbol}
                        </Typography>
                        <Typography>
                          <b>
                            <FormattedMessage
                              id={'must.have'}
                              defaultMessage={'Must Have'}
                            />
                            : {condition.amount}
                          </b>
                        </Typography>
                        <Typography>|</Typography>
                        {balances && balances[index] && (
                          <ShowBalance balance={balances[index]} />
                        )}
                      </>
                    )}
                  </Stack>
                </Box>
              </>
            ))
          ) : (
            <Stack justifyContent={'center'} alignItems={'center'}>
              <Box sx={{ maxWidth: '500px' }}>
                <LoginAppButton />
              </Box>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
