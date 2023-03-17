import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useWeb3React } from '@web3-react/core';
import { FormattedMessage } from 'react-intl';

interface Props {
  accounts: { address: string }[];
}

export function UserAccounts(props: Props) {
  const { account } = useWeb3React();

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
              id={'connected.accounts'}
              defaultMessage={'Connected accounts:'}
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
            <Box>
              <Button variant={'contained'}>
                <FormattedMessage
                  id="connect.account"
                  defaultMessage={'Connect account'}
                />
              </Button>
            </Box>
            <Typography variant="body1"> {account}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
