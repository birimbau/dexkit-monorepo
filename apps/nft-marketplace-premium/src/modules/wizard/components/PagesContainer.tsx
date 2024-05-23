import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import {
  AppPage,
  AppPageOptions,
} from '@dexkit/ui/modules/wizard/types/config';
import { BuilderKit } from '../constants';
import AddPageDialog from './dialogs/AddPageDialog';
import PagesSection from './sections/PagesSection';
const ConfirmRemoveSectionDialog = dynamic(
  () => import('./dialogs/ConfirmRemoveSectionDialog')
);

interface Props {
  pages: {
    [key: string]: AppPage;
  };
  setPages: Dispatch<
    SetStateAction<{
      [key: string]: AppPage;
    }>
  >;
  theme: any;
  currentPage: AppPage;
  setCurrentPage: Dispatch<SetStateAction<AppPage>>;
  builderKit?: BuilderKit;
  showAddPage: boolean;
  setShowAddPage: (show: boolean) => void;
  previewUrl?: string;
}

export function PagesContainer({
  pages,
  setPages,
  theme,
  currentPage,
  setCurrentPage,
  builderKit,
  showAddPage,
  setShowAddPage,
  previewUrl,
}: Props) {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [selectedSectionIndex, setSelectedSectionindex] = useState<number>(-1);

  const [selectedPage, setSelectedPage] = useState<string>();

  // const [pageToClone, setPageToClone] = useState<
  //   { key?: string; title?: string } | undefined
  // >();

  const handleEditPageSections = (page: string, index: number) => {
    setSelectedPage(page);
    setSelectedSectionindex(index);
  };

  const handleSavePageSections = (section: AppPageSection, index: number) => {
    // setPages((value) => {
    //   if (index === -1) {
    //     const newPages = { ...value };
    //     const newPage = newPages[currentPage.key || 'home'];
    //     const newSections = [...newPage.sections, section];
    //     newPage.sections = newSections;
    //     newPages[currentPage.key || 'home'] = newPage;
    //     setCurrentPage(newPage);
    //     return newPages;
    //   } else {
    //     const newPages = { ...value };
    //     const newPage = newPages[currentPage.key || 'home'];
    //     const newSections = [...newPage.sections];
    //     newSections[index] = section;
    //     newPage.sections = newSections;
    //     newPages[currentPage.key || 'home'] = newPage;
    //     setCurrentPage(newPage);
    //     return newPages;
    //   }
    // });
  };

  // const handleCancelEdit = () => {
  //   setSelectedSectionindex(-1);
  // };

  const handleRemovePageSections = (page: string, index: number) => {
    setSelectedPage(page);
    setSelectedSectionindex(index);
    setShowConfirmRemove(true);
  };

  const handleAddPageSections = () => {
    setSelectedSectionindex(-1);
  };

  const handleCloseConfirmRemove = () => {
    setShowConfirmRemove(false);
    setSelectedSectionindex(-1);
    setSelectedPage(undefined);
  };

  const handleConfimRemoveSection = () => {
    setPages((value) => {
      const newPages = { ...value };

      if (selectedPage) {
        const newPage = { ...newPages[selectedPage] };

        const newSections = [...newPage.sections];

        newSections.splice(selectedSectionIndex, 1);

        newPage.sections = newSections;

        newPages[selectedPage] = newPage;
      }

      return newPages;
    });

    setShowConfirmRemove(false);
  };

  const onEditPage = (pageOptions: AppPageOptions) => {
    // setPages((value) => {
    // // Logic to add conditions to current page
    // if (pageOptions.isEditGatedConditions) {
    //   if (!pageOptions?.key) {
    //     return value;
    //   }
    //   const newPages = { ...value };
    //   newPages[pageOptions.key || ''] = {
    //     ...newPages[pageOptions.key || ''],
    //     gatedConditions: pageOptions?.gatedConditions,
    //     gatedPageLayout: pageOptions?.gatedPageLayout,
    //   };
    //   setCurrentPage(newPages[pageOptions.key || '']);
    //   return newPages;
    // }
    // // we don't allow edit home page
    // if (pageOptions?.key === 'home') {
    //   return value;
    // } else {
    //   if (!pageOptions?.key) {
    //     return value;
    //   }
    //   const newPages = { ...value };
    //   // it's a clone
    //   if (pageOptions?.clonedPageKey) {
    //     newPages[pageOptions.key || ''] = {
    //       ...newPages[pageOptions.clonedPageKey || ''],
    //       ...pageOptions,
    //     };
    //     setCurrentPage(newPages[pageOptions.key || '']);
    //     return newPages;
    //   }
    //   // it's an edit
    //   if (newPages[pageOptions.key]) {
    //     newPages[pageOptions.key || ''] = {
    //       ...newPages[pageOptions.key || ''],
    //       ...pageOptions,
    //     };
    //     setCurrentPage(newPages[pageOptions.key || '']);
    //   } else {
    //     // create new page
    //     newPages[pageOptions.key || ''] = { sections: [], ...pageOptions };
    //     setCurrentPage(newPages[pageOptions.key || '']);
    //   }
    //   return newPages;
    // }
    // });
  };

  const onViewPage = (slug: string) => {};

  const handleSwap = useCallback(
    (page: string, index: number, otherIndex: number) => {
      setPages((value) => {
        const newPages = { ...value };

        const newPage = newPages[page];

        let firstSection = newPage.sections[index];
        let secondSection = newPage.sections[otherIndex];

        newPage.sections[index] = secondSection;
        newPage.sections[otherIndex] = firstSection;

        return newPages;
      });
    },
    []
  );

  const handleCloseAddPage = () => {
    setShowAddPage(false);
    // setPageToClone(undefined);
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
        // clonedPage={pageToClone}
        onCancel={handleCloseAddPage}
        onSubmit={onEditPage}
      />
      <ConfirmRemoveSectionDialog
        dialogProps={{
          open: showConfirmRemove,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmRemove,
        }}
        onConfirm={handleConfimRemoveSection}
      />
      <PagesSection
        builderKit={builderKit}
        pages={pages}
        theme={theme}
        sections={currentPage.sections}
        onRemovePage={() => {}}
        onEditPage={onEditPage}
        onViewPage={onViewPage}
        onSave={handleSavePageSections}
        onRemove={handleRemovePageSections}
        onSwap={handleSwap}
        onCancelEdit={() => {}}
        onEdit={handleEditPageSections}
        onAdd={handleAddPageSections}
        currentIndex={selectedSectionIndex}
        currentPage={currentPage}
        section={
          selectedSectionIndex > -1
            ? currentPage.sections[selectedSectionIndex]
            : undefined
        }
        previewUrl={previewUrl}
      />
    </>
  );
}
