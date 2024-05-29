import { Box, Stack } from '@mui/material';
import { SupportedColorScheme } from '@mui/material/styles';

import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  AppPageOptions,
} from '@dexkit/ui/modules/wizard/types/config';
import { useState } from 'react';
import { PageSectionKey } from '../../hooks/sections';
import AddPageDialog from '../dialogs/AddPageDialog';
import GatedConditionsFormDialog from '../dialogs/GatedConditionsFormDialog';
import Pages from './Pages';

interface Props {
  pages: { [key: string]: AppPage };
  onEditPage: (pageOptions: AppPageOptions) => void;
  onRemove: (page: string, index: number) => void;
  onClone: (page: string, index: number) => void;
  onEdit: (page: string, index: number) => void;
  onAdd: (page: string, custom?: boolean) => void;
  onClonePage: (page: string) => void;
  onHideDesktop: (page: string, index: number) => void;
  onHideMobile: (page: string, index: number) => void;
  onEditTitle: (page: string, title: string) => void;
  onSwap: (page: string, index: number, other: number) => void;
  onAddPage: (page: AppPage) => void;
  onRemovePage: (page: string) => void;
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  previewUrl?: string;
  activeSection?: PageSectionKey;
}

export default function PagesSectionPage({
  onRemove,
  onEdit,
  onClone,
  onClonePage,
  onAddPage,
  onSwap,
  onEditPage,
  onRemovePage,
  onAdd,
  onHideDesktop,
  onEditTitle,
  onHideMobile,
  pages,
  activeSection,
}: Props) {
  const [showAddPage, setShowAddPage] = useState(false);

  const handleAddPage = () => {
    setShowAddPage(true);
  };

  const handleCloseAddPage = () => {
    setShowAddPage(false);
  };

  const [showGatedModalForm, setShowGatedModalForm] = useState(false);

  const [page, setPage] = useState<string>();

  const handleCloseGatedModalForm = () => {
    setShowGatedModalForm(false);
    setPage(undefined);
  };

  const handleSubmitGatedConditions = (
    conditions: GatedCondition[],
    layout: GatedPageLayout
  ) => {
    if (page) {
      onEditPage({
        clonedPageKey: pages[page].clonedPageKey,
        gatedConditions: conditions,
        gatedPageLayout: layout,
        isEditGatedConditions: true,
        key: page,
        title: pages[page].title,
        uri: pages[page].uri,
      });
    }

    setShowGatedModalForm(true);
    setPage(undefined);
  };

  const handleEditGateConditions = (page: string) => {
    setShowGatedModalForm(true);
    setPage(page);
  };

  const handleAction = (action: string, page: string, index: number) => {
    switch (action) {
      case 'remove':
        onRemove(page, index);
        break;
      case 'clone':
        onClone(page, index);
        break;
      case 'edit':
        onEdit(page, index);
        break;
      case 'hide.desktop':
        onHideDesktop(page, index);
        break;
      case 'hide.mobile':
        onHideMobile(page, index);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AddPageDialog
        dialogProps={{
          open: showAddPage,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleCloseAddPage,
        }}
        onCancel={handleCloseAddPage}
        onSubmit={(opt) => onAddPage(opt as AppPage)}
      />
      <GatedConditionsFormDialog
        dialogProps={{
          open: showGatedModalForm,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleCloseGatedModalForm,
        }}
        conditions={page ? pages[page]?.gatedConditions : undefined}
        gatedPageLayout={page ? pages[page]?.gatedPageLayout : undefined}
        onCancel={handleCloseGatedModalForm}
        onSubmit={handleSubmitGatedConditions}
      />

      <Stack spacing={2}>
        <Box>
          <Pages
            pages={pages}
            onSwap={onSwap}
            onAction={handleAction}
            onAdd={onAdd}
            onClonePage={onClonePage}
            onAddPage={handleAddPage}
            onEditConditions={handleEditGateConditions}
            activeSection={activeSection}
            onEditTitle={onEditTitle}
            onRemovePage={onRemovePage}
          />
        </Box>
      </Stack>
    </>
  );
}
