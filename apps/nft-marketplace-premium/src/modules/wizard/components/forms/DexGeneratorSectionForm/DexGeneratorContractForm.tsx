import { DeployedContract } from '@/modules/forms/types';
import {
  DexGeneratorPageSection,
  DexGeneratorPageSectionType,
} from '@/modules/wizard/types/section';
import ArrowBack from '@mui/icons-material/ArrowBack';
import {
  Box,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import Link from 'src/components/Link';
import DexGeneratorEditionDropForm from './DexGeneratorEditionDropForm';
import DexGeneratorNFTDropForm from './DexGeneratorNFTDropForm';
import DexGeneratorTokenDropForm from './DexGeneratorTokenDropForm';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export interface DexGeneratorContractFormProps {
  onChange: (section: DexGeneratorPageSection) => void;
  onCancel: () => void;
  params: {
    network: string;
    address: string;
    contractType: string;
    name: string;
  };
  section?: DexGeneratorPageSectionType;
  contract: DeployedContract;
}

export default function DexGeneratorContractForm({
  onChange,
  onCancel,
  params,
  section,
  contract,
}: DexGeneratorContractFormProps) {
  const { network, address, contractType, name } = params;

  const handleChange = (section: DexGeneratorPageSectionType) => {
    onChange({ type: 'dex-generator-section', contract, section });
  };

  const renderForm = () => {
    if (contractType === 'DropERC20') {
      return (
        <DexGeneratorTokenDropForm
          key={`${network}-${address}-${contractType}-${name}`}
          onChange={handleChange}
          params={{ network, address }}
          section={section?.type === 'token-drop' ? section : undefined}
        />
      );
    } else if (contractType === 'DropERC721') {
      return (
        <DexGeneratorNFTDropForm
          key={`${network}-${address}-${contractType}-${name}`}
          onChange={handleChange}
          params={{ network, address }}
          section={section?.type === 'nft-drop' ? section : undefined}
        />
      );
    } else if (contractType === 'DropERC1155') {
      return (
        <DexGeneratorEditionDropForm
          key={`${network}-${address}-${contractType}-${name}`}
          onChange={handleChange}
          params={{ network, address }}
          section={
            section?.type === 'edition-drop-section' ? section : undefined
          }
        />
      );
    } else {
      return (
        <Stack>
          <Typography align="center" variant="h5">
            <FormattedMessage
              id="contract.not.supported"
              defaultMessage="Contract not supported"
            />
          </Typography>
          <Typography align="center" variant="body1" color="text.secondary">
            <FormattedMessage
              id="contract.is.not.supported.yet"
              defaultMessage="Contract not supported yet"
            />
          </Typography>
        </Stack>
      );
    }
  };

  return (
    <Card>
      <Stack sx={{ p: 2 }} spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={1} direction="row" alignItems="center">
            <IconButton size="small" onClick={onCancel}>
              <ArrowBack />
            </IconButton>
            <Typography variant="subtitle1" fontWeight="bold">
              <FormattedMessage
                id="edit.name"
                defaultMessage='Edit "{name}"'
                values={{ name }}
              />
            </Typography>
          </Stack>

          <Stack alignItems="center" direction="row">
            <Link target="_blank" href={`/contract/${network}/${address}`}>
              <FormattedMessage id="admin" defaultMessage="Admin" />{' '}
            </Link>
            <OpenInNewIcon fontSize="inherit" color="primary" />
          </Stack>
        </Stack>
        <Divider />
        <Box>{renderForm()}</Box>
      </Stack>
    </Card>
  );
}
