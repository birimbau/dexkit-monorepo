import { Box, Button, Grid, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface PageGatedConditionsTabProps {}

export default function PageGatedConditionsTab({}: PageGatedConditionsTabProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="outlined" color="primary">
            <FormattedMessage
              id="add.condition"
              defaultMessage="Add condition"
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            <FormattedMessage
              id="condition.list"
              defaultMessage="Condition list"
            />
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
