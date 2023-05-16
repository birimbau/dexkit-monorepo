import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';

import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { CellPluginOnChangeOptions } from '@react-page/editor';
import { Formik, FormikHelpers } from 'formik';
import { ReactNode, useState, useTransition } from 'react';
import { FormattedMessage } from 'react-intl';

import LazyTextField from '@dexkit/ui/components/LazyTextField';

import { inputMapping } from '@/modules/wizard/utils';
import { parseChainId } from '@dexkit/core/utils';
import { Search } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { ContractFormSchema } from '../../../constants/schemas';
import ChangeListener from '../../ChangeListener';
import ContractFormAbiFetcher from './ContractFormAbiFetcher';
import ContractFormFilteredFields from './ContractFormFilteredFields';
import ContractInitialForm from './ContractInitialForm';

export const DEFAULT_STATE = {
  abi: [],
  chainId: 1,
  contractAddress: '',
  fields: {},
};

export interface ContractFormProps {
  params?: ContractFormParams;
  updateOnChange?: boolean;
  onChange: (
    data: ContractFormParams,
    options?: CellPluginOnChangeOptions | undefined
  ) => void;
  onCancel?: () => void;
}

type TABS = 'write' | 'read';

export default function ContractForm({
  params,
  updateOnChange,
  onChange,
  onCancel,
}: ContractFormProps) {
  const handleSubmit = async (
    values: ContractFormParams,
    helpers: FormikHelpers<ContractFormParams>
  ) => {
    onChange({
      ...values,
      // to solve a bug of formik.
      chainId: parseChainId(values.chainId),
    });
  };

  const [fieldVisibility, setFieldVisibility] = useState<string>('all');

  const [query, setQuery] = useState('');

  const [selectedTab, setSelectedTab] = useState<TABS>('write');

  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.SyntheticEvent, newValue: TABS) => {
    startTransition(() => {
      setSelectedTab(newValue);
    });
  };

  const handleChangeSearch = (value: string) => {
    setQuery(value);
  };

  const handleChangeVisibility = (
    event: SelectChangeEvent<string>,
    child: ReactNode
  ) => {
    setFieldVisibility(event.target.value);
  };

  const hasParams = params && Object.keys(params).length > 1;

  const [currentContract, setCurrentContract] = useState<string>();

  return (
    <Formik
      initialValues={hasParams ? params : DEFAULT_STATE}
      onSubmit={handleSubmit}
      validationSchema={ContractFormSchema}
      validateOnChange
    >
      {({ errors, values, submitForm, setFieldValue, isValid }) => (
        <>
          <ContractFormAbiFetcher
            contractAddress={values.contractAddress}
            chainId={values.chainId}
            onSuccess={(abi: AbiFragment[]) => {
              console.log(values.fields);

              if (Object.keys(values.fields).length === 0) {
                const fields = inputMapping(abi);
                setFieldValue('fields', fields);
              }

              setFieldValue('abi', abi);
              setCurrentContract(values.contractAddress);
            }}
            enabled={
              values.contractAddress !== '' &&
              values.contractAddress !== currentContract
            }
          />
          {updateOnChange && (
            <ChangeListener
              values={values}
              isValid={isValid}
              onChange={(vals: any) =>
                onChange({ ...vals, chainId: parseChainId(vals.chainId) })
              }
            />
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ContractInitialForm abi={values.abi} />
            </Grid>
            {values.abi.length > 0 && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Tabs value={selectedTab} onChange={handleChange}>
                      <Tab
                        value="write"
                        label={
                          <FormattedMessage id="write" defaultMessage="Write" />
                        }
                      />
                      <Tab
                        value="read"
                        label={
                          <FormattedMessage id="read" defaultMessage="Read" />
                        }
                      />
                    </Tabs>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack
                      spacing={2}
                      justifyContent="space-between"
                      direction="row"
                    >
                      <LazyTextField
                        onChange={handleChangeSearch}
                        TextFieldProps={{
                          fullWidth: true,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                      <MuiSelect
                        value={fieldVisibility}
                        onChange={handleChangeVisibility}
                      >
                        <MenuItem value="all">
                          <FormattedMessage id="all" defaultMessage="All" />
                        </MenuItem>
                        <MenuItem value="only-visible">
                          <FormattedMessage
                            id="only.visible"
                            defaultMessage="Only visible"
                          />
                        </MenuItem>
                        <MenuItem value="hidden">
                          <FormattedMessage
                            id="hidden"
                            defaultMessage="Hidden"
                          />
                        </MenuItem>
                      </MuiSelect>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {isPending ? (
                        <Grid item xs={12}>
                          <Box>
                            <Stack
                              sx={{ py: 2 }}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <CircularProgress color="primary" />
                            </Stack>
                          </Box>
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <ContractFormFilteredFields
                            fieldVisibility={fieldVisibility}
                            query={query}
                            selectedTab={selectedTab}
                            abi={values.abi}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}>
              <Stack justifyContent="flex-end" direction="row" spacing={2}>
                {!updateOnChange && (
                  <Button
                    onClick={submitForm}
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="Save" defaultMessage="Save" />
                  </Button>
                )}

                {onCancel && (
                  <Button onClick={onCancel}>
                    <FormattedMessage id="cancel" defaultMessage="Cancel" />
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Formik>
  );
}
