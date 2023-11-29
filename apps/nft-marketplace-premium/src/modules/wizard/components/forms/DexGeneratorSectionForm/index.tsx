import { useListDeployedContracts } from '@/modules/forms/hooks';
import LazyTextField from '@dexkit/ui/components/LazyTextField';

import { DeployedContract } from '@/modules/forms/types';
import Error from '@mui/icons-material/Error';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getChainSlug } from 'src/utils/blockchain';
import {
  DEX_GENERATOR_CONTRACT_TYPES,
  DEX_GENERATOR_CONTRACT_TYPES_AVAIL,
} from '../../../constants';
import { DexGeneratorPageSection } from '../../../types/section';
import DexGeneratorSectionCard from '../../DexGeneratorSectionCard';
import DexGeneratorContractForm from './DexGeneratorContractForm';

export interface DexGeneratorSectionFormProps {
  onSave: (section: DexGeneratorPageSection) => void;
  onChange: (section: DexGeneratorPageSection) => void;
  onCancel: () => void;
  section?: DexGeneratorPageSection;
  showSaveButton?: boolean;
}

export default function DexGeneratorSectionForm({
  onSave,
  onChange,
  onCancel,
  section,
  showSaveButton,
}: DexGeneratorSectionFormProps) {
  const { account } = useWeb3React();

  const [type, setType] = useState<string>('');
  const [contract, setContract] = useState<DeployedContract | undefined>(
    section?.contract,
  );

  const [query, setQuery] = useState<string>();

  const filter = useMemo(() => {
    let f: any = {
      owner: account?.toLowerCase(),
      type: { in: DEX_GENERATOR_CONTRACT_TYPES_AVAIL },
    };

    if (query) {
      f.q = query;
    }

    if (type && type !== '' && type !== undefined) {
      f.type = type;
    }

    return f;
  }, [query, account, type]);

  const [page, setPage] = useState(0);

  const listContractsQuery = useListDeployedContracts({
    filter,
    page,
    pageSize: 10,
  });

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const [currSection, setCurrSection] = useState<
    DexGeneratorPageSection | undefined
  >(section);

  useEffect(() => {
    setCurrSection(section);
  }, [section]);

  const handleChangeSection = useCallback(
    (section: DexGeneratorPageSection) => {
      setCurrSection(section);
      onChange(section);
    },
    [contract, onChange],
  );

  const handleClick = useCallback(
    (newContract: DeployedContract) => {
      if (newContract.id === contract?.id) {
        return setContract(undefined);
      }

      setContract(newContract);

      let network = getChainSlug(newContract?.chainId);

      if (network) {
        if (newContract.type === 'DropERC20') {
          handleChangeSection({
            section: {
              type: 'token-drop',
              settings: {
                address: newContract.contractAddress,
                network,
                variant: 'simple',
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'DropERC721') {
          handleChangeSection({
            section: {
              type: 'nft-drop',
              settings: {
                address: newContract.contractAddress,
                network,
                variant: 'simple',
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'DropERC1155') {
          handleChangeSection({
            section: {
              type: 'edition-drop-section',
              config: {
                address: newContract.contractAddress,
                tokenId: '',
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'StakeERC721') {
          handleChangeSection({
            section: {
              type: 'nft-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'StakeERC1155') {
          handleChangeSection({
            section: {
              type: 'edition-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'StakeERC20') {
          handleChangeSection({
            section: {
              type: 'token-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'AirdropERC20') {
          handleChangeSection({
            section: {
              type: 'airdrop-token',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        }
      }
    },
    [contract, handleChangeSection],
  );

  const handleSave = useCallback(() => {
    if (currSection) {
      onSave(currSection);
    }
  }, [onSave, currSection]);

  const handleChangeType = (e: SelectChangeEvent) => {
    setType(e.target.value);
    setContract(undefined);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs>
              <LazyTextField
                TextFieldProps={{
                  size: 'small',
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel htmlFor="contractType" shrink>
                  <FormattedMessage
                    id="contract.type"
                    defaultMessage="Contract Type"
                  />
                </InputLabel>
                <Select
                  id="contractType"
                  displayEmpty
                  size="small"
                  label={
                    <FormattedMessage
                      id="contract.type"
                      defaultMessage="Contract Type"
                    />
                  }
                  fullWidth
                  value={type}
                  onChange={handleChangeType}
                >
                  <MenuItem value="">
                    <FormattedMessage id="all" defaultMessage="All" />
                  </MenuItem>
                  {DEX_GENERATOR_CONTRACT_TYPES.map((type) => (
                    <MenuItem value={type.type} key={type.type}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {!contract && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ overflowY: 'scroll', maxHeight: '20rem' }}>
                  <Grid container spacing={2}>
                    {listContractsQuery.data?.data.length === 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ py: 2 }}>
                          <Stack alignItems="center">
                            <Error fontSize="large" />
                            <Typography align="center" variant="h5">
                              <FormattedMessage
                                id="no.contracts.found"
                                defaultMessage="No contracts found"
                              />
                            </Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    )}
                    {listContractsQuery.data?.data?.map((c) => (
                      <Grid key={c.id} item xs={12}>
                        <DexGeneratorSectionCard
                          id={c.id}
                          type={c.type}
                          name={c.name}
                          onClick={() => handleClick(c)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
              {listContractsQuery.isLoading &&
                new Array(5).fill(null).map((_, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5">
                          <Skeleton />
                        </Typography>
                        <Typography variant="body1">
                          <Skeleton />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        )}
        {contract && (
          <Grid item xs={12}>
            <DexGeneratorContractForm
              onChange={handleChangeSection}
              onCancel={() => {
                setContract(undefined);
                if (currSection) {
                  handleChangeSection({
                    ...currSection,
                    section: undefined,
                    contract: undefined,
                  });
                }
              }}
              params={{
                address: contract.contractAddress,
                contractType: contract.type || '',
                network: getChainSlug(contract.chainId) || '',
                name: contract.name,
              }}
              section={section?.section}
              contract={contract}
            />
          </Grid>
        )}
        {showSaveButton && (
          <Grid item xs={12}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  disabled={!contract}
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
