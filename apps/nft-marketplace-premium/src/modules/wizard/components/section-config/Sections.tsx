import CallToActionIcon from '@mui/icons-material/CallToAction';
import CollectionsIcon from '@mui/icons-material/Collections';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import GavelIcon from '@mui/icons-material/Gavel';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import VideocamIcon from '@mui/icons-material/Videocam';
import WalletIcon from '@mui/icons-material/Wallet';
import { SectionMetadata } from '../../types/section';
export const sections = [
  {
    type: 'video',
    titleId: 'video',
    titleDefaultMessage: 'Video',
    category: 'resources',
    description: 'Display an youtube video',
    icon: <VideocamIcon fontSize="large" />,
  },
  {
    type: 'call-to-action',
    titleId: 'call.to.action',
    titleDefaultMessage: 'Call to action',
    category: 'resources',
    description: 'Call to Action',
    icon: <CallToActionIcon fontSize="large" />,
  },
  {
    type: 'featured',
    titleId: 'featured',
    titleDefaultMessage: 'Featured',
    category: 'resources',
    description: 'Feature your nfts',
    icon: <FeaturedVideoIcon fontSize="large" />,
  },
  {
    type: 'swap',
    titleId: 'swap',
    titleDefaultMessage: 'Swap',
    category: 'cryptocurrency',
    description: 'Swap using 0x',
    icon: <SwapHorizIcon fontSize="large" />,
  },
  {
    type: 'exchange',
    titleId: 'exchange',
    titleDefaultMessage: 'Exchange',
    category: 'cryptocurrency',
    description: 'Limit order using 0x',
    icon: <SwapHorizontalCircleIcon fontSize="large" />,
  },
  {
    type: 'asset-store',
    titleId: 'nft.store',
    titleDefaultMessage: 'NFT store',
    category: 'nft',
    description: 'NFT store like Shopify',
    icon: <StorefrontIcon fontSize="large" />,
  },
  {
    type: 'collections',
    titleId: 'collections',
    titleDefaultMessage: 'Collections',
    category: 'nft',
    description: 'Feature your collections',
    icon: <CollectionsIcon fontSize="large" />,
  },
  {
    type: 'wallet',
    titleId: 'wallet',
    titleDefaultMessage: 'Wallet',
    category: 'cryptocurrency',
    description: 'Wallet',
    icon: <WalletIcon fontSize="large" />,
  },
  {
    type: 'contract',
    titleId: 'contract',
    titleDefaultMessage: 'Contract',
    category: 'web3',
    description: 'Add forms to your contracts deployed on blockchain',
    icon: <GavelIcon fontSize="large" />,
  },
  {
    type: 'user-contract-form',
    titleId: 'user.contract.form',
    titleDefaultMessage: 'User contract form',
    category: 'web3',
    description: 'Add forms created by you',
    icon: <DynamicFormIcon fontSize="large" />,
  },
  {
    type: 'markdown',
    titleId: 'markdown',
    titleDefaultMessage: 'Markdown',
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
    value: 'web3',
    title: 'Web3',
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
