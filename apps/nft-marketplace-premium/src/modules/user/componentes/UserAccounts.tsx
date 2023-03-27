import { CircularProgress, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useWeb3React } from '@web3-react/core';
import { FormattedMessage } from 'react-intl';
import { useAddAccounttUserMutation } from '../hooks';

interface Props {
  accounts: { address: string }[];
}

export function UserAccounts(props: Props) {
  const { account } = useWeb3React();
  const userAddAcountMutation = useAddAccounttUserMutation();

  const { accounts } = props;

  return (
    <>
      <Typography variant="h5">
        <FormattedMessage id={'accounts'} defaultMessage={'Accounts'} />
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <FormattedMessage
              id={'user.accounts'}
              defaultMessage={'User accounts:'}
            />
          </Typography>
        </Grid>
        {accounts.map((v, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="body1">{v.address}</Typography>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            <Typography variant="body2">
              <FormattedMessage
                id="switch.your.wallet.to.another.account.and.click.connect.account"
                defaultMessage={
                  'Switch your wallet to another account and click connect account'
                }
              />
            </Typography>
            <Box>
              <Button
                variant={'contained'}
                disabled={accounts
                  ?.map((a) => a.address.toLowerCase())
                  .includes(account?.toLowerCase() || '')}
                onClick={() => userAddAcountMutation.mutate()}
                startIcon={
                  userAddAcountMutation.isLoading && <CircularProgress />
                }
              >
                {userAddAcountMutation.isLoading ? (
                  <FormattedMessage
                    id={'sign.message'}
                    defaultMessage={'sign.message'}
                  />
                ) : (
                  <FormattedMessage
                    id="connect.account"
                    defaultMessage={'Connect account'}
                  />
                )}
              </Button>
            </Box>

            <Typography variant="body1">
              <FormattedMessage
                id="connected.account"
                defaultMessage={'Connected account'}
              />
              :{account}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
