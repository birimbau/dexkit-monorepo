import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { signIn } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';
import {
  useUserConnectDiscordMutation,
  useUserConnectTwitterMutation,
} from '../hooks';

interface Props {}

export function UserSocials(props: Props) {
  const connectTwitterMutation = useUserConnectTwitterMutation();
  const connectDiscordMutation = useUserConnectDiscordMutation();
  return (
    <>
      <Typography variant="h5">
        <FormattedMessage id={'socials'} defaultMessage={'Socials'} />
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant={'contained'}
            onClick={
              async () => {
                signIn('twitter');
                /*const csrfTokenResponse = await axios.get('/api/auth/csrf');
                const data = csrfTokenResponse.data;
                
                const response = await axios.post(
                  '/api/auth/signin/twitter',
                  data
                );*/
                // console.log(response);
              }
              // window.open('http://localhost:3000/auth/twitter', '_blank')
            }
          >
            <FormattedMessage
              id="connect.twitter"
              defaultMessage={'Connect Twitter'}
            />
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={'contained'}
            onClick={async () => {
              signIn('discord');
              //window.open('http://localhost:3000/auth/discord', '_blank')
              // const csrfTokenResponse = await axios.get('/api/auth/csrf');
              // const data = csrfTokenResponse.data;
              // console.log(csrfToken);
              // const response = await axios.post(
              //  '/api/auth/signin/discord',
              //</Grid>  data
              //);
            }}
          >
            <FormattedMessage
              id="connect.discord"
              defaultMessage={'Connect Discord'}
            />
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
