import { Card, Grid, List, ListItemButton, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { PageHeader } from 'src/components/PageHeader';

export interface SettingsLayoutProps {
  children: (tab: string) => React.ReactNode;
  tab: string;
  shallow?: boolean;
}

export default function SettingsLayout({
  children,
  tab,
  shallow,
}: SettingsLayoutProps) {
  const activeOption: any = useMemo(() => {
    if (tab === 'ai') {
      return {
        uri: '/ai',
        active: true,
        caption: (
          <FormattedMessage id="ai.assistant" defaultMessage="AI Assistant" />
        ),
      };
    } else if (tab === 'billing') {
      return {
        uri: '/billing',
        active: true,
        caption: <FormattedMessage id="billing" defaultMessage="Billing" />,
      };
    } else if (tab === 'payments') {
      return {
        uri: '/payments',
        active: true,
        caption: <FormattedMessage id="payments" defaultMessage="Payments" />,
      };
    }

    return {};
  }, [tab]);

  const router = useRouter();

  const handleClick = useCallback((page: string) => {
    return () => {
      if (page === 'ai') {
        router.push('/u/settings?section=ai', undefined, { shallow });
      } else if (page === 'billing') {
        router.push('/u/settings?section=billing', undefined, {
          shallow,
        });
      } else if (page === 'payments') {
        router.push('/u/settings?section=payments', undefined, {
          shallow,
        });
      }
    };
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PageHeader
          breadcrumbs={[
            {
              caption: <FormattedMessage id="home" defaultMessage="Home" />,
              uri: '/',
            },
            {
              caption: (
                <FormattedMessage id="settings" defaultMessage="Settings" />
              ),
              uri: '/u/settings',
            },
            activeOption,
          ]}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <List disablePadding>
            <ListItemButton
              selected={tab === 'ai'}
              divider
              onClick={handleClick('ai')}
            >
              <ListItemText
                primary={
                  <FormattedMessage
                    defaultMessage="AI Assistant"
                    id="ai.assistant"
                  />
                }
              />
            </ListItemButton>
            <ListItemButton
              selected={tab === 'billing'}
              divider
              onClick={handleClick('billing')}
            >
              <ListItemText
                primary={
                  <FormattedMessage defaultMessage="Billing" id="billing" />
                }
              />
            </ListItemButton>
            <ListItemButton
              selected={tab === 'payments'}
              divider
              onClick={handleClick('payments')}
            >
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
