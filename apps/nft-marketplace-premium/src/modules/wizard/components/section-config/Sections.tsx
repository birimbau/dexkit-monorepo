import CallToActionIcon from '@mui/icons-material/CallToAction';
import CodeIcon from '@mui/icons-material/Code';
import CollectionsIcon from '@mui/icons-material/Collections';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import GavelIcon from '@mui/icons-material/Gavel';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
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
    description: 'Display engaging videos to captivate your audience.',
    icon: <VideocamIcon fontSize="large" />,
  },
  {
    type: 'call-to-action',
    titleId: 'call.to.action',
    titleDefaultMessage: 'Call to action',
    category: 'resources',
    description:
      'Encourage specific user actions with effective calls to action.',
    icon: <CallToActionIcon fontSize="large" />,
  },
  {
    type: 'featured',
    titleId: 'featured',
    titleDefaultMessage: 'Featured NFTs',
    category: 'nft',
    description:
      'Highlight and promote your NFTs for enhanced visibility and user engagement.',
    icon: <FeaturedVideoIcon fontSize="large" />,
  },
  {
    type: 'swap',
    titleId: 'swap',
    titleDefaultMessage: 'Swap',
    category: 'cryptocurrency',
    description:
      'Build a cryptocurrency swap tool using the powerful 0x protocol.',
    icon: <SwapHorizIcon fontSize="large" />,
  },
  {
    type: 'exchange',
    titleId: 'exchange',
    titleDefaultMessage: 'Exchange',
    category: 'cryptocurrency',
    description: 'Limit order using 0x',
    icon: <ShowChartIcon fontSize="large" />,
  },
  {
    type: 'asset-store',
    titleId: 'nft.store',
    titleDefaultMessage: 'NFT store',
    category: 'nft',
    description: 'Create a Shopify-style NFT store for your unique collection.',
    icon: <StorefrontIcon fontSize="large" />,
  },
  {
    type: 'collections',
    titleId: 'collections',
    titleDefaultMessage: 'Collections',
    category: 'nft',
    description: 'Add new NFT collections to diversify your digital assets.',
    icon: <CollectionsIcon fontSize="large" />,
  },
  {
    type: 'wallet',
    titleId: 'wallet',
    titleDefaultMessage: 'Wallet',
    category: 'cryptocurrency',
    description:
      'Create a digital wallet to securely store and manage your cryptocurrencies.',
    icon: <WalletIcon fontSize="large" />,
  },
  {
    type: 'contract',
    titleId: 'contract',
    titleDefaultMessage: 'Contract form',
    category: 'web3',
    description:
      'Interact with blockchain contracts by importing them and using interactive forms.',
    icon: <GavelIcon fontSize="large" />,
  },
  {
    type: 'user-contract-form',
    titleId: 'user.contract.form',
    titleDefaultMessage: 'User contract form',
    category: 'web3',
    description:
      'Customize forms for your interactions with blockchain contracts.',
    icon: <DynamicFormIcon fontSize="large" />,
  },
  {
    type: 'markdown',
    titleId: 'markdown',
    titleDefaultMessage: 'Markdown',
    category: 'low-code',
    description:
      'Easily format text using markdown for a clean and structured appearance.',
    icon: <TextSnippetIcon fontSize="large" />,
  },
  {
    type: 'code-page-section',
    titleId: 'code',
    titleDefaultMessage: 'Code',
    category: 'low-code',
    description:
      'Easily format text using markdown for a clean and structured appearance.',
    icon: <CodeIcon fontSize="large" />,
  },
  {
    type: 'collection',
    titleId: 'Collection',
    titleDefaultMessage: 'Collection',
    category: 'nft',
    description: 'Easily add a collection',
    icon: <CollectionsIcon fontSize="large" />,
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
