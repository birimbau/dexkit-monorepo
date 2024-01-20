import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
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
  conditionNFT?: number;
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
    conditionNFT: Yup.number(),
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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="caption">
                  <FormattedMessage
                    id="choose.network"
                    defaultMessage="Choose network"
                  />
                </Typography>
                <NetworkSelectDropdown
                  chainId={values.chainId}
                  onChange={(chainId) => {
                    setFieldValue('chainId', chainId);
                    setFieldValue('tokenAddress', undefined);
                    setFieldValue('collectionAddress', undefined);
                  }}
                  labelId="Choose network"
                />
              </FormControl>
            </Grid>

            <>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="collection tabs"
              >
                <Tab label="Import" {...a11yProps(0)} />
                <Tab label="Your collections" {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={value} index={1}>
                <Grid item xs={12}>
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
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={0}>
                <Grid item xs={12}>
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
                </Grid>
              </TabPanel>
            </>
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
                        <MenuItem value={v} key={i}>
                          {v}
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
                    <MenuItem value={v} key={i}>
                      {v}
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
                  <FormattedMessage id={'Amount'} defaultMessage={'Amount'} />
                }
                InputProps={{ min: 0 }}
                name="amount"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display={'flex'} justifyContent={'flex-end'}>
                <Button onClick={() => resetForm()}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
