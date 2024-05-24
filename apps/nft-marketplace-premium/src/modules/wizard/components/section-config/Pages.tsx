import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import Add from '@mui/icons-material/Add';
import { Alert, Box, Button, Grid, Stack } from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PreviewPageDialog from '../dialogs/PreviewPageDialog';
import Page from './Page';
import PageSections from './PageSections';

export interface PagesProps {
  pages: {
    [key: string]: AppPage;
  };
  onSwap: (page: string, index: number, other: number) => void;
  onAction: (action: string, page: string, index: number) => void;
  onAdd: (page: string, custom?: boolean) => void;
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
}

export default function Pages({
  pages,
  onSwap,
  onAction,
  theme,
  onAdd,
}: PagesProps) {
  const keys = useMemo(() => {
    return Object.keys(pages);
  }, [pages]);

  const [selectedKey, setSelectedKey] = useState<string>();

  const [isEdit, setIsEdit] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const handleSelect = (id: string) => {
    return () => {
      setIsEdit(true);
      setSelectedKey(id);
    };
  };

  const handleSwap = (page: string) => {
    return (index: number, other: number) => {
      onSwap(page, index, other);
    };
  };

  const handleAction = (page: string) => {
    return (action: string, index: number) => {
      onAction(action, page, index);
    };
  };

  const handleShowPreview = (pageKey: string) => {
    return () => {
      setSelectedKey(pageKey);
      setShowPreview(true);
    };
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handlePageClose = () => {
    setSelectedKey(undefined);
    setIsEdit(false);
  };

  const handleAdd = (page: string, custom?: boolean) => {
    return () => {
      onAdd(page, custom);
    };
  };

  if (selectedKey !== undefined && isEdit) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PageSections
            page={pages[selectedKey]}
            onSwap={handleSwap(selectedKey)}
            onAction={handleAction(selectedKey)}
            onClose={handlePageClose}
            onAdd={handleAdd(selectedKey)}
          />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id={'info.about.custom.section'}
              defaultMessage={
                'Instead of using pre-defined sections, you have the freedom to create a personalized section by effortlessly dragging and dropping functional blocks to design your ideal layout.'
              }
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Stack spacing={2} direction="row">
              <Box maxWidth={'xs'}>
                <Button
                  variant="outlined"
                  onClick={handleAdd(selectedKey)}
                  startIcon={<Add />}
                >
                  <FormattedMessage
                    id="add.section"
                    defaultMessage="Add section"
                  />
                </Button>
              </Box>

              <Box maxWidth={'xs'}>
                <Button
                  variant="outlined"
                  onClick={handleAdd(selectedKey, true)}
                  startIcon={<Add />}
                >
                  <FormattedMessage
                    id="add.custom.section"
                    defaultMessage="Add custom section"
                  />
                </Button>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      {showPreview && selectedKey && (
        <CssVarsProvider theme={theme}>
          <PreviewPageDialog
            dialogProps={{
              open: showPreview,
              maxWidth: 'xl',
              fullWidth: true,
              onClose: handleClosePreview,
            }}
            disabled={true}
            sections={pages[selectedKey].sections}
            name={pages[selectedKey]?.title}
          />
        </CssVarsProvider>
      )}

      <Box>
        <Grid container spacing={2}>
          {keys.map((pageKey, index) => (
            <Grid item xs={12} key={index}>
              <Page
                page={pages[pageKey]}
                index={index}
                onSelect={handleSelect(pageKey)}
                onPreview={handleShowPreview(pageKey)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
