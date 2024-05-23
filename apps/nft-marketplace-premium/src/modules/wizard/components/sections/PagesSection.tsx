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
  currentPage?: AppPage;
  onRemovePage: (slug: string) => void;
  onEditPage: (pageOptions: AppPageOptions) => void;
  onViewPage: (slug: string) => void;
  onSave: (section: AppPageSection, index: number) => void;
  onRemove: (page: string, index: number) => void;
  onEdit: (page: string, index: number) => void;
  onAdd: () => void;
  onCancelEdit: () => void;
  onSwap: (page: string, index: number, other: number) => void;
  theme?: Omit<Theme, 'palette'> & CssVarsTheme;
  builderKit?: BuilderKit;
  previewUrl?: string;
}

export default function PagesSection({
  builderKit,
  sections,
  section,
  theme,
  onRemovePage,
  onEditPage,
  onViewPage,
  onSave,
  onRemove,
  onEdit,
  onAdd,
  onCancelEdit,
  onSwap,
  currentIndex,
  currentPage,
  pages,
  previewUrl,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [viewIndexes, setViewIndexes] = useState<number[]>([]);

  const onView = (page: string, ind: number) => {
    const newViewIndexes = [...viewIndexes];

    const newIndex = newViewIndexes.indexOf(ind);
    if (newIndex !== -1) {
      newViewIndexes.splice(newIndex, 1);
      setViewIndexes(newViewIndexes);
    } else {
      newViewIndexes.push(ind);
      setViewIndexes(newViewIndexes);
    }
  };

  const handleAddSection = () => {
    onAdd();
    setIsEdit(false);
    setIsOpen(true);
  };

  const handleAddCustomSection = () => {
    setIsOpenEditor(true);
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
    onCancelEdit();
  };

  const handleCloseEditor = () => {
    setIsOpenEditor(false);
    onCancelEdit();
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
          currentPage={currentPage}
          sections={sections}
          onRemovePage={onRemovePage}
          onViewPage={onViewPage}
          onEditPage={onEditPage}
          onRemove={onRemove}
          onEdit={handleEdit}
          onView={onView}
          onHideDesktop={() => {}}
          onHideMobile={() => {}}
          onClone={() => {}}
          isVisibleIndexes={viewIndexes}
          onSwap={onSwap}
          theme={theme}
          previewUrl={previewUrl}
        />
      </Stack>
    </>
  );
}
