import { NETWORKS } from '@dexkit/core/constants/networks';
import { ipfsUriToUrl, parseChainId } from '@dexkit/core/utils';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { Select, Switch, TextField } from 'formik-mui';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { CreateCollectionFormSchema } from '../../constants/schemas';
import { CollectionPageSection } from '../../types/section';

export interface CollectionSectionFormAltProps {
  section?: CollectionPageSection;
  onSave: (section: CollectionPageSection) => void;
  onChange: (section: CollectionPageSection) => void;
  onCancel: () => void;
  showSaveButton?: boolean;
}

export interface Form {
  address: string;
  network: string;
  hideFilters: boolean;
  hideHeader: boolean;
  hideDrops: boolean;
  hideAssets: boolean;
}

export default function CollectionSectionFormAlt({
  section,
  onSave,
  onChange,
  onCancel,
  showSaveButton,
}: CollectionSectionFormAltProps) {
  const handleSubmit = (config: Form) => {
    onSave({ type: 'collection', config });
  };

  const handleValiate = (config: Form) => {
    onChange({ type: 'collection', config });
  };

  const networks = useMemo(() => {
    return Object.keys(NETWORKS).map(
      (key: string) => NETWORKS[parseChainId(key)],
    );
  }, []);

  return (
    <Formik
      initialValues={
        section
          ? section.config
          : {
              address: '',
              network: 'ethereum',
              hideAssets: false,
              hideDrops: false,
              hideFilters: false,
              hideHeader: false,
            }
      }
      onSubmit={handleSubmit}
      validate={handleValiate}
      validationSchema={CreateCollectionFormSchema}
      validateOnChange
    >
      {({ submitForm, isValid }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Field
                component={Select}
                label={
                  <FormattedMessage id="network" defaultMessage="Network" />
                }
                name="network"
                fullWidth
                renderValue={(value: string) => {
                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={1}
                    >
                      <Avatar
                        src={ipfsUriToUrl(
                          networks.find((n) => n.slug === value)?.imageUrl ||
                            '',
                        )}
                        style={{ width: 'auto', height: '1rem' }}
                      />
                      <Typography variant="body1">
                        {networks.find((n) => n.slug === value)?.name}
                      </Typography>
                    </Stack>
                  );
                }}
              >
                {networks.map((n) => (
                  <MenuItem key={n.slug} value={n.slug}>
                    <ListItemIcon>
                      <Avatar
                        src={ipfsUriToUrl(n?.imageUrl || '')}
                        style={{ width: '1rem', height: '1rem' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={n.name} />
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Field
              component={TextField}
              fullWidth
              name="address"
              label={
                <FormattedMessage
                  id="contract.address"
                  defaultMessage="Contract address"
                />
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>
                  <FormattedMessage id="advanced" defaultMessage="Advanced" />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          type="checkbox"
                          name="hideHeader"
                        />
                      }
                      label={
                        <FormattedMessage
                          id="hide.header"
                          defaultMessage="Hide Header"
                        />
                      }
                    />
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          type="checkbox"
                          name="hideFilters"
                        />
                      }
                      label={
                        <FormattedMessage
                          id="hide.filters"
                          defaultMessage="Hide Filters"
                        />
                      }
                    />
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          type="checkbox"
                          name="hideAssets"
                        />
                      }
                      label={
                        <FormattedMessage
                          id="hide.assets"
                          defaultMessage="Hide Assets"
                        />
                      }
                    />
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          type="checkbox"
                          name="hideDrops"
                        />
                      }
                      label={
                        <FormattedMessage
                          id="hide.drops"
                          defaultMessage="Hide Drops"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          {showSaveButton && (
            <Grid item xs={12}>
              <Box>
                <Stack spacing={1} direction="row">
                  <Button
                    disabled={!isValid}
                    onClick={submitForm}
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
      )}
    </Formik>
  );
}
