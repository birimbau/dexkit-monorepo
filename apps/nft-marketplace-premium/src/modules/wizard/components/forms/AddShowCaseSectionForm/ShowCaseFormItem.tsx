import { ShowCaseItemImage } from '@/modules/wizard/types/section';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Check from '@mui/icons-material/Check';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { Field, useField } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface ShowCaseFormItemProps {
  index: number;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
  onSelectImage: () => void;
}

export default function ShowCaseFormItem({
  index,
  onRemove,
  onUp,
  onDown,
  disableUp,
  disableDown,
  onSelectImage,
}: ShowCaseFormItemProps) {
  const [itemProps, itemMeta, itemHelpers] = useField<ShowCaseItemImage>(
    `items[${index}]`
  );

  const [isEditing, setIsEditing] = useState(false);

  const [imgProps, imgMeta, imgHelpers] = useField<string>(
    `items[${index}].image`
  );

  if (isEditing) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field component={Select} name={`items[${index}].type`}>
            <MenuItem value="image">
              <FormattedMessage id="image" defaultMessage="Image" />
            </MenuItem>
            <MenuItem value="asset">
              <FormattedMessage id="asset" defaultMessage="Asset" />
            </MenuItem>
          </Field>
        </Grid>
        {itemMeta.value.type === 'image' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name={`items[${index}].imageUrl`}
                />
              </Grid>
              <Grid item xs={12}>
                <Field component={TextField} name={`items[${index}].title`} />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name={`items[${index}].subtitle`}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  fullWidth
                  label={
                    <FormattedMessage
                      id="button.cation"
                      defaultMessage="Button caption"
                    />
                  }
                  name={`items[${index}].action.caption`}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  fullWidth
                  label={<FormattedMessage id="url" defaultMessage="URL" />}
                  name={`items[${index}].action.url`}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Stack spacing={1} alignItems="center" direction="row">
                  <Button
                    onClick={() => setIsEditing(false)}
                    startIcon={<Check />}
                    size="small"
                    variant="outlined"
                    disabled={Boolean(imgMeta.error)}
                  >
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={onRemove}
                    size="small"
                  >
                    <FormattedMessage id="remove" defaultMessage="Remove" />
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Avatar variant="rounded" src={itemMeta.value.imageUrl} />
        {itemMeta.value.title && (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {itemMeta.value.title}
            </Typography>
            {itemMeta.value.subtitle && (
              <Typography variant="body2" color="text.secondary">
                {itemMeta.value.subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Stack>

      <Stack
        spacing={0.5}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton disabled={disableUp} onClick={onUp}>
          <ArrowUpward fontSize="inherit" />
        </IconButton>
        <IconButton disabled={disableDown} onClick={onDown}>
          <ArrowDownward fontSize="inherit" />
        </IconButton>
        <IconButton onClick={() => setIsEditing(true)}>
          <Edit fontSize="inherit" />
        </IconButton>
        <IconButton color="error" onClick={onRemove}>
          <Delete fontSize="inherit" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
