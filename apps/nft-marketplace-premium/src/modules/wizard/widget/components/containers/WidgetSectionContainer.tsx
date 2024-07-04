import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  GatedCondition,
} from '@dexkit/ui/modules/wizard/types/config';
import { Box, Grid } from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from '@mui/material/styles';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { PagesContext } from '../../../components/containers/EditWizardContainer';
import PreviewPageDialog from '../../../components/dialogs/PreviewPageDialog';
import PageGatedContent from '../../../components/gated-content/PageGatedContent';
import { PageSectionKey } from '../../../hooks/sections';

import PageSections from '../../../components/section-config/PageSections';

export interface PagesProps {
  pages: {
    [key: string]: AppPage;
  };
  onSwap: (page: string, index: number, other: number) => void;
  onAction: (action: string, page: string, index: number) => void;
  onClonePage: (page: string) => void;
  onAdd: (page: string, custom?: boolean) => void;
  onAddPage: () => void;
  onEditTitle: (page: string, title: string) => void;
  onUpdateGatedConditions: (
    page: string,
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
    enableGatedConditions?: boolean,
  ) => void;
  onRemovePage: (page: string) => void;
  onChangeName: (page: string, index: number, name: string) => void;
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  activeSection?: PageSectionKey;
  site?: string;
  previewUrl?: string;
}

export default function WidgetSectionContainer({
  pages,
  onSwap,
  onAction,
  theme,
  activeSection,
  onAdd,
  onClonePage,
  onUpdateGatedConditions,
  onRemovePage,
  onEditTitle,
  onAddPage,
  onChangeName,
  site,
  previewUrl,
}: PagesProps) {
  const [query, setQuery] = useState('');

  const handleChangeQuery = (value: string) => {
    setQuery(value);
  };

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
  }, [keys, offset, limit, pages]);

  const { setSelectedKey, setIsEditPage, isEditPage, selectedKey, setOldPage } =
    useContext(PagesContext);

  const [showPreview, setShowPreview] = useState(false);

  const handleSelect = (id: string) => {
    return () => {
      const page = structuredClone(pages[id]);

      setIsEditPage(true);
      setSelectedKey(id);
      setOldPage(page);
    };
  };

  const handleSwap = (page: string) => {
    return (index: number, other: number) => {
      onSwap(page, index, other);
    };
  };

  const handleAction = useCallback(
    (page: string) => {
      return (action: string, index: number) => {
        onAction(action, page, index);
      };
    },
    [onAction],
  );

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
    setIsEditPage(false);
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

  const [isEditGate, setIsEditGate] = useState(false);

  const handleEditCondtions = (page: string) => {
    return () => {
      setSelectedKey(page);
      setIsEditGate(true);
    };
  };

  const handleChangeName = (page: string) => {
    return (index: number, name: string) => {
      onChangeName(page, index, name);
    };
  };

  const handleSaveGatedConditions = (
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
    enableGatedConditions?: boolean,
  ) => {
    if (selectedKey) {
      onUpdateGatedConditions(
        selectedKey,
        conditions,
        layout,
        enableGatedConditions === undefined ? true : enableGatedConditions,
      );
    }
  };

  const { formatMessage } = useIntl();

  const handleCloseGate = () => {
    setIsEditGate(false);
    setSelectedKey(undefined);
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
            page={selectedKey}
            site={site}
          />
        </CssVarsProvider>
      );
    }
  };

  if (selectedKey !== undefined && isEditGate) {
    return (
      <PageGatedContent
        page={pages[selectedKey]}
        onSaveGatedConditions={handleSaveGatedConditions}
        onClose={handleCloseGate}
      />
    );
  }

  if (selectedKey !== undefined && isEditPage) {
    return (
      <Box px={{ sm: 4 }}>
        {renderPreviewDialog()}
        <Grid container spacing={2}>
          {isEditPage && (
            <Grid item xs={12}>
              <PageSections
                onAddSection={handleAdd(selectedKey)}
                onAddCustomSection={handleAdd(selectedKey, true)}
                onEditTitle={onEditTitle}
                pageKey={selectedKey}
                page={pages[selectedKey]}
                onSwap={handleSwap(selectedKey)}
                onAction={handleAction(selectedKey)}
                onClose={handlePageClose}
                onAdd={handleAdd(selectedKey)}
                onPreview={handleShowPreview(selectedKey)}
                activeSection={activeSection}
                onClone={() => onClonePage(selectedKey)}
                onChangeName={handleChangeName(selectedKey)}
                siteId={site}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }
}
