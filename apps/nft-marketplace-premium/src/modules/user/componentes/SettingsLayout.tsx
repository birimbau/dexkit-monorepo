import { Card, Grid, List, ListItemButton, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface SettingsLayoutProps {
  children: (tab: string) => React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [tab, setTab] = useState('ai');

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <Card>
          <List disablePadding>
            <ListItemButton divider onClick={() => setTab('ai')}>
              <ListItemText
                primary={
                  <FormattedMessage
                    defaultMessage="AI Assistant"
                    id="ai.assistant"
                  />
                }
              />
            </ListItemButton>
            <ListItemButton divider onClick={() => setTab('billing')}>
              <ListItemText
                primary={
                  <FormattedMessage defaultMessage="Billing" id="billing" />
                }
              />
            </ListItemButton>
            <ListItemButton divider onClick={() => setTab('payments')}>
              <ListItemText
                primary={
                  <FormattedMessage
                    defaultMessage="Payment Methods"
                    id="payment.methods"
                  />
                }
              />
            </ListItemButton>
          </List>
        </Card>
      </Grid>
      <Grid item xs={12} sm={9}>
        {children(tab)}
      </Grid>
    </Grid>
  );
}
