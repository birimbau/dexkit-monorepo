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
  Typography,
} from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';

import { AppPage, AppPageOptions } from '../../../../types/config';

import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import GavelIcon from '@mui/icons-material/Gavel';
import ShieldIcon from '@mui/icons-material/Shield';
import StoreIcon from '@mui/icons-material/Store';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Wallet from '@mui/icons-material/Wallet';
import { useState } from 'react';
import AppConfirmDialog from '../../../../components/AppConfirmDialog';
import { GatedCondition } from '../../types';
import { AppPageSection } from '../../types/section';
import PagesMenu from '../PagesMenu';
import PreviewPagePlatform from '../PreviewPagePlatform';
import AddPageDialog from '../dialogs/AddPageDialog';
import GatedConditionsFormDialog from '../dialogs/GatedConditionsFormDialog';
import PreviewPageDialog from '../dialogs/PreviewPageDialog';
import { SectionHeader } from '../sections/SectionHeader';
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
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
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
    let title;
    let subtitle;
    let icon;
    if (section.type === 'video') {
      title = <FormattedMessage id="video" defaultMessage="Video" />;
      subtitle = section.title;
      icon = <VideocamIcon />;
    } else if (section.type === 'call-to-action') {
      title = (
        <FormattedMessage id="call.to.action" defaultMessage="Call to Action" />
      );
      subtitle = section.title;
      icon = <CallToAction />;
    } else if (section.type === 'featured') {
      title = <FormattedMessage id="featured" defaultMessage="Featured" />;
      subtitle = section.title;
      icon = <BookmarkIcon />;
    } else if (section.type === 'collections') {
      title = (
        <FormattedMessage id="collections" defaultMessage="Collections" />
      );
      subtitle = section.title || '';
      icon = <AppsIcon />;
    } else if (section.type === 'swap') {
      title = <FormattedMessage id="swap" defaultMessage="Swap" />;
      subtitle = section.title || '';
      icon = <SwapHorizIcon />;
    } else if (section.type === 'asset-store') {
      title = <FormattedMessage id="nft.store" defaultMessage="NFT store" />;
      subtitle = section.title || '';
      icon = <StoreIcon />;
    } else if (section.type === 'custom') {
      title = section?.title ? (
        section.title
      ) : (
        <FormattedMessage
          id="custom.page.editor"
          defaultMessage="Custom Page Editor"
        />
      );
      subtitle = section.title || '';
      icon = <AutoAwesomeIcon />;
    } else if (section.type === 'markdown') {
      title = <FormattedMessage id="markdown" defaultMessage="Markdown" />;
      subtitle = section.title || '';
      icon = <FormatColorTextIcon />;
    } else if (section.type === 'wallet') {
      title = <FormattedMessage id="wallet" defaultMessage="Wallet" />;
      subtitle = section.title || '';
      icon = <Wallet />;
    } else if (section.type === 'contract') {
      title = <FormattedMessage id="contract" defaultMessage="Contract" />;
      subtitle = section.title || '';
      icon = <GavelIcon />;
    } else if (section.type === 'user-contract-form') {
      title = (
        <FormattedMessage
          id="user.contract.form"
          defaultMessage="User contract form"
        />
      );
      subtitle = section.title || '';
      icon = <GavelIcon />;
    }
    if (!title) {
      return null;
    }

    return (
      <Card key={index}>
        <CardContent>
          <SectionHeader
            title={title}
            subtitle={subtitle}
            icon={icon}
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
  };

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

  const handleShowAddPage = () => {
    setShowAddPage(true);
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

  const onEditGatedContidions = (gatedConditions: GatedCondition[]) => {
    console.log(gatedConditions);
    onEditPage({
      isEditGatedConditions: true,
      gatedConditions: gatedConditions,
      title: currentPage?.title,
      key: currentPage?.key,
    });
  };

  console.log(currentPage);

  return (
    <>
      <CssVarsProvider theme={theme}>
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
      </CssVarsProvider>
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
        onCancel={handleCloseGatedModalForm}
        onSubmit={onEditGatedContidions}
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
              <FormattedMessage
                id="create.new.page"
                defaultMessage="Create new page"
              />
            </Button>
            {currentPage?.key !== 'home' && (
              <Button
                variant="outlined"
                onClick={handleShowGatedModalForm}
                size="small"
                startIcon={<ShieldIcon />}
              >
                <FormattedMessage
                  id="gated.conditions"
                  defaultMessage="Gated conditions"
                />
              </Button>
            )}
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
