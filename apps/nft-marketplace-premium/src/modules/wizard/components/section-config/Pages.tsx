import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PageSectionKey } from '../../hooks/sections';
import PreviewPageDialog from '../dialogs/PreviewPageDialog';
import Page from './Page';
import PageSections from './PageSections';
import PagesPagination from './PagesPagination';

export interface PagesProps {
  pages: {
    [key: string]: AppPage;
  };
  onSwap: (page: string, index: number, other: number) => void;
  onAction: (action: string, page: string, index: number) => void;
  onClonePage: (page: string) => void;
  onAdd: (page: string, custom?: boolean) => void;
  onAddPage: () => void;
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  activeSection?: PageSectionKey;
}

export default function Pages({
  pages,
  onSwap,
  onAction,
  theme,
  activeSection,
  onAdd,
  onClonePage,
  onAddPage,
}: PagesProps) {
  const [query, setQuery] = useState('');

  const handleChangeQuery = (value: string) => {
    setQuery(value);
  };

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);

  const keys = useMemo(() => {
    return Object.keys(pages).filter((key) => {
      const page: AppPage = pages[key];

      const hasTitle =
        page.title !== undefined && page.title.toLowerCase().search(query) > -1;
      const hasKey = key.search(query) > -1;

      return hasTitle || hasKey;
    });
  }, [pages, query]);

  const [offset, limit] = useMemo(() => {
    return [page * pageSize, page * pageSize + pageSize];
  }, [keys, page, pageSize]);

  const pageList = useMemo(() => {
    return keys.slice(offset, limit);
  }, [keys, offset, limit]);

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

  const handleClonePage = (page: string) => {
    return () => {
      onClonePage(page);
    };
  };

  const renderPreviewDialog = () => {
    if (showPreview && selectedKey) {
      return (
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
      );
    }
  };

  if (selectedKey !== undefined && isEdit) {
    return (
      <>
        {renderPreviewDialog()}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageSections
              pageKey={selectedKey}
              page={pages[selectedKey]}
              onSwap={handleSwap(selectedKey)}
              onAction={handleAction(selectedKey)}
              onClose={handlePageClose}
              onAdd={handleAdd(selectedKey)}
              onPreview={handleShowPreview(selectedKey)}
              activeSection={activeSection}
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
      </>
    );
  }

  return (
    <>
      {renderPreviewDialog()}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction={'column'}>
              <Typography variant={'h6'}>
                <FormattedMessage id="pages" defaultMessage="Pages" />
              </Typography>

              <Typography variant={'body2'}>
                <FormattedMessage
                  id="pages.wizard.description"
                  defaultMessage="Create and manage your app's pages"
                />
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button
                  variant="contained"
                  onClick={onAddPage}
                  size="small"
                  startIcon={<Add />}
                >
                  <FormattedMessage id="New.page" defaultMessage="New page" />
                </Button>
                <LazyTextField
                  onChange={handleChangeQuery}
                  value={query}
                  TextFieldProps={{
                    size: 'small',
                    variant: 'standard',
                    value: query,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Box>
          </Grid>
          {pageList.map((pageKey, index) => (
            <Grid item xs={12} key={index}>
              <Page
                pageKey={pageKey}
                page={pages[pageKey]}
                onSelect={handleSelect(pageKey)}
                onPreview={handleShowPreview(pageKey)}
                onClone={handleClonePage(pageKey)}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <PagesPagination
              pageSize={pageSize}
              from={offset}
              to={limit}
              onChange={(pageSize) => setPageSize(pageSize)}
              onChangePage={(page: number) => setPage(page)}
              count={keys.length}
              pageCount={pageList.length}
              page={page}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
