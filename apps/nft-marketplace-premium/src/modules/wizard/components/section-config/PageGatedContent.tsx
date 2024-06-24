import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';

import { FormattedMessage } from 'react-intl';

import TabContext from '@mui/lab/TabContext';

import TabPanel from '@mui/lab/TabPanel';

import PageGatedConditionsTab from './PageGatedConditionsTab';

export interface PageGatedContentProps {}

export default function PageGatedContent({}: PageGatedContentProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold">
            <FormattedMessage
              id="gated.conditions"
              defaultMessage="Gated Conditions"
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TabContext value="conditions">
            <Tabs>
              <Tab
                value="conditions"
                label={
                  <FormattedMessage
                    id="conditions"
                    defaultMessage="conditions"
                  />
                }
              />
              <Tab
                value="layout"
                label={<FormattedMessage id="layout" defaultMessage="Layout" />}
              />
            </Tabs>
            <TabPanel value="conditions">
              <PageGatedConditionsTab />
            </TabPanel>
            <TabPanel value="layout"></TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </Box>
  );
}
