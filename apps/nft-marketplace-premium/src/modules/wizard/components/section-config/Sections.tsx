import CallToActionIcon from '@mui/icons-material/CallToAction';
import CollectionsIcon from '@mui/icons-material/Collections';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import GavelIcon from '@mui/icons-material/Gavel';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import VideocamIcon from '@mui/icons-material/Videocam';
import WalletIcon from '@mui/icons-material/Wallet';
import { FormattedMessage } from 'react-intl';
import { SectionMetadata } from '../../types/section';
export const sections = [
  {
    type: 'video',
    title: <FormattedMessage id={'video'} defaultMessage={'Video'} />,
    category: 'resources',
    description: 'Display an youtube video',
    icon: <VideocamIcon fontSize="large" />,
  },
  {
    type: 'call-to-action',
    title: (
      <FormattedMessage
        id={'call.to.action'}
        defaultMessage={'Call to action'}
      />
    ),
    category: 'resources',
    description: 'Call to Action',
    icon: <CallToActionIcon fontSize="large" />,
  },
  {
    type: 'featured',
    title: <FormattedMessage id={'featured'} defaultMessage={'Featured'} />,
    category: 'resources',
    description: 'Feature your nfts',
    icon: <FeaturedVideoIcon fontSize="large" />,
  },
  {
    type: 'swap',
    title: <FormattedMessage id={'swap'} defaultMessage={'Swap'} />,
    category: 'cryptocurrency',
    description: 'Swap using 0x',
    icon: <SwapHorizIcon fontSize="large" />,
  },
  {
    type: 'asset-store',
    title: <FormattedMessage id={'nft.store'} defaultMessage={'NFT store'} />,
    category: 'nft',
    description: 'NFT store like Shopify',
    icon: <StorefrontIcon fontSize="large" />,
  },
  {
    type: 'collections',
    title: (
      <FormattedMessage id={'collections'} defaultMessage={'Collections'} />
    ),
    category: 'nft',
    description: 'NFT store like Shopify',
    icon: <CollectionsIcon fontSize="large" />,
  },
  {
    type: 'wallet',
    title: <FormattedMessage id={'wallet'} defaultMessage={'Wallet'} />,
    category: 'cryptocurrency',
    description: 'Wallet',
    icon: <WalletIcon fontSize="large" />,
  },
  {
    type: 'contract',
    title: <FormattedMessage id={'contract'} defaultMessage={'Contract'} />,
    category: 'cryptocurrency',
    description: 'Add forms to your contracts deployed on blockchain',
    icon: <GavelIcon fontSize="large" />,
  },
  {
    type: 'user-contract-form',
    title: (
      <FormattedMessage
        id={'user.contract.form'}
        defaultMessage={'User contract form'}
      />
    ),
    category: 'cryptocurrency',
    description: 'Add forms created by you',
    icon: <DynamicFormIcon fontSize="large" />,
  },
  {
    type: 'markdown',
    title: <FormattedMessage id={'Markdown'} defaultMessage={'Markdown'} />,
    category: 'low-code',
    description: 'Add markdown text',
    icon: <TextSnippetIcon fontSize="large" />,
  },
] as SectionMetadata[];

export const SectionCategory = [
  {
    value: 'cryptocurrency',
    title: 'Cryptocurrency',
  },
  {
    value: 'nft',
    title: 'NFT',
  },
  {
    value: 'resources',
    title: 'Resources',
  },
  {
    value: 'low-code',
    title: 'Low code',
  },
];
