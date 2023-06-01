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
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LoginAppButton } from 'src/components/LoginAppButton';
import { getNetworkSlugFromChainId } from 'src/utils/blockchain';
import { GatedCondition } from '../types';

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
}: {
  conditions?: GatedCondition[];
  account?: string;
  result: boolean;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
}) {
  console.log(conditions);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            justifyContent={'center'}
            alignContent={'center'}
            alignItems={'center'}
          >
            <ShieldIcon sx={{ fontSize: 80 }} />
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
            <FormattedMessage
              id={'access.requirements.description.gated.view.conditions'}
              defaultMessage={
                'To access this private page, please ensure that you meet all the conditions below, as defined by the page owner:'
              }
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          {account ? (
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
                    {partialResults[index] === true ? (
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
                        <ShowBalance balance={balances[index]} />
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
                        <ShowBalance balance={balances[index]} />
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
