import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import { GamificationPoint } from '@/modules/wizard/types';
import { NetworkSelectDropdown } from '@dexkit/ui/components/NetworkSelectDropdown';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { CollectionItemAutocomplete } from '../../CollectionItemAutocomplete';
import { Conditions } from '../constants/conditions';

interface DropCollectionFilter {
  chainId?: number;
  collectionAddress?: string;
  tokenId?: string;
  conditionNFT?: string;
  amountNFT?: number;
}

const DropCollectionFilterSchema: Yup.SchemaOf<DropCollectionFilter> =
  Yup.object().shape({
    chainId: Yup.number(),

    amountNFT: Yup.number(),
    conditionNFT: Yup.string(),
    tokenId: Yup.string(),

    collectionAddress: Yup.string(),
  });

interface Props {
  onCancel?: () => void;
  onSubmit?: (item: DropCollectionFilter) => void;
  onChange?: (item: DropCollectionFilter, isValid: boolean) => void;
  item?: DropCollectionFilter;
  isERC1155?: boolean;
  index?: number;
}

function a11yProps(index: number) {
  return {
    id: `collection-tab-${index}`,
    'aria-controls': `collection-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  if (value === index) {
    return <>{children || null} </>;
  } else {
    return null;
  }
}

export default function DropCollectionFilterForm({
  item,
  index,
  onCancel,
  onSubmit,
  onChange,
  isERC1155,
}: Props) {
  const { setFieldValue, values } = useFormikContext<{
    from: string | undefined;
    to: string | undefined;
    settings: GamificationPoint[];
  }>();

  const filter = useMemo(() => {
    if (index && values.settings[index].filter) {
      return JSON.parse(values.settings[index].filter) as {
        chainId: number;
        collectionAddress: string;
        conditionNFT: string;
      };
    }
  }, [index]);

  const setValue = useCallback(
    (field: string, value: any) => {
      setFieldValue(
        'settings.filter',
        JSON.stringify({ ...filter, [field]: value }),
      );
    },
    [filter],
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NetworkSelectDropdown
          label={
            <FormattedMessage
              id="choose.network"
              defaultMessage="Choose network"
            />
          }
          chainId={index !== undefined ? filter?.chainId : undefined}
          onChange={(chainId) => {
            setFieldValue('chainId', chainId);
            setFieldValue('tokenAddress', undefined);
            setFieldValue('collectionAddress', undefined);
          }}
          labelId="Choose network"
          enableTestnet={true}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>
                <FormattedMessage
                  id="choose.an.option"
                  defaultMessage="Choose an option"
                />
              </InputLabel>
              <Select
                fullWidth
                value={value}
                onChange={handleChange}
                aria-label="collection tabs"
                label={
                  <FormattedMessage
                    id="choose.an.option"
                    defaultMessage="Choose an option"
                  />
                }
              >
                <MenuItem value={0}>
                  <FormattedMessage id="import" defaultMessage="Import" />
                </MenuItem>
                <MenuItem value={1}>
                  <FormattedMessage
                    id="my.collections"
                    defaultMessage="My Collections"
                  />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={9}>
            <TabPanel value={value} index={1}>
              <CollectionItemAutocomplete
                onChange={(coll) => {
                  setFieldValue('collectionAddress', coll?.contractAddress);
                }}
                filterByChainId={true}
                chainId={filter?.chainId}
                disabled={filter?.chainId === undefined}
                formValue={{
                  contractAddress: filter?.collectionAddress,
                  chainId: filter?.chainId,
                }}
              />
            </TabPanel>
            <TabPanel value={value} index={0}>
              <Field
                component={TextField}
                label={
                  <FormattedMessage
                    id="collection.address"
                    defaultMessage="Collection address"
                  />
                }
                fullWidth
                name="collectionAddress"
                required
              />
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
      {isERC1155 === true && (
        <>
          <Grid item xs={12} sm={4}>
            <Field
              component={TextField}
              type="text"
              fullWidth
              label={
                <FormattedMessage id={'tokenId'} defaultMessage={'Token Id'} />
              }
              InputProps={{ min: 0 }}
              name="tokenId"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="condition-amount-nft-select-label">
                <FormattedMessage
                  id="condition.amount.nft"
                  defaultMessage="Condition amount NFT"
                />
              </InputLabel>
              <Select
                labelId="condition-amount-nft-select-label"
                id="demo-simple-select"
                value={filter?.conditionNFT}
                label={
                  <FormattedMessage
                    id="condition.amount.nft"
                    defaultMessage="Condition amount NFT"
                  />
                }
                onChange={(ev) =>
                  setFieldValue('conditionNFT', ev.target.value)
                }
              >
                {Conditions.map((v, i) => (
                  <MenuItem value={v.symbol} key={i}>
                    {v.symbol} {v.sign}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Field
              component={TextField}
              type="number"
              fullWidth
              label={
                <FormattedMessage
                  id={'Amount.nft'}
                  defaultMessage={'Amount NFT'}
                />
              }
              InputProps={{ min: 0 }}
              name="amount"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
