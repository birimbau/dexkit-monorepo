import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { AppPage, AppPageOptions } from '../../../types/config';
import { BuilderKit } from '../constants';
import { AppPageSection } from '../types/section';
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
}

export function PagesContainer({
  pages,
  setPages,
  theme,
  currentPage,
  setCurrentPage,
  builderKit,
}: Props) {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [selectedSectionIndex, setSelectedSectionindex] = useState<number>(-1);

  const handleEditPageSections = (index: number) => {
    setSelectedSectionindex(index);
  };

  const handleSavePageSections = (section: AppPageSection, index: number) => {
    setPages((value) => {
      if (index === -1) {
        const newPages = { ...value };
        const newPage = newPages[currentPage.key || 'home'];

        const newSections = [...newPage.sections, section];
        newPage.sections = newSections;
        newPages[currentPage.key || 'home'] = newPage;
        setCurrentPage(newPage);
        return newPages;
      } else {
        const newPages = { ...value };
        const newPage = newPages[currentPage.key || 'home'];

        const newSections = [...newPage.sections];
        newSections[index] = section;
        newPage.sections = newSections;
        newPages[currentPage.key || 'home'] = newPage;
        setCurrentPage(newPage);
        return newPages;
      }
    });
  };

  const handleCancelEdit = () => {
    setSelectedSectionindex(-1);
  };

  const handleRemovePageSections = (index: number) => {
    setSelectedSectionindex(index);
    setShowConfirmRemove(true);
  };

  const handleAddPageSections = () => {
    setSelectedSectionindex(-1);
  };

  const handleCloseConfirmRemove = () => {
    setShowConfirmRemove(false);
    setSelectedSectionindex(-1);
  };

  const handleConfimRemoveSection = () => {
    setPages((value) => {
      const newPages = { ...value };

      const newPage = { ...newPages[currentPage.key || 'home'] };

      const newSections = [...newPage.sections];
      newSections.splice(selectedSectionIndex, 1);
      newPage.sections = newSections;
      newPages[currentPage.key || 'home'] = newPage;
      setCurrentPage(newPage);
      return newPages;
    });
    setShowConfirmRemove(false);
    setSelectedSectionindex(-1);
  };

  const onRemovePage = (slug: string) => {
    setPages((value) => {
      // we don't allow delete home page
      if (slug === 'home') {
        return value;
      } else {
        const newPages = { ...value };
        delete newPages[slug];
        setCurrentPage(newPages['home']);
        return newPages;
      }
    });
  };
  const onEditPage = (pageOptions: AppPageOptions) => {
    setPages((value) => {
      // we don't allow edit home page
      if (pageOptions?.key === 'home') {
        return value;
      } else {
        if (!pageOptions?.key) {
          return value;
        }
        const newPages = { ...value };
        // it's a clone
        if (pageOptions?.clonedPageKey) {
          newPages[pageOptions.key || ''] = {
            ...newPages[pageOptions.clonedPageKey || ''],
            ...pageOptions,
          };
          setCurrentPage(newPages[pageOptions.key || '']);
          return newPages;
        }

        // it's an edit
        if (newPages[pageOptions.key]) {
          newPages[pageOptions.key || ''] = {
            ...newPages[pageOptions.key || ''],
            ...pageOptions,
          };
          setCurrentPage(newPages[pageOptions.key || '']);
        } else {
          // create new page
          newPages[pageOptions.key || ''] = { sections: [], ...pageOptions };
          setCurrentPage(newPages[pageOptions.key || '']);
        }
        return newPages;
      }
    });
  };

  const onViewPage = (slug: string) => {
    if (pages[slug]) {
      setCurrentPage(pages[slug]);
    }
  };

  const handleSwap = useCallback(
    (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index > 0) {
        setPages((value) => {
          const newPages = { ...value };
          const newPage = newPages[currentPage.key || 'home'];
          const newSections = [...newPage.sections];
          let before = newSections[index - 1];
          newSections[index - 1] = newSections[index];
          newSections[index] = before;
          newPage.sections = newSections;
          newPages[currentPage.key || 'home'] = newPage;
          setCurrentPage(newPage);
          return newPages;
        });
      } else if (
        direction === 'down' &&
        index < pages[currentPage.key || 'home'].sections.length - 1
      ) {
        setPages((value) => {
          const newPages = { ...value };
          const newPage = newPages[currentPage.key || 'home'];
          const newSections = [...newPage.sections];

          let before = newSections[index + 1];

          newSections[index + 1] = newSections[index];
          newSections[index] = before;
          newPage.sections = newSections;
          newPages[currentPage.key || 'home'] = newPage;
          setCurrentPage(newPage);
          return newPages;
        });
      }
    },
    [currentPage.sections]
  );

  return (
    <>
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
        onRemovePage={onRemovePage}
        onEditPage={onEditPage}
        onViewPage={onViewPage}
        onSave={handleSavePageSections}
        onRemove={handleRemovePageSections}
        onSwap={handleSwap}
        onCancelEdit={handleCancelEdit}
        onEdit={handleEditPageSections}
        onAdd={handleAddPageSections}
        currentIndex={selectedSectionIndex}
        currentPage={currentPage}
        section={
          selectedSectionIndex > -1
            ? currentPage.sections[selectedSectionIndex]
            : undefined
        }
      />
    </>
  );
}
