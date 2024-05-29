import { SectionType } from '@dexkit/ui/modules/wizard/types/section';
import ComputerIcon from '@mui/icons-material/Computer';
import DeleteIcon from '@mui/icons-material/Delete';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import Edit from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MobileOffIcon from '@mui/icons-material/MobileOff';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { FormattedMessage } from 'react-intl';

import TokenIcon from '@mui/icons-material/Token';

import AppsIcon from '@mui/icons-material/Apps';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CallToAction from '@mui/icons-material/CallToAction';
import Code from '@mui/icons-material/Code';
import CollectionsIcon from '@mui/icons-material/Collections';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import GavelIcon from '@mui/icons-material/Gavel';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StoreIcon from '@mui/icons-material/Store';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VideocamIcon from '@mui/icons-material/Videocam';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import Wallet from '@mui/icons-material/Wallet';

export const SECTION_MENU_OPTIONS = ({
  hideMobile,
  isVisible,
  hideDesktop,
}: {
  hideMobile?: boolean;
  isVisible?: boolean;
  hideDesktop?: boolean;
}) => {
  return [
    {
      title: {
        id: 'hide.on.mobile',
        defaultMessage: 'Hide on mobile',
      },
      icon: hideMobile ? <MobileOffIcon /> : <SmartphoneIcon />,
      value: 'hide.mobile',
    },
    {
      title: {
        id: 'hide.on.desktop',
        defaultMessage: 'Hide on desktop',
      },
      icon: hideDesktop ? <DesktopAccessDisabledIcon /> : <ComputerIcon />,
      value: 'hide.desktop',
    },
    {
      title: {
        id: 'clone.section',
        defaultMessage: 'Clone section',
      },
      icon: <FileCopyIcon />,
      value: 'clone',
    },
    {
      title: {
        id: isVisible ? 'hide.section' : 'view.section',
        defaultMessage: isVisible ? 'Hide section' : 'View section',
      },
      icon: isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />,
      value: isVisible ? 'hide.section' : 'show.section',
    },
    {
      title: {
        id: 'edit.section',
        defaultMessage: 'Edit section',
      },
      icon: <Edit />,
      value: 'edit',
    },
    {
      title: {
        id: 'remove.section',
        defaultMessage: 'Remove section',
      },
      icon: <DeleteIcon color={'error'} />,
      value: 'remove',
    },
  ];
};

export const SECTION_CONFIG: Record<
  SectionType,
  { title: React.ReactNode; icon: React.ReactNode }
> = {
  video: {
    title: <FormattedMessage id="video" defaultMessage="Video" />,
    icon: <VideocamIcon />,
  },
  'call-to-action': {
    title: (
      <FormattedMessage id="call.to.action" defaultMessage="Call to Action" />
    ),
    icon: <CallToAction />,
  },
  featured: {
    title: <FormattedMessage id="featured" defaultMessage="Featured" />,
    icon: <BookmarkIcon />,
  },
  collections: {
    title: <FormattedMessage id="collections" defaultMessage="Collections" />,
    icon: <AppsIcon />,
  },
  swap: {
    title: <FormattedMessage id="swap" defaultMessage="Swap" />,
    icon: <SwapHorizIcon />,
  },
  'asset-store': {
    title: <FormattedMessage id="nft.store" defaultMessage="NFT store" />,
    icon: <StoreIcon />,
  },
  custom: {
    title: <FormattedMessage id="custom" defaultMessage="Custom" />,
    icon: <AutoAwesomeIcon />,
  },
  markdown: {
    title: <FormattedMessage id="markdown" defaultMessage="Markdown" />,
    icon: <FormatColorTextIcon />,
  },
  wallet: {
    title: <FormattedMessage id="wallet" defaultMessage="Wallet" />,
    icon: <Wallet />,
  },
  contract: {
    title: <FormattedMessage id="contract" defaultMessage="Contract" />,
    icon: <GavelIcon />,
  },
  'user-contract-form': {
    title: (
      <FormattedMessage
        id="user.contract.form"
        defaultMessage="User contract form"
      />
    ),
    icon: <GavelIcon />,
  },
  exchange: {
    title: <FormattedMessage id="exchange" defaultMessage="Exchange" />,
    icon: <ShowChartIcon />,
  },
  'code-page-section': {
    title: <FormattedMessage id="code" defaultMessage="Code" />,
    icon: <Code />,
  },
  collection: {
    title: <FormattedMessage id="collection" defaultMessage="Collection" />,
    icon: <AppsIcon />,
  },
  'dex-generator-section': {
    title: (
      <FormattedMessage id="dex.generator" defaultMessage="Dex Generator" />
    ),
    icon: <GavelIcon />,
  },
  'asset-section': {
    title: <FormattedMessage id="asset" defaultMessage="Asset" />,
    icon: <AppsIcon />,
  },
  ranking: {
    title: <FormattedMessage id="leaderboard" defaultMessage="Leaderboard" />,
    icon: <LeaderboardIcon />,
  },
  'token-trade': {
    title: <FormattedMessage id="token.trade" defaultMessage="Token Trade" />,
    icon: <TokenIcon />,
  },
  carousel: {
    title: <FormattedMessage id="carousel" defaultMessage="Carousel" />,
    icon: <ViewCarouselIcon />,
  },
  showcase: {
    title: <FormattedMessage id="showcase" defaultMessage="Showcase Gallery" />,
    icon: <CollectionsIcon />,
  },
  'edition-drop-section': {
    title: undefined,
    icon: undefined,
  },
  'edition-drop-list-section': {
    title: undefined,
    icon: undefined,
  },
  'token-drop': {
    title: undefined,
    icon: undefined,
  },
  'nft-drop': {
    title: undefined,
    icon: undefined,
  },
  'token-stake': {
    title: undefined,
    icon: undefined,
  },
  'nft-stake': {
    title: undefined,
    icon: undefined,
  },
  'edition-stake': {
    title: undefined,
    icon: undefined,
  },
  token: {
    title: undefined,
    icon: undefined,
  },
  'airdrop-token': {
    title: undefined,
    icon: undefined,
  },
  'market-trade': {
    title: undefined,
    icon: undefined,
  },
  'claim-airdrop-token-erc-20': {
    title: undefined,
    icon: undefined,
  },
  plugin: {
    title: undefined,
    icon: undefined,
  },
};
