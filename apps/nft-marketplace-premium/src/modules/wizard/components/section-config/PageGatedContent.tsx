import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';

import { FormattedMessage } from 'react-intl';

import TabContext from '@mui/lab/TabContext';

import TabPanel from '@mui/lab/TabPanel';

import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  GatedCondition,
} from '@dexkit/ui/modules/wizard/types/config';
import { useState } from 'react';
import PageGatedConditionsTab from './PageGatedConditionsTab';
import PageGatedLayoutTab from './PageGatedLayoutTab';

export interface PageGatedContentProps {
  page: AppPage;
  onSaveGatedConditions: (
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
  ) => void;
}

export default function PageGatedContent({
  page,
  onSaveGatedConditions,
}: PageGatedContentProps) {
  const [tab, setTab] = useState('conditions');

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
          <TabContext value={tab}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Tabs value={tab} onChange={(e, value) => setTab(value)}>
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
                    label={
                      <FormattedMessage id="layout" defaultMessage="Layout" />
                    }
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel sx={{ p: 0, m: 0 }} value="conditions">
                  <PageGatedConditionsTab
                    onSaveGatedConditions={onSaveGatedConditions}
                    conditions={page.gatedConditions ?? []}
                  />
                </TabPanel>
                <TabPanel sx={{ p: 0, m: 0 }} value="layout">
                  <PageGatedLayoutTab />
                </TabPanel>
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      </Grid>
    </Box>
  );
}
