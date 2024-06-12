import { Network } from '@dexkit/core/types';
import { ipfsUriToUrl } from '@dexkit/core/utils';
import { AppDialogTitle } from '@dexkit/ui';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { isAddress } from 'ethers/lib/utils';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import { NETWORKS } from 'src/constants/chain';

import * as Yup from 'yup';

const Schema = Yup.object({
  contractAddress: Yup.string().test('address', (value) => {
    return value !== undefined ? isAddress(value) : true;
  }),
  chainId: Yup.number(),
  name: Yup.string(),
});

export interface ImportContractDialogProps {
  DialogProps: DialogProps;
}

export default function ImportContractDialog({
  DialogProps,
}: ImportContractDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const { chainId } = useWeb3React();

  const handleSubmit = (values: any) => {};

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="import.contract"
            defaultMessage="Import contract"
          />
        }
        sx={{ px: 4 }}
        onClose={handleClose}
      />
      <DialogContent sx={{ p: 4 }} dividers>
        {chainId && (
          <Formik
            initialValues={{
              contractAddress: '',
              chainId: chainId,
              name: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={Schema}
          >
            {({ values, handleChange }) => (
              <Stack spacing={2}>
                <FormControl>
                  <Select
                    fullWidth
                    value={values.chainId}
                    onChange={handleChange}
                    name="chainId"
                    renderValue={(value) => {
                      return (
                        <Stack
                          direction="row"
                          alignItems="center"
                          alignContent="center"
                          spacing={1}
                        >
                          <Avatar
                            src={ipfsUriToUrl(
                              NETWORKS[values.chainId].imageUrl || ''
                            )}
                            style={{ width: 'auto', height: '1rem' }}
                          />
                          <Typography variant="body1">
                            {NETWORKS[values.chainId].name}
                          </Typography>
                        </Stack>
                      );
                    }}
                  >
                    {Object.keys(NETWORKS)
                      .filter((key: any) => !NETWORKS[key].testnet)
                      .map((key: any, index: number) => (
                        <MenuItem key={index} value={key}>
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: (theme) => theme.spacing(4),
                                display: 'flex',
                                alignItems: 'center',
                                alignContent: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Avatar
                                src={ipfsUriToUrl(
                                  (NETWORKS[key] as Network)?.imageUrl || ''
                                )}
                                sx={{
                                  width: 'auto',
                                  height: '1rem',
                                }}
                              />
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={NETWORKS[key].name} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Field
                  component={TextField}
                  name="contractAddress"
                  label={
                    <FormattedMessage
                      id="contract.address"
                      defaultMessage="Contract address"
                    />
                  }
                  fullWidth
                />
                <Field
                  component={TextField}
                  name="name"
                  label={<FormattedMessage id="name" defaultMessage="Name" />}
                  fullWidth
                />
              </Stack>
            )}
          </Formik>
        )}
      </DialogContent>
      <DialogActions sx={{ py: 2, px: 4 }}>
        <Button>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button variant="contained">
          <FormattedMessage id="import" defaultMessage="Import" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
