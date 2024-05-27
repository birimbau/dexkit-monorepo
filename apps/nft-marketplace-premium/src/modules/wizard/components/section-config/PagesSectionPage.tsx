import { Box, Stack } from '@mui/material';
import { SupportedColorScheme } from '@mui/material/styles';

import {
  AppPage,
  AppPageOptions,
} from '@dexkit/ui/modules/wizard/types/config';
import { useState } from 'react';
import { PageSectionKey } from '../../hooks/sections';
import AddPageDialog from '../dialogs/AddPageDialog';
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
  onSwap: (page: string, index: number, other: number) => void;
  onAddPage: (page: AppPage) => void;
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
  onAdd,
  onHideDesktop,
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

      <Stack spacing={2}>
        <Box>
          <Pages
            pages={pages}
            onSwap={onSwap}
            onAction={handleAction}
            onAdd={onAdd}
            onClonePage={onClonePage}
            onAddPage={handleAddPage}
            activeSection={activeSection}
          />
        </Box>
      </Stack>
    </>
  );
}
