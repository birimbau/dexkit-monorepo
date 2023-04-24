import { inputMapping } from '@/modules/wizard/utils';
import PasteIconButton from '@dexkit/ui/components/PasteIconButton';
import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { InputAdornment, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { useSnackbar } from 'notistack';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';

export interface ContractFormAbiInputProps {
  abiStr: string;
}

function ContractFormAbiInput({ abiStr }: ContractFormAbiInputProps) {
  const { setFieldValue } = useFormikContext<ContractFormParams>();

  const { enqueueSnackbar } = useSnackbar();

  const handlePaste = (data: string) => {
    try {
      const abi: AbiFragment[] = JSON.parse(data);
      const fields = inputMapping(abi);

      setFieldValue('abi', abi);
      setFieldValue('fields', fields);
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <TextField
      fullWidth
      multiline
      rows={3}
      value={abiStr}
      disabled
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
}

export default memo(ContractFormAbiInput);
