import { Box, Stack, Typography } from '@mui/material';
import { SupportedColorScheme } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  AppPageOptions,
} from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useState } from 'react';
import AddPageDialog from '../dialogs/AddPageDialog';
import GatedConditionsFormDialog from '../dialogs/GatedConditionsFormDialog';
import Pages from './Pages';

interface Props {
  sections: AppPageSection[];
  pages: { [key: string]: AppPage };
  currentPage?: AppPage;
  onRemovePage: (slug: string) => void;
  onEditPage: (pageOptions: AppPageOptions) => void;
  onViewPage: (slug: string) => void;
  onRemove: (page: string, index: number) => void;
  onClone: (page: string, index: number) => void;
  onEdit: (page: string, index: number) => void;
  onView: (page: string, index: number) => void;
  onHideDesktop: (page: string, index: number) => void;
  onHideMobile: (page: string, index: number) => void;
  isVisibleIndexes: number[];
  onSwap: (page: string, index: number, other: number) => void;
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  previewUrl?: string;
}

export default function PagesSectionPage({
  sections,
  onRemove,
  onEdit,
  onView,
  onClone,
  onSwap,
  isVisibleIndexes,
  onEditPage,
  onViewPage,
  onRemovePage,
  onHideDesktop,
  onHideMobile,
  theme,
  currentPage,
  pages,
  previewUrl,
}: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [pageToClone, setPageToClone] = useState<
    { key?: string; title?: string } | undefined
  >();

  const [showDeletePageDialog, setShowDeleteDialogPage] = useState(false);

  const [showAddPage, setShowAddPage] = useState(false);

  const [showGatedModalForm, setShowGatedModalForm] = useState(false);

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowGatedModalForm = () => {
    setShowGatedModalForm(true);
  };

  const handleClonePage = () => {
    setPageToClone({
      title: currentPage?.title,
      key: currentPage?.key,
    });
    setShowAddPage(true);
  };

  const handleCloseAddPage = () => {
    setShowAddPage(false);
    setPageToClone(undefined);
  };

  const handleCloseGatedModalForm = () => {
    setShowGatedModalForm(false);
  };

  const handleConfirmDeletePage = () => {
    setShowDeleteDialogPage(false);
    if (currentPage && currentPage.key) {
      onRemovePage(currentPage.key);
    }
  };

  const handleCloseConfirmDeletePage = () => {
    setShowDeleteDialogPage(false);
  };

  const handleShowPageDeleteDialog = () => {
    setShowDeleteDialogPage(true);
  };

  const onEditGatedContidions = (
    gatedConditions: GatedCondition[],
    gatedLayout: GatedPageLayout
  ) => {
    onEditPage({
      isEditGatedConditions: true,
      gatedPageLayout: gatedLayout,
      gatedConditions: gatedConditions,
      title: currentPage?.title,
      key: currentPage?.key,
    });
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
      case 'view':
        onView(page, index);
        break;
      case 'hide.desktop':
        onHideDesktop(page, index);
      case 'hide.moile':
        onHideMobile(page, index);
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
        clonedPage={pageToClone}
        onCancel={handleCloseAddPage}
        onSubmit={onEditPage}
      />
      <GatedConditionsFormDialog
        dialogProps={{
          open: showGatedModalForm,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleCloseGatedModalForm,
        }}
        conditions={currentPage?.gatedConditions}
        gatedPageLayout={currentPage?.gatedPageLayout}
        onCancel={handleCloseGatedModalForm}
        onSubmit={onEditGatedContidions}
      />
      <AppConfirmDialog
        DialogProps={{
          open: showDeletePageDialog,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmDeletePage,
        }}
        onConfirm={handleConfirmDeletePage}
      >
        <Stack>
          <Typography variant="h5" align="center">
            <FormattedMessage
              id="delete.page"
              defaultMessage="Delete page {page}"
              values={{ page: currentPage?.title || '' }}
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="do.you.really.want.to.delete.this.page"
              defaultMessage="Do you really want to delete {page} page?"
              values={{ page: currentPage?.title || '' }}
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>

      <Stack spacing={2}>
        <Box>
          <Pages pages={pages} onSwap={onSwap} onAction={handleAction} />
        </Box>
      </Stack>
    </>
  );
}
