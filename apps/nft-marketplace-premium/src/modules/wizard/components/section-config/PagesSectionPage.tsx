import { Box, Stack } from '@mui/material';
import { SupportedColorScheme } from '@mui/material/styles';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import {
  AppPage,
  AppPageOptions,
} from '@dexkit/ui/modules/wizard/types/config';
import { useState } from 'react';
import AddPageDialog from '../dialogs/AddPageDialog';
import Pages from './Pages';

interface Props {
  pages: { [key: string]: AppPage };
  onEditPage: (pageOptions: AppPageOptions) => void;
  onRemove: (page: string, index: number) => void;
  onClone: (page: string, index: number) => void;
  onEdit: (page: string, index: number) => void;
  onAdd: (page: string, custom?: boolean) => void;
  onHideDesktop: (page: string, index: number) => void;
  onHideMobile: (page: string, index: number) => void;
  onSwap: (page: string, index: number, other: number) => void;
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  previewUrl?: string;
}

export default function PagesSectionPage({
  onRemove,
  onEdit,
  onClone,
  onSwap,
  onEditPage,
  onAdd,
  onHideDesktop,
  onHideMobile,
  pages,
}: Props) {
  const [pageToClone, setPageToClone] = useState<
    { key?: string; title?: string } | undefined
  >();

  const [showDeletePageDialog, setShowDeleteDialogPage] = useState(false);

  const [showAddPage, setShowAddPage] = useState(false);

  const handleCloseAddPage = () => {
    setShowAddPage(false);
    setPageToClone(undefined);
  };

  const handleCloseConfirmDeletePage = () => {
    setShowDeleteDialogPage(false);
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
        clonedPage={pageToClone}
        onCancel={handleCloseAddPage}
        onSubmit={onEditPage}
      />
      {/* <GatedConditionsFormDialog
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
      /> */}
      <AppConfirmDialog
        DialogProps={{
          open: showDeletePageDialog,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmDeletePage,
        }}
        onConfirm={() => {}}
      >
        <Stack>
          {/* <Typography variant="h5" align="center">
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
          </Typography> */}
        </Stack>
      </AppConfirmDialog>

      <Stack spacing={2}>
        <Box>
          <Pages
            pages={pages}
            onSwap={onSwap}
            onAction={handleAction}
            onAdd={onAdd}
          />
        </Box>
      </Stack>
    </>
  );
}
