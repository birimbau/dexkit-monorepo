import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
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
                const response = await axios.get(
                  'http://localhost:3000/auth/twitter/verify'
                );
                console.log(response);
              }
              // window.open('http://localhost:3000/auth/twitter', '_blank')
            }
          >
            Connect Twitter
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={'contained'}
            onClick={() =>
              window.open('http://localhost:3000/auth/discord', '_blank')
            }
          >
            Connect Discord
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
