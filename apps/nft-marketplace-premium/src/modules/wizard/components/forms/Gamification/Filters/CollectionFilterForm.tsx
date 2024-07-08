import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import { NetworkSelectDropdown } from '@dexkit/ui/components/NetworkSelectDropdown';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ChangeListener from '../../../ChangeListener';
import { CollectionItemAutocomplete } from '../../CollectionItemAutocomplete';
import { SearchTokenAutocompleteWithTokens } from '../../SearchTokenAutocomplete';
import { Conditions } from '../constants/conditions';

interface CollectionFilter {
  chainId?: number;
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
  const [value, setValue] = useState(0);

  const handleChange = (event: SelectChangeEvent<number>) => {
    setValue(event.target.value as number);
  };

  return (
    <Formik
      initialValues={{ ...item }}
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
                    <FormattedMessage
                      id="choose.network"
                      defaultMessage="Choose network"
                    />
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel shrink>
                      <FormattedMessage
                        id="choose.an.option"
                        defaultMessage="Choose an option"
                      />
                    </InputLabel>
                    <Select
                      value={value}
                      onChange={handleChange}
                      aria-label="collection tabs"
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
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value={value} index={1}>
                <CollectionItemAutocomplete
                  onChange={(coll) => {
                    setFieldValue('collectionAddress', coll?.contractAddress);
                  }}
                  filterByChainId={true}
                  chainId={values.chainId}
                  disabled={values.chainId === undefined}
                  formValue={{
                    contractAddress: values.collectionAddress,
                    chainId: values.chainId,
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
            {isERC1155 === true && (
              <>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                      value={values.conditionNFT}
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

                <Grid item xs={12}>
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
            <Grid item xs={12} sm={5}>
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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="condition-amount-select-label">
                  <FormattedMessage
                    id="condition.amount"
                    defaultMessage="Condition amount"
                  />
                </InputLabel>
                <Select
                  labelId="condition-amount-select-label"
                  id="demo-simple-select"
                  value={values.condition}
                  label={
                    <FormattedMessage
                      id="condition.amount"
                      defaultMessage="Condition amount"
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
                  <FormattedMessage id={'Amount'} defaultMessage={'Amount'} />
                }
                InputProps={{ min: 0 }}
                name="amount"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button onClick={() => resetForm()}>
                  <FormattedMessage id="clear" defaultMessage="Clear" />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
