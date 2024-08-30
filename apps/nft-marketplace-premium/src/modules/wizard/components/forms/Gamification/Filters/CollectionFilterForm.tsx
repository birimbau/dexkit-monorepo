import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import { NetworkSelectDropdown } from '@dexkit/ui/components/NetworkSelectDropdown';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ChangeListener from '../../../ChangeListener';
import { CollectionItemAutocomplete } from '../../CollectionItemAutocomplete';
import { SearchTokenAutocompleteWithTokens } from '../../SearchTokenAutocomplete';
import { Conditions } from '../constants/conditions';

interface CollectionFilter {
  chainId?: number;
  mode?: number;
  collectionAddress?: string;
  tokenId?: string;
  conditionNFT?: string;
  amountNFT?: number;
  tokenAddress?: string;
  amount?: number;
  condition?: string;
}

const CollectionFilterSchema: Yup.SchemaOf<CollectionFilter> =
  Yup.object().shape({
    chainId: Yup.number(),
    tokenAddress: Yup.string(),
    amountNFT: Yup.number(),
    conditionNFT: Yup.string(),
    tokenId: Yup.string(),
    condition: Yup.string(),
    amount: Yup.number(),
    collectionAddress: Yup.string(),
    mode: Yup.number().optional(),
  });

interface Props {
  onCancel?: () => void;
  onSubmit?: (item: CollectionFilter) => void;
  onChange?: (item: CollectionFilter, isValid: boolean) => void;
  item?: CollectionFilter;
  isERC1155?: boolean;
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

export default function CollectionFilterForm({
  item,
  onCancel,
  onSubmit,
  onChange,
  isERC1155,
}: Props) {
  const [value, setValue] = useState(1);

  const handleChange = (event: SelectChangeEvent<number>) => {
    setValue(event.target.value as number);
  };

  const { chainId } = useWeb3React();

  return (
    <Formik
      initialValues={
        item
          ? { ...item }
          : {
              chainId: chainId,
            }
      }
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values as CollectionFilter);
        }
      }}
      validationSchema={CollectionFilterSchema}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        values,
        setFieldValue,
        errors,
        resetForm,
      }) => (
        <Form>
          <ChangeListener
            values={values}
            isValid={isValid}
            onChange={onChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <NetworkSelectDropdown
                  chainId={values.chainId}
                  label={
                    <FormattedMessage id="network" defaultMessage="Network" />
                  }
                  onChange={(chainId) => {
                    setFieldValue('chainId', chainId);
                    setFieldValue('tokenAddress', undefined);
                    setFieldValue('collectionAddress', undefined);
                  }}
                  labelId="Choose network"
                  enableTestnet={true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <FormattedMessage
                  id="filter.by.collection"
                  defaultMessage="Filter by collection"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel shrink>
                  <FormattedMessage
                    id="choose.an.option"
                    defaultMessage="Choose an option"
                  />
                </InputLabel>
                <Select
                  value={values.mode}
                  onChange={(e) => {
                    setFieldValue('mode', e.target.value as number);
                  }}
                  notched
                  label={
                    <FormattedMessage
                      id="choose.an.option"
                      defaultMessage="Choose an option"
                    />
                  }
                  fullWidth
                >
                  <MenuItem value={0}>
                    <FormattedMessage
                      id="import.collection"
                      defaultMessage="Import collection"
                    />
                  </MenuItem>
                  <MenuItem value={1}>
                    <FormattedMessage
                      id="my.collections.alt"
                      defaultMessage="My collections"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TabPanel value={values.mode ?? 0} index={1}>
                    <CollectionItemAutocomplete
                      onChange={(coll) => {
                        setFieldValue(
                          'collectionAddress',
                          coll?.contractAddress,
                        );
                      }}
                      filterByChainId={true}
                      chainId={values.chainId}
                      disabled={values.chainId === undefined}
                      value={{
                        contractAddress: values.collectionAddress,
                        chainId: values.chainId,
                      }}
                    />
                  </TabPanel>
                  <TabPanel value={values.mode ?? 0} index={0}>
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
                {Boolean(isERC1155) && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Field
                        component={TextField}
                        type="text"
                        fullWidth
                        label={
                          <FormattedMessage
                            id={'tokenId'}
                            defaultMessage={'Token Id'}
                          />
                        }
                        InputProps={{ min: 0 }}
                        name="tokenId"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel id="condition-amount-nft-select-label">
                          <FormattedMessage
                            id="amount.condition.nft"
                            defaultMessage="Amount condition NFT"
                          />
                        </InputLabel>
                        <Select
                          labelId="condition-amount-nft-select-label"
                          id="demo-simple-select"
                          value={values.conditionNFT}
                          label={
                            <FormattedMessage
                              id="amount.condition.nft"
                              defaultMessage="Amount condition NFT"
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
                        name="amountNFT"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <FormattedMessage
                  id="filter.by.token"
                  defaultMessage="Filter by token"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <SearchTokenAutocompleteWithTokens
                label={
                  <FormattedMessage
                    id="search.token"
                    defaultMessage="Search token"
                  />
                }
                disabled={values.chainId === undefined}
                data={{
                  address: values.tokenAddress,
                  chainId: values.chainId,
                }}
                chainId={values.chainId}
                onChange={(tk: any) => {
                  if (tk) {
                    setFieldValue('tokenAddress', tk.address);
                  } else {
                    setFieldValue('tokenAddress', undefined);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="condition-amount-select-label">
                  <FormattedMessage
                    id="amount.condition"
                    defaultMessage="Amount condition"
                  />
                </InputLabel>
                <Select
                  labelId="condition-amount-select-label"
                  id="demo-simple-select"
                  value={values.condition}
                  label={
                    <FormattedMessage
                      id="amount.condition"
                      defaultMessage="Amount condition"
                    />
                  }
                  onChange={(ev) => setFieldValue('condition', ev.target.value)}
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
                    id="token.amount"
                    defaultMessage="Token Amount"
                  />
                }
                InputProps={{ min: 0 }}
                name="amount"
              />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
