import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { AppConfirmDialog } from '@dexkit/ui';
import {
  AppPage,
  AppPageOptions,
} from '@dexkit/ui/modules/wizard/types/config';
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import slugify from 'slugify';
import { BuilderKit } from '../constants';
import { PageSectionKey } from '../hooks/sections';
import AddPageDialog from './dialogs/AddPageDialog';
import PagesSection from './sections/PagesSection';

const ConfirmRemoveSectionDialog = dynamic(
  () => import('./dialogs/ConfirmRemoveSectionDialog')
);

const CloneSectionDialog = dynamic(
  () => import('./dialogs/CloneSectionDialog')
);

const ClonePageDialog = dynamic(() => import('./dialogs/ClonePageDialog'));

function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
  const [pageToClone, setPageToClone] = useState<string>();

  const [sectionToClone, setSectionToClone] = useState<PageSectionKey>();

  const [selectedPage, setSelectedPage] = useState<string>();

  const handleEditPageSections = (page: string, index: number) => {
    setSelectedPage(page);
    setSelectedSectionindex(index);
  };

  const handleSavePageSections = (section: AppPageSection, index: number) => {
    setPages((value) => {
      if (selectedPage) {
        if (index === -1) {
          const newPages = { ...value };
          const newPage = newPages[selectedPage];
          const newSections = [...(newPage.sections || []), section];

          newPage.sections = newSections;
          newPages[selectedPage] = newPage;

          return newPages;
        } else {
          const newPages = { ...value };
          const newPage = newPages[selectedPage];
          const newSections = [...(newPage.sections || [])];

          newSections[index] = section;
          newPage.sections = newSections;
          newPages[selectedPage] = newPage;

          return newPages;
        }
      }
      return value;
    });
  };

  const handleRemovePageSections = (page: string, index: number) => {
    setSelectedPage(page);
    setSelectedSectionindex(index);
    setShowConfirmRemove(true);
  };

  const handleAddPageSections = (page: string) => {
    setSelectedPage(page);
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
    setPages((value) => {
      const newPages = { ...value };

      if (pageOptions.key) {
        newPages[pageOptions.key] = {
          ...newPages[pageOptions.key],
          gatedConditions: pageOptions.gatedConditions,
          gatedPageLayout: pageOptions.gatedPageLayout,
        };
      }

      return newPages;
    });
  };

  const handleEditTitle = (page: string, title: string) => {
    setPages((value) => {
      const newPages = { ...value };

      newPages[page] = {
        ...newPages[page],
        title,
      };

      return newPages;
    });
  };

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
    [currentPage.sections]
  );

  const handleHideDesktop = (page: string, index: number) => {
    setPages((value) => {
      const newPages = { ...value };

      const newPage = newPages[page];

      let section = { ...newPage.sections[index] };

      section.hideDesktop = !Boolean(section.hideDesktop);

      newPages[page].sections[index] = section;

      return newPages;
    });
  };

  const handleHideMobile = (page: string, index: number) => {
    setPages((value) => {
      const newPages = { ...value };

      const newPage = newPages[page];

      let section = { ...newPage.sections[index] };

      section.hideMobile = !Boolean(section.hideMobile);

      newPages[page].sections[index] = section;

      return newPages;
    });
  };

  const handleCloseAddPage = () => {
    setShowAddPage(false);
    setPageToClone(undefined);
  };

  const [showCloneSection, setShowCloneSection] = useState(false);
  ('');

  const [showClonePage, setShowClonePage] = useState(false);

  const handleClone = (page: string, index: number) => {
    setSectionToClone({ page, index });
    setShowCloneSection(true);
  };

  const [activeSection, setActiveSection] = useState<PageSectionKey>();

  const handleConfirmCloneSection = (name: string) => {
    setPages((value) => {
      const newPages = { ...value };

      if (sectionToClone) {
        const newPage = newPages[sectionToClone.page];

        const sections = [...newPage.sections];
        const cloneSection = { ...sections[sectionToClone.index], title: name };

        sections.splice(sectionToClone.index + 1, 0, cloneSection);

        newPages[sectionToClone.page].sections = sections;
      }

      return newPages;
    });

    if (sectionToClone) {
      setActiveSection({
        page: sectionToClone.page,
        index: sectionToClone.index + 1,
      });

      setTimeout(() => {
        setActiveSection(undefined);
      }, 5000);
    }

    setShowCloneSection(false);
    setSectionToClone(undefined);
  };

  const handleClonePage = (page: string) => {
    setShowClonePage(true);
    setPageToClone(page);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmClonePage = (name: string) => {
    setPages((value) => {
      const newPages = { ...value };

      if (pageToClone) {
        const newPage = {
          ...newPages[pageToClone],
          title: name,
          uri: `/${slugify(name)}`,
        };

        newPages[`${pageToClone}-${generateRandomString(10)}`] = newPage;
      }

      return newPages;
    });

    setShowClonePage(false);
    setPageToClone(undefined);
    enqueueSnackbar(
      <FormattedMessage id="page.created" defaultMessage="Page Created" />,
      { variant: 'success' }
    );
  };

  const [showRemovePage, setShowRemovePage] = useState(false);
  const [pageToRemove, setPageToRemove] = useState<string>();

  const handleRemovePage = (page: string) => {
    setPageToRemove(page);
    setShowRemovePage(true);
  };

  const handelCloseConfirmRemove = () => {
    setShowRemovePage(false);
    setPageToRemove(undefined);
  };

  const handleConfirmRemove = () => {
    setPages((value) => {
      const newPages = { ...value };

      if (pageToRemove) {
        delete newPages[pageToRemove];
      }

      return newPages;
    });

    setShowRemovePage(false);
    setPageToRemove(undefined);
  };

  const handleCloseClonePage = () => {
    setShowClonePage(false);
  };

  const handleCloseCloneSection = () => {
    setShowCloneSection(false);
  };

  const handleAddPage = (page: AppPage) => {
    setPages((pages) => {
      const newPages = { ...pages };

      if (page.title) {
        newPages[slugify(page.title)] = { ...page, sections: [] };
      }

      return newPages;
    });
  };

  const handleChangeName = (page: string, index: number, name: string) => {
    setPages((pages) => {
      const newPages = { ...pages };

      const newSections = [...newPages[page].sections];

      newSections[index].name = name;

      newPages[page] = { ...newPages[page], sections: newSections };

      return newPages;
    });
  };

  return (
    <>
      <AddPageDialog
        dialogProps={{
          open: showAddPage,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseAddPage,
        }}
        // clonedPage={pageToClone}
        onCancel={handleCloseAddPage}
        onSubmit={onEditPage}
      />
      {sectionToClone && showCloneSection && (
        <CloneSectionDialog
          DialogProps={{
            open: showCloneSection,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseCloneSection,
          }}
          onConfirm={handleConfirmCloneSection}
          section={pages[sectionToClone.page].sections[sectionToClone.index]}
        />
      )}
      {pageToClone && showClonePage && (
        <ClonePageDialog
          DialogProps={{
            open: showClonePage,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseClonePage,
          }}
          onConfirm={handleConfirmClonePage}
          page={pages[pageToClone]}
        />
      )}

      {pageToRemove && (
        <AppConfirmDialog
          onConfirm={handleConfirmRemove}
          DialogProps={{
            maxWidth: 'sm',
            fullWidth: true,
            open: showRemovePage,
            onClose: handelCloseConfirmRemove,
          }}
        >
          <Typography variant="body1">
            <FormattedMessage
              id="remove.this.page"
              defaultMessage="Remove this page?"
            />
          </Typography>
        </AppConfirmDialog>
      )}

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
        onChangeName={handleChangeName}
        onEditTitle={handleEditTitle}
        sections={currentPage.sections}
        onEditPage={onEditPage}
        onRemovePage={handleRemovePage}
        onSaveSection={handleSavePageSections}
        onRemove={handleRemovePageSections}
        onSwap={handleSwap}
        onClone={handleClone}
        onAddPage={handleAddPage}
        onClonePage={handleClonePage}
        onHideDesktop={handleHideDesktop}
        onHideMobile={handleHideMobile}
        onEdit={handleEditPageSections}
        onAdd={handleAddPageSections}
        activeSection={activeSection}
        currentIndex={selectedSectionIndex}
        section={
          selectedPage && selectedSectionIndex > -1
            ? pages[selectedPage].sections[selectedSectionIndex]
            : undefined
        }
        previewUrl={previewUrl}
      />
    </>
  );
}
