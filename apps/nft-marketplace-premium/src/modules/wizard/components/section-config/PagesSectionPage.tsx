import AppsIcon from '@mui/icons-material/Apps';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CallToAction from '@mui/icons-material/CallToAction';
import CollectionsIcon from '@mui/icons-material/Collections';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import VideocamIcon from '@mui/icons-material/Videocam';
import VisibilityIcon from '@mui/icons-material/Visibility';

import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';

import TokenIcon from '@mui/icons-material/Token';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  AppPageOptions,
} from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import Code from '@mui/icons-material/Code';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import GavelIcon from '@mui/icons-material/Gavel';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LinkIcon from '@mui/icons-material/Link';
import ShieldIcon from '@mui/icons-material/Shield';
import StoreIcon from '@mui/icons-material/Store';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Wallet from '@mui/icons-material/Wallet';
import { useState } from 'react';
import PagesMenu from '../PagesMenu';
import PreviewPagePlatform from '../PreviewPagePlatform';
import AddPageDialog from '../dialogs/AddPageDialog';
import GatedConditionsFormDialog from '../dialogs/GatedConditionsFormDialog';
import PreviewPageDialog from '../dialogs/PreviewPageDialog';
import { SectionHeader } from '../sections/SectionHeader';
import Pages from './Pages';

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
  previewUrl?: string;
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
  previewUrl,
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
    } else if (section.type === 'exchange') {
      title = <FormattedMessage id="exchange" defaultMessage="Exchange" />;
      subtitle = section.title || '';
      icon = <ShowChartIcon />;
    } else if (section.type === 'code-page-section') {
      title = <FormattedMessage id="code" defaultMessage="Code" />;
      subtitle = section.title || '';
      icon = <Code />;
    } else if (section.type === 'collection') {
      title = <FormattedMessage id="collection" defaultMessage="Collection" />;
      subtitle = section.title || '';
      icon = <AppsIcon />;
    } else if (section.type === 'dex-generator-section') {
      title = (
        <FormattedMessage id="dex.generator" defaultMessage="Dex Generator" />
      );
      subtitle = section.title || '';
      icon = <GavelIcon />;
    } else if (section.type === 'asset-section') {
      title = <FormattedMessage id="asset" defaultMessage="Asset" />;
      subtitle = section.title || '';
      icon = <AppsIcon />;
    } else if (section.type === 'ranking') {
      title = (
        <FormattedMessage id="leaderboard" defaultMessage="Leaderboard" />
      );
      subtitle = section.title || '';
      icon = <LeaderboardIcon />;
    } else if (section.type === 'token-trade') {
      title = (
        <FormattedMessage id="token.trade" defaultMessage="Token Trade" />
      );
      subtitle = section.title || '';
      icon = <TokenIcon />;
    } else if (section.type === 'carousel') {
      title = <FormattedMessage id="carousel" defaultMessage="Carousel" />;
      subtitle = section.title || '';
      icon = <ViewCarouselIcon />;
    } else if (section.type === 'showcase') {
      title = (
        <FormattedMessage id="showcase" defaultMessage="Showcase Gallery" />
      );
      subtitle = section.title || '';
      icon = <CollectionsIcon />;
    }

    if (!title) {
      return null;
    }

    return (
      <Card key={index} sx={{ bgcolor: 'background.default' }}>
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

  const onEditGatedContidions = (
    gatedConditions: GatedCondition[],
    gatedLayout: GatedPageLayout
  ) => {
    onEditPage({
      isEditGatedConditions: true,
      gatedPageLayout: gatedLayout,
      gatedConditions: gatedConditions,
      title: currentPage?.title,
      key: currentPage?.key,
    });
  };

  const [showSections, setShowSections] = useState(false);

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
        gatedPageLayout={currentPage?.gatedPageLayout}
        onCancel={handleCloseGatedModalForm}
        onSubmit={onEditGatedContidions}
      />
      <AppConfirmDialog
        DialogProps={{
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
        <Box>
          <Pages pages={pages} />
        </Box>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={6}
            >
              <PagesMenu
                currentPage={currentPage}
                pages={pages}
                onClickMenu={onViewPage}
              />

              <Stack direction={'row'} alignItems="center" spacing={2}>
                <Button
                  onClick={handleShowPreview}
                  size="small"
                  startIcon={<VisibilityIcon />}
                >
                  <FormattedMessage id="preview" defaultMessage="Preview" />
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleClonePage}
                  size="small"
                  startIcon={<FileCopyIcon />}
                >
                  <FormattedMessage
                    id="clone.page"
                    defaultMessage="Clone page"
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
                {currentPage?.uri && previewUrl && (
                  <Button
                    href={`${previewUrl}${currentPage?.uri}`}
                    target={'_blank'}
                    startIcon={<LinkIcon />}
                  >
                    <FormattedMessage id="open.url" defaultMessage="Open url" />
                  </Button>
                )}

                {currentPage?.key !== 'home' && (
                  <IconButton
                    aria-label="delete"
                    color={'error'}
                    onClick={handleShowPageDeleteDialog}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Divider />

        {showSections &&
          sections.map((section, index) =>
            renderSection(section, index, isVisibleIndexes.includes(index))
          )}
      </Stack>
    </>
  );
}
