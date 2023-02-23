import { Box, CardMedia, Paper, useTheme } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ipfsUriToUrl } from '../../../utils/ipfs';

interface Props {
  src: string;
}

export function AssetVideo({ src }: Props) {
  const theme = useTheme();
  return (
    <Paper sx={{ maxWidth: '100%', height: 'auto' }}>
      <CardMedia
        component="div"
        sx={{ display: 'block', maxWidth: '100%', height: 'auto' }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: (theme) => theme.spacing(36),
          }}
        >
          <video
            width="100%"
            height={theme.spacing(34)}
            controls
            autoPlay
            loop
            src={ipfsUriToUrl(src)}
          >
            <FormattedMessage
              id="browser.not.support.video.tage"
              defaultMessage={'Your browser does not support the video tag.'}
            />
          </video>
        </Box>
      </CardMedia>
    </Paper>
  );
}
