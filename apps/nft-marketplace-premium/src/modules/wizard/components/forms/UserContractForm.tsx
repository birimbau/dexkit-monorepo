import { useListFormsQuery } from '@/modules/forms/hooks';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import UserContractFormCard from '../UserContractFormCard';

interface Props {
  onSave: (formId?: number) => void;
  onCancel: () => void;
  formId?: number;
  saveOnChange?: boolean;
}

export function UserContractForm({
  onSave,
  onCancel,
  formId,
  saveOnChange,
}: Props) {
  const { account } = useWeb3React();

  const [query, setQuery] = useState<string>();

  const listFormsQuery = useListFormsQuery({ creatorAddress: account, query });

  const [selectedFormId, setSelectedFormId] = useState<number>();

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const handleClick = useCallback(
    (id: number) => {
      setSelectedFormId(id);

      if (saveOnChange && id) {
        onSave(id);
      }
    },
    [saveOnChange]
  );

  const handleSave = useCallback(() => {
    if (selectedFormId) {
      onSave(selectedFormId);
    }
  }, [onSave, selectedFormId]);

  useEffect(() => {
    if (!selectedFormId) {
      setSelectedFormId(formId);
    }
  }, [formId]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {listFormsQuery.data?.map((form) => (
              <Grid key={form.id} item xs={12}>
                <UserContractFormCard
                  id={form.id}
                  description={form.description}
                  name={form.name}
                  selected={selectedFormId === form.id}
                  onClick={handleClick}
                />
              </Grid>
            ))}
            {listFormsQuery.isLoading &&
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
        {!saveOnChange && (
          <Grid item xs={12}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  onClick={handleSave}
                  disabled={selectedFormId === undefined}
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
