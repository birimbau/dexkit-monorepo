import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';

import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import MuiTextField from '@mui/material/TextField';
import { CellPluginOnChangeOptions } from '@react-page/editor';
import { Field, Formik } from 'formik';
import { ReactNode, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import PasteIconButton from '@dexkit/ui/components/PasteIconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import LazyTextField from '@dexkit/ui/components/LazyTextField';

import { ExpandMore, Search } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { Checkbox, Switch, TextField } from 'formik-mui';

export interface ContractFormProps {
  params: ContractFormParams;
  onChange: (
    data: Partial<ContractFormParams>,
    options?: CellPluginOnChangeOptions | undefined
  ) => void;
}

type TABS = 'write' | 'read';

type FieldVisibility = 'all' | 'only-visible' | 'hidden';

export default function ContractForm({ params, onChange }: ContractFormProps) {
  const handleSubmit = async (values: ContractFormParams) => {
    console.log(values);
    onChange(values);
  };

  const [abi, setAbi] = useState<AbiFragment[]>();

  const handlePaste = (data: string) => {
    try {
      setAbi(JSON.parse(data));
    } catch (err) {
      console.log(err);
    }
  };

  const renderAbiField = () => {
    return (
      <MuiTextField
        name="abi"
        fullWidth
        multiline
        rows={3}
        disabled
        value={abi}
        label={<FormattedMessage id="abi" defaultMessage="ABI" />}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <PasteIconButton icon={<FileCopyIcon />} onPaste={handlePaste} />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const [fieldVisibility, setFieldVisibility] = useState<string>('all');

  const [query, setQuery] = useState('');

  const [selectedTab, setSelectedTab] = useState<TABS>('write');

  const handleChange = (event: React.SyntheticEvent, newValue: TABS) => {
    setSelectedTab(newValue);
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

  const renderFieldsRows = (values: ContractFormParams) => {
    if (abi) {
      let filteredAbi = abi?.filter((f) => f.type === 'function');

      if (query) {
        filteredAbi = filteredAbi.filter((f) => {
          if (f.name) {
            return f.name.toLowerCase().search(query.toLowerCase()) > -1;
          }
          return false;
        });
      }

      if (fieldVisibility === 'only-visible') {
        filteredAbi = filteredAbi.filter((f) => {
          if (f.name) {
            const field = values.fields[f.name];

            if (field) {
              return field.visible;
            }
          }
        });
      }

      if (selectedTab === 'write') {
        filteredAbi = filteredAbi.filter(
          (f) =>
            f.stateMutability === 'nonpayable' ||
            f.stateMutability === 'payable'
        );
      } else if (selectedTab === 'read') {
        filteredAbi = filteredAbi.filter((f) => f.stateMutability === 'view');
      }

      return filteredAbi.map((f, key) => {
        return (
          <Grid item xs={12} key={f.name}>
            <Accordion>
              <AccordionSummary
                sx={{ fontWeight: 600 }}
                expandIcon={<ExpandMore />}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  spacing={1}
                >
                  <Field
                    component={Checkbox}
                    type="checkbox"
                    name={`fields.${f.name}.visible`}
                  />

                  {f.name}
                </Stack>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          type="checkbox"
                          name={`fields.${f.name}.readOnly`}
                        />
                      }
                      label={
                        <FormattedMessage
                          id="read.only"
                          defaultMessage="Read only"
                        />
                      }
                    />
                  </Grid>
                  {f.inputs.length > 0 && (
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            <FormattedMessage
                              id="inputs"
                              defaultMessage="Inputs"
                            />
                          </Typography>
                        </Grid>
                        {f.inputs.map((input) => (
                          <Grid item xs={12} key={input.name}>
                            <Field
                              component={TextField}
                              name={`fields.${f.name}.input.${input.name}`}
                              label={input.name}
                              fullWidth
                              size="small"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        );
      });
    }
  };

  const mappedFields = useMemo(() => {
    if (abi) {
      let obj: {
        [key: string]: {
          visible: boolean;
          readOnly: boolean;
          callOnMount: boolean;
          input: {
            [key: string]: string;
          };
        };
      } = {};

      for (let item of abi) {
        if (item.name) {
          let inputs: { [key: string]: string } = {};

          for (let inp of item.inputs) {
            inputs[inp.name] = '';
          }

          obj[item.name] = {
            input: inputs,
            callOnMount: false,
            readOnly: false,
            visible: false,
          };
        }
      }
      return obj;
    }

    return {};
  }, [abi]);

  return !abi ? (
    renderAbiField()
  ) : (
    <Formik
      initialValues={
        Object.keys(params).length > 1
          ? params
          : { abi, chainId: 1, contractAddress: '', fields: mappedFields }
      }
      onSubmit={handleSubmit}
    >
      {({ errors, values, submitForm }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tabs value={selectedTab} onChange={handleChange}>
              <Tab
                value="write"
                label={<FormattedMessage id="write" defaultMessage="Write" />}
              />
              <Tab
                value="read"
                label={<FormattedMessage id="read" defaultMessage="Read" />}
              />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={2} justifyContent="space-between" direction="row">
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
              <Select value={fieldVisibility} onChange={handleChangeVisibility}>
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
                  <FormattedMessage id="hidden" defaultMessage="Hidden" />
                </MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {renderFieldsRows(values)}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Stack justifyContent="flex-end" direction="row">
              <Button onClick={submitForm} variant="contained" color="primary">
                <FormattedMessage id="Save" defaultMessage="Save" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
