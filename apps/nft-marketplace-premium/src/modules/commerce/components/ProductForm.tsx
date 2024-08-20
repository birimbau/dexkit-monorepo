import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { AccountFile } from '@dexkit/ui/modules/file/types';
import Image from '@mui/icons-material/Image';
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField as MuiTextField,
  Stack,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import moment, { Moment } from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ProductFormType } from '../types';

import ProductCategoryAutocomplete from '@dexkit/ui/modules/commerce/components/CommerceSection/ProductCategoryAutocomplete';
import { ProductCategoryType } from '@dexkit/ui/modules/commerce/types';
import useCategoryList from '../hooks/useCategoryList';

export interface ProductFormProps {
  onSubmit: () => void;
  isValid?: boolean;
}

export default function ProductForm({ onSubmit, isValid }: ProductFormProps) {
  const { setFieldValue, values } = useFormikContext<ProductFormType>();

  const handleSelectFile = (file: AccountFile) => {
    setFieldValue('imageUrl', file.url);
  };

  const [showSelectFile, setShowSelectFile] = useState(false);

  const handleSelectOpen = () => {
    setShowSelectFile(true);
  };

  const handleClose = () => {
    setShowSelectFile(false);
  };

  const [showPublishedAt, setShowPublishedAt] = useState<boolean>(false);

  useEffect(() => {
    if (values.publishedAt) {
      setShowPublishedAt(true);
    }
  }, [values.publishedAt]);

  const { data: categories } = useCategoryList({ limit: 50, page: 0 });

  return (
    <>
      <MediaDialog
        onConfirmSelectFile={handleSelectFile}
        dialogProps={{
          open: showSelectFile,
          onClose: handleClose,
          maxWidth: 'lg',
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <ButtonBase
            onClick={handleSelectOpen}
            sx={{
              position: 'relative',
              p: 2,
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(0,0,0, 0.2)'
                  : alpha(theme.palette.common.white, 0.1),

              backgroundImage: values.imageUrl
                ? `url("${values.imageUrl}")`
                : undefined,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <Stack
              sx={{
                height: 150,
                maxHeight: 300,
                minHeight: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: (theme) =>
                  theme.palette.getContrastText(
                    theme.palette.mode === 'light'
                      ? 'rgba(0,0,0, 0.2)'
                      : alpha(theme.palette.common.white, 0.1),
                  ),
              }}
            >
              {!values.imageUrl && <Image fontSize="large" />}
            </Stack>
          </ButtonBase>
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name="name"
            fullWidth
            label={<FormattedMessage id="name" defaultMessage="Name" />}
          />
        </Grid>
        <Grid item xs={12}>
          <ProductCategoryAutocomplete
            value={values.category ?? null}
            onChange={(value: ProductCategoryType | null) => {
              setFieldValue('category', value);
            }}
            categories={categories?.items ?? []}
          />
        </Grid>
        <Grid item xs={12}>
          <FormikDecimalInput
            name="price"
            TextFieldProps={{
              fullWidth: true,
              label: <FormattedMessage id="price" defaultMessage="Price" />,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
            decimals={6}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            label={
              <FormattedMessage id="published" defaultMessage="Published?" />
            }
            control={
              <Checkbox
                checked={showPublishedAt}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setFieldValue('publishedAt', null);
                  } else {
                    setFieldValue('publishedAt', new Date());
                  }
                  setShowPublishedAt(e.target.checked);
                }}
              />
            }
          />
        </Grid>
        {showPublishedAt && (
          <Grid item xs={12}>
            <DateTimePicker
              renderInput={(props) => <MuiTextField {...props} />}
              value={moment(values.publishedAt)}
              onChange={(value: Moment | null) => {
                setFieldValue('publishedAt', value?.toDate());
              }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}
            >
              <Button LinkComponent={Link} href="/u/account/commerce/products">
                <FormattedMessage id="cancel" defaultMessage="cancel" />
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!isValid}
                variant="contained"
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
