import {
  AppPageSection,
  CustomEditorSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { CssVarsTheme, Stack, Theme } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import {
  AppPage,
  AppPageOptions,
} from '@dexkit/ui/modules/wizard/types/config';
import { BuilderKit } from '../../constants';
import { PageSectionKey } from '../../hooks/sections';
import PagesSectionPage from '../section-config/PagesSectionPage';
const EditSectionDialog = dynamic(
  () => import('../section-config/dialogs/EditSectionDialog')
);
const PageEditorDialog = dynamic(() => import('../dialogs/PageEditorDialog'));

interface Props {
  pages: { [key: string]: AppPage };
  sections: AppPageSection[];
  section?: AppPageSection;
  currentIndex: number;
  onEditPage: (pageOptions: AppPageOptions) => void;
  onHideDesktop: (page: string, index: number) => void;
  onHideMobile: (page: string, index: number) => void;
  onSaveSection: (section: AppPageSection, index: number) => void;
  onRemove: (page: string, index: number) => void;
  onEdit: (page: string, index: number) => void;
  onAdd: (page: string) => void;
  onSwap: (page: string, index: number, other: number) => void;
  onClone: (page: string, index: number) => void;
  onClonePage: (page: string) => void;
  onAddPage: (page: AppPage) => void;
  onEditTitle: (page: string, title: string) => void;
  onRemovePage: (page: string) => void;
  theme?: Omit<Theme, 'palette'> & CssVarsTheme;
  builderKit?: BuilderKit;
  previewUrl?: string;
  activeSection?: PageSectionKey;
}

export default function PagesSection({
  builderKit,
  sections,
  section,
  theme,
  activeSection,
  onEditPage,
  onSaveSection: onSave,
  onHideDesktop,
  onHideMobile,
  onRemovePage,
  onEditTitle,
  onRemove,
  onEdit,
  onClone,
  onClonePage,
  onAddPage,
  onAdd,
  onSwap,
  currentIndex,
  pages,
  previewUrl,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleAddSection = (page: string, custom?: boolean) => {
    if (custom) {
      onAdd(page);
      setIsOpenEditor(true);
    } else {
      onAdd(page);
      setIsEdit(false);
      setIsOpen(true);
    }
  };

  const handleEdit = (page: string, index: number) => {
    onEdit(page, index);

    if (sections[index].type === 'custom') {
      setIsOpenEditor(true);
    } else {
      setIsOpen(true);
    }
    setIsEdit(true);
  };

  const handleSave = (section: AppPageSection, index: number) => {
    onSave(section, index);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseEditor = () => {
    setIsOpenEditor(false);
  };

  return (
    <>
      {isOpen && (
        <EditSectionDialog
          dialogProps={{
            open: isOpen,
            fullScreen: true,
            fullWidth: true,
            onClose: handleClose,
          }}
          builderKit={builderKit}
          isEdit={isEdit}
          section={section}
          onSave={handleSave}
          index={currentIndex}
        />
      )}
      {isOpenEditor && (
        <PageEditorDialog
          dialogProps={{
            open: isOpenEditor,
            fullScreen: true,
            onClose: handleCloseEditor,
          }}
          builderKit={builderKit}
          section={section as CustomEditorSection}
          index={currentIndex}
          onSave={handleSave}
        />
      )}

      <Stack spacing={2}>
        <PagesSectionPage
          pages={pages}
          onRemovePage={onRemovePage}
          onEditTitle={onEditTitle}
          onEditPage={onEditPage}
          onRemove={onRemove}
          onEdit={handleEdit}
          onAddPage={onAddPage}
          onAdd={handleAddSection}
          onClonePage={onClonePage}
          onHideDesktop={onHideDesktop}
          onHideMobile={onHideMobile}
          onClone={onClone}
          onSwap={onSwap}
          theme={theme}
          previewUrl={previewUrl}
          activeSection={activeSection}
        />
      </Stack>
    </>
  );
}
