import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PageSectionVariant, SectionItem } from '../../../../types/config';

import AddIcon from '@mui/icons-material/Add';
import * as Yup from 'yup';
import {
  AppPageSection,
  CallToActionAppPageSection,
} from '../../types/section';
import { PageSectionItem } from '../PageSectionItem';
import AddItemForm from './AddItemForm';

interface Form {
  variant: string;
  type: string;
  title: string;
  subtitle: string;
  button: {
    title: string;
    url: string;
  };
}

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  variant: Yup.string().required(),
  type: Yup.string().required(),
  title: Yup.string().required(),
  subtitle: Yup.string().required(),
  button: Yup.object().shape({
    title: Yup.string().required(),
    url: Yup.string().required(),
  }),
});

interface Props {
  onSave: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: CallToActionAppPageSection;
}

export default function CallToActionSectionForm({
  onSave,
  onCancel,
  section,
}: Props) {
  const [showAddItem, setShowAddItem] = useState(false);

  const [items, setItems] = useState<SectionItem[]>(
    section ? section.items : []
  );

  const handleSubmit = (values: Form, helpers: FormikHelpers<Form>) => {
    onSave({
      button: values.button,
      type: 'call-to-action',
      items,
      subtitle: values.subtitle,
      title: values.title,
      variant: values.variant as PageSectionVariant,
    });
  };

  const formik = useFormik({
    initialValues: section
      ? {
          button: section.button,
          subtitle: section.subtitle,
          title: section.title,
          type: 'call-to-action',
          variant: section.variant || 'light',
        }
      : {
          subtitle: '',
          title: '',
          button: { title: '', url: '' },
          type: 'call-to-action',
          variant: 'light',
        },
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const handleCancelItem = () => {
    setShowAddItem(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((items: SectionItem[]) => {
      let newItems = [...items];

      newItems.splice(index, 1);

      return newItems;
    });
  };

  const handleEditItem = (index: number) => {
    setSelectedItemIndex(index);
    setShowAddItem(true);
  };

  const handleAddItem = () => {
    setShowAddItem(true);
  };

  const handleSubmitItem = (item: SectionItem) => {
    if (selectedItemIndex > -1) {
      setItems((value) => {
        const newItems = [...value];

        newItems[selectedItemIndex] = item;

        return newItems;
      });
    } else {
      setItems((value) => [...value, item]);
    }

    setShowAddItem(false);
  };

  const handleSwapItem = (direction: 'up' | 'down', index: number) => {
    setItems((items: SectionItem[]) => {
      let newItems = [...items];
      if (direction === 'up') {
        const swapItem = newItems[index - 1];
        newItems[index - 1] = newItems[index];
        newItems[index] = swapItem;
      } else {
        const swapItem = newItems[index + 1];
        newItems[index + 1] = newItems[index];
        newItems[index] = swapItem;
      }
      return newItems;
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>
              <FormattedMessage id="variant" defaultMessage="Variant" />
            </InputLabel>
            <Select
              required
              label={<FormattedMessage id="variant" defaultMessage="Variant" />}
              fullWidth
              value={formik.values.variant}
              name="variant"
              onChange={formik.handleChange}
            >
              <MenuItem value="light">
                <FormattedMessage id="light" defaultMessage="Light" />
              </MenuItem>
              <MenuItem value="dark">
                <FormattedMessage id="dark" defaultMessage="Dark" />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="title"
            onChange={formik.handleChange}
            fullWidth
            value={formik.values.title}
            label={<FormattedMessage id="title" defaultMessage="Title" />}
            error={Boolean(formik.errors.title)}
            helperText={
              Boolean(formik.errors.title) ? formik.errors.title : undefined
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="subtitle"
            onChange={formik.handleChange}
            fullWidth
            value={formik.values.subtitle}
            label={<FormattedMessage id="subtitle" defaultMessage="Subtitle" />}
            error={Boolean(formik.errors.subtitle)}
            helperText={
              Boolean(formik.errors.subtitle)
                ? formik.errors.subtitle
                : undefined
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="button.title"
            onChange={formik.handleChange}
            fullWidth
            value={formik.values.button.title}
            label={
              <FormattedMessage
                id="button.title"
                defaultMessage="Button Title"
              />
            }
            error={Boolean(formik.errors.button?.title)}
            helperText={
              Boolean(formik.errors.button?.title)
                ? formik.errors.button?.title
                : undefined
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="button.url"
            onChange={formik.handleChange}
            fullWidth
            value={formik.values.button.url}
            label={
              <FormattedMessage id="button.url" defaultMessage="Button URL" />
            }
            error={Boolean(formik.errors.button?.url)}
            helperText={
              Boolean(formik.errors.button?.url)
                ? formik.errors.button?.url
                : undefined
            }
          />
        </Grid>
        {!showAddItem &&
          items.map((item, index) => (
            <Grid item xs={12} key={index}>
              <PageSectionItem
                item={item}
                length={items.length}
                onEdit={handleEditItem}
                onRemove={handleRemoveItem}
                onSwap={handleSwapItem}
                index={index}
              />
            </Grid>
          ))}
        {showAddItem ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <AddItemForm
                item={
                  selectedItemIndex === -1
                    ? undefined
                    : items[selectedItemIndex]
                }
                onCancel={handleCancelItem}
                onSubmit={handleSubmitItem}
              />
            </Paper>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Button
              onClick={handleAddItem}
              startIcon={<AddIcon />}
              variant="outlined"
              fullWidth
            >
              <FormattedMessage id="add.item" defaultMessage="Add item" />
            </Button>
          </Grid>
        )}

        <Grid item xs={12}>
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button
              disabled={!formik.isValid}
              type="submit"
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
            <Button onClick={onCancel}>
              <FormattedMessage id="save" defaultMessage="Cancel" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
