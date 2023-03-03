import AddIcon from '@mui/icons-material/Add';
import AppsIcon from '@mui/icons-material/Apps';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CallToAction from '@mui/icons-material/CallToAction';
import VideocamIcon from '@mui/icons-material/Videocam';

import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Theme,
  ThemeProvider,
  Typography,
  useTheme,
} from '@mui/material';

import { FormattedMessage } from 'react-intl';

import {
  AppPage,
  AppPageOptions,
  AppPageSection,
} from '../../../../types/config';

import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useState } from 'react';
import AppConfirmDialog from '../../../../components/AppConfirmDialog';
import AddPageDialog from '../dialogs/AddPageDialog';
import PreviewPageDialog from '../dialogs/PreviewPageDialog';
import PagesMenu from '../PagesMenu';
import PreviewPagePlatform from '../PreviewPagePlatform';
import { SectionHeader } from './SectionHeader';

interface Props {
  sections: AppPageSection[];
  pages: { [key: string]: AppPage };
  currentPage?: AppPage;
  onRemovePage: (slug: string) => void;
  onEditPage: (pageOptions: AppPageOptions) => void;
  onViewPage: (slug: string) => void;
  onRemove: (index: number) => void;
  onClone: (index: number) => void;
  onEdit: (index: number) => void;
  onView: (index: number) => void;
  onHideDesktop: (index: number) => void;
  onHideMobile: (index: number) => void;
  isVisibleIndexes: number[];
  onSwap: (index: number, direction: 'up' | 'down') => void;
  theme?: Theme;
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
}: Props) {
  const renderSection = (
    section: AppPageSection,
    index: number,
    isVisible: boolean
  ) => {
    if (section.type === 'video') {
      return (
        <Card key={index}>
          <CardContent>
            <SectionHeader
              title={<FormattedMessage id="video" defaultMessage="Video" />}
              subtitle={section.title}
              icon={<VideocamIcon />}
              onSwap={onSwap}
              onRemove={onRemove}
              onClone={onClone}
              onEdit={onEdit}
              onView={onView}
              index={index}
              onHideDesktop={onHideDesktop}
              onHideMobile={onHideMobile}
              hideDesktop={section.hideDesktop}
              hideMobile={section.hideMobile}
              isVisible={isVisible}
              length={sections.length}
            />
          </CardContent>

          {isVisible && (
            <PreviewPagePlatform sections={[section]} disabled={true} />
          )}
        </Card>
      );
    } else if (section.type === 'call-to-action') {
      return (
        <Card key={index}>
          <CardContent>
            <SectionHeader
              title={
                <FormattedMessage
                  id="call.to.action"
                  defaultMessage="Call to Action"
                />
              }
              subtitle={section.title}
              icon={<CallToAction />}
              onSwap={onSwap}
              onRemove={onRemove}
              onClone={onClone}
              onEdit={onEdit}
              onView={onView}
              index={index}
              onHideDesktop={onHideDesktop}
              onHideMobile={onHideMobile}
              hideDesktop={section.hideDesktop}
              hideMobile={section.hideMobile}
              isVisible={isVisible}
              length={sections.length}
            />
          </CardContent>
          {isVisible && (
            <PreviewPagePlatform sections={[section]} disabled={true} />
          )}
        </Card>
      );
    } else if (section.type === 'featured') {
      return (
        <Card key={index}>
          <CardContent>
            <SectionHeader
              title={
                <FormattedMessage id="featured" defaultMessage="Featured" />
              }
              subtitle={section.title}
              icon={<BookmarkIcon />}
              onSwap={onSwap}
              onRemove={onRemove}
              onEdit={onEdit}
              onClone={onClone}
              onView={onView}
              index={index}
              onHideDesktop={onHideDesktop}
              onHideMobile={onHideMobile}
              hideDesktop={section.hideDesktop}
              hideMobile={section.hideMobile}
              isVisible={isVisible}
              length={sections.length}
            />
          </CardContent>
          {isVisible && (
            <PreviewPagePlatform sections={[section]} disabled={true} />
          )}
        </Card>
      );
    } else if (section.type === 'collections') {
      return (
        <Card key={index}>
          <CardContent>
            <SectionHeader
              title={
                <FormattedMessage
                  id="collections"
                  defaultMessage="Collections"
                />
              }
              subtitle={section.title || ''}
              icon={<AppsIcon />}
              onSwap={onSwap}
              onRemove={onRemove}
              onEdit={onEdit}
              onClone={onClone}
              onView={onView}
              index={index}
              onHideDesktop={onHideDesktop}
              onHideMobile={onHideMobile}
              hideDesktop={section.hideDesktop}
              hideMobile={section.hideMobile}
              isVisible={isVisible}
              length={sections.length}
            />
          </CardContent>
          <Divider />
          {isVisible && (
            <PreviewPagePlatform sections={[section]} disabled={true} />
          )}
        </Card>
      );
    } else if (section.type === 'swap') {
      return (
        <Card key={index}>
          <CardContent>
            <SectionHeader
              title={<FormattedMessage id="swap" defaultMessage="Swap" />}
              subtitle={section.title || ''}
              icon={<SwapHorizIcon />}
              onSwap={onSwap}
              onRemove={onRemove}
              onEdit={onEdit}
              onClone={onClone}
              onView={onView}
              index={index}
              onHideDesktop={onHideDesktop}
              onHideMobile={onHideMobile}
              hideDesktop={section.hideDesktop}
              hideMobile={section.hideMobile}
              isVisible={isVisible}
              length={sections.length}
            />
          </CardContent>
          <Divider />
          {isVisible && (
            <PreviewPagePlatform sections={[section]} disabled={true} />
          )}
        </Card>
      );
    } else if (section.type === 'custom') {
      return (
        <Card key={index}>
          <CardContent>
            <SectionHeader
              title={
                section?.title ? (
                  section.title
                ) : (
                  <FormattedMessage
                    id="custom.page.editor"
                    defaultMessage="Custom Page Editor"
                  />
                )
              }
              icon={<AutoAwesomeIcon />}
              onSwap={onSwap}
              onRemove={onRemove}
              onEdit={onEdit}
              onClone={onClone}
              onView={onView}
              index={index}
              onHideDesktop={onHideDesktop}
              onHideMobile={onHideMobile}
              hideDesktop={section.hideDesktop}
              hideMobile={section.hideMobile}
              isVisible={isVisible}
              length={sections.length}
            />
          </CardContent>
          <Divider />
          {isVisible && (
            <PreviewPagePlatform sections={[section]} disabled={true} />
          )}
        </Card>
      );
    }

    return null;
  };

  const [showPreview, setShowPreview] = useState(false);
  const [pageToClone, setPageToClone] = useState<
    { key?: string; title?: string } | undefined
  >();

  const [showDeletePageDialog, setShowDeleteDialogPage] = useState(false);

  const [showAddPage, setShowAddPage] = useState(false);

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowAddPage = () => {
    setShowAddPage(true);
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

  const defaultTheme = useTheme();

  return (
    <>
      <ThemeProvider theme={theme ? theme : defaultTheme}>
        <PreviewPageDialog
          dialogProps={{
            open: showPreview,
            maxWidth: 'xl',
            fullWidth: true,
            onClose: handleClosePreview,
          }}
          disabled={true}
          sections={sections}
          name={currentPage?.title || 'Home'}
        />
      </ThemeProvider>
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
      <AppConfirmDialog
        dialogProps={{
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
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          justifyContent="space-between"
        >
          <PagesMenu
            currentPage={currentPage}
            pages={pages}
            onClickMenu={onViewPage}
          />

          <Stack direction={'row'} alignItems="center" spacing={2}>
            {currentPage?.key !== 'home' && (
              <Button
                variant="outlined"
                onClick={handleShowPageDeleteDialog}
                color={'error'}
                size="small"
                startIcon={<DeleteIcon />}
              >
                <FormattedMessage
                  id="remove.page"
                  defaultMessage="Remove page"
                />
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={handleShowAddPage}
              size="small"
              startIcon={<AddIcon />}
            >
              <FormattedMessage id="create.page" defaultMessage="Create page" />
            </Button>
            <Button
              variant="outlined"
              onClick={handleClonePage}
              size="small"
              startIcon={<FileCopyIcon />}
            >
              <FormattedMessage id="clone.page" defaultMessage="Clone page" />
            </Button>
            <Button variant="outlined" onClick={handleShowPreview} size="small">
              <FormattedMessage id="preview" defaultMessage="Preview" />
            </Button>
          </Stack>
        </Stack>
        <Divider />
        {sections.map((section, index) =>
          renderSection(section, index, isVisibleIndexes.includes(index))
        )}
      </Stack>
    </>
  );
}
