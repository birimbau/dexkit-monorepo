import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import AppsIcon from '@mui/icons-material/Apps';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CallToAction from '@mui/icons-material/CallToAction';
import CollectionsIcon from '@mui/icons-material/Collections';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import VideocamIcon from '@mui/icons-material/Videocam';

import {
  AppPageSection,
  SectionType,
} from '@dexkit/ui/modules/wizard/types/section';
import Code from '@mui/icons-material/Code';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import GavelIcon from '@mui/icons-material/Gavel';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import StoreIcon from '@mui/icons-material/Store';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Wallet from '@mui/icons-material/Wallet';
import { FormattedMessage } from 'react-intl';

import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

import { DndContext } from '@dnd-kit/core';
import ArrowBack from '@mui/icons-material/ArrowBack';
import TokenIcon from '@mui/icons-material/Token';
import React, { ReactNode } from 'react';
import PageSection from './PageSection';

type Callback = (section: AppPageSection) => ReactNode;

const sectionConfig: Record<
  SectionType,
  { title: React.ReactNode | Callback; icon: React.ReactNode }
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
    title: (section: AppPageSection) =>
      section?.title ? (
        section.title
      ) : (
        <FormattedMessage
          id="custom.page.editor"
          defaultMessage="Custom Page Editor"
        />
      ),
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

function getSectionType(section: AppPageSection) {
  const config = sectionConfig[section.type];
  if (config) {
    return {
      title:
        typeof config.title === 'function'
          ? config.title(section)
          : config.title,
      subtitle: section.title || '',
      icon: config.icon,
    };
  }
  return null;
}

export interface PageSectionsProps {
  page: AppPage;
}

export default function PageSections({ page }: PageSectionsProps) {
  return (
    <Box>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="edit.page" defaultMessage="Edit page" />
            </Typography>
            <Typography variant="h5">{page.title}</Typography>
          </Box>
        </Stack>
        <Divider />
        <Box>
          <DndContext>
            <Grid container spacing={2}>
              {page.sections.map((section, index) => (
                <Grid item xs={12} key={index}>
                  <PageSection
                    icon={getSectionType(section)?.icon}
                    title={getSectionType(section)?.title}
                    subtitle={getSectionType(section)?.subtitle}
                    id={index.toString()}
                  />
                </Grid>
              ))}
            </Grid>
          </DndContext>
        </Box>
      </Stack>
    </Box>
  );
}
