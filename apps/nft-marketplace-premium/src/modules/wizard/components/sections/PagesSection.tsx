import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Stack, Theme, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppPage, AppPageOptions } from '../../../../types/config';
import { BuilderKit } from '../../constants';
import { AppPageSection, CustomEditorSection } from '../../types/section';
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
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
  onAdd: () => void;
  onCancelEdit: () => void;
  onSwap: (index: number, direction: 'up' | 'down') => void;
  theme?: Theme;
  builderKit?: BuilderKit;
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
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [viewIndexes, setViewIndexes] = useState<number[]>([]);
  const onView = (ind: number) => {
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

  const handleCloneSection = (index: number) => {
    onSave(sections[index], -1);
  };

  const handleAddCustomSection = () => {
    setIsOpenEditor(true);
  };

  const handleEdit = (index: number) => {
    onEdit(index);
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

  const handleOnHideMobile = (index: number) => {
    const newSection = {
      ...sections[index],
      hideMobile: !sections[index].hideMobile,
    };
    onSave(newSection, index);
  };

  const handleOnHideDesktop = (index: number) => {
    const newSection = {
      ...sections[index],
      hideDesktop: !sections[index].hideDesktop,
    };
    onSave(newSection, index);
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
            maxWidth: 'md',
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
          onHideDesktop={handleOnHideDesktop}
          onHideMobile={handleOnHideMobile}
          onClone={handleCloneSection}
          isVisibleIndexes={viewIndexes}
          onSwap={onSwap}
          theme={theme}
        />

        <Button
          variant="outlined"
          onClick={handleAddSection}
          startIcon={<AddIcon />}
        >
          <FormattedMessage id="add.section" defaultMessage="Add section" />
        </Button>

        <Box display={'flex'} justifyContent={'center'}>
          <Typography>
            {' '}
            <FormattedMessage id="or" defaultMessage="Or" />
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={handleAddCustomSection}
          startIcon={<AddIcon />}
        >
          <FormattedMessage
            id="add.custom.section"
            defaultMessage="Add custom section"
          />
        </Button>
      </Stack>
    </>
  );
}
