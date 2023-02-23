import { ThemeProvider, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppCollection, AppConfig } from '../../../../types/config';
import { isAddressEqual } from '../../../../utils/blockchain';
import { collectionAtom } from '../../state';
import { CollectionPreviewPaper } from '../sections/CollectionPreviewPaper';
import CollectionsSection from '../sections/CollectionsSection';

export interface Form {
  chainId: number;
  contractAddress: string;
  name: string;
  backgroundUrl: string;
  imageUrl: string;
  description?: string;
  uri?: string;
}

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

export default function CollectionWizardContainer({ config, onSave }: Props) {
  const { formatMessage } = useIntl();
  const [previewCollection, setPreviewCollection] = useAtom(collectionAtom);

  const { enqueueSnackbar } = useSnackbar();
  const [collections, setCollections] = useState<AppCollection[]>(
    config.collections || []
  );
  const [selectedEditCollection, setSelectedEditCollection] = useState<Form>();

  const handleSubmitCollection = (form: Form) => {
    setCollections((value) => [
      ...value,
      {
        chainId: form.chainId,
        backgroundImage: form.backgroundUrl,
        contractAddress: form.contractAddress,
        description: form.description,
        image: form.imageUrl,
        name: form.name,
      },
    ]);
  };

  const handleRemoveCollection = useCallback((collection: AppCollection) => {
    setCollections((value) => {
      const newCollections = [...value];

      const index = newCollections.findIndex(
        (c) =>
          c.chainId === collection.chainId &&
          isAddressEqual(c.contractAddress, collection.contractAddress)
      );

      newCollections.splice(index, 1);

      enqueueSnackbar(
        formatMessage({
          defaultMessage: 'Collection removed',
          id: 'collection.removed',
        }),
        {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        }
      );

      return newCollections;
    });
  }, []);

  const handleEditCollection = useCallback(
    (form: Form) => {
      setCollections((value) => {
        const newCollections = [...value];

        if (!selectedEditCollection) {
          return newCollections;
        }

        const index = newCollections.findIndex(
          (c) =>
            c.chainId === selectedEditCollection.chainId &&
            isAddressEqual(
              c.contractAddress,
              selectedEditCollection.contractAddress
            )
        );

        if (index > -1) {
          newCollections[index] = {
            chainId: form.chainId,
            backgroundImage: form.backgroundUrl,
            contractAddress: form.contractAddress,
            description: form.description,
            image: form.imageUrl,
            name: form.name,
          };
        } else {
          newCollections.push({
            chainId: form.chainId,
            backgroundImage: form.backgroundUrl,
            contractAddress: form.contractAddress,
            description: form.description,
            image: form.imageUrl,
            name: form.name,
          });
        }

        enqueueSnackbar(
          formatMessage({
            defaultMessage: 'Collection saved',
            id: 'collection.saved',
          }),
          {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          }
        );

        setSelectedEditCollection(undefined);

        return newCollections;
      });
    },
    [selectedEditCollection]
  );

  const handleCloseCollectionPreview = () => {
    setPreviewCollection(undefined);
  };

  const handleCollectionSelectEdit = useCallback((form: Form) => {
    setSelectedEditCollection(form);
  }, []);

  const handleSave = () => {
    const newConfig = { ...config, collections };
    onSave(newConfig);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'subtitle2'}>
            <FormattedMessage id="collections" defaultMessage="Collections" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="choose.collections.to.show"
              defaultMessage="Choose collections to show in your marketplace"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Alert severity="info">
          <FormattedMessage
            id="wizard.collections.section.info"
            defaultMessage="Collections displayed by default on collection list page"
          />
        </Alert>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CollectionsSection
          onSubmit={handleSubmitCollection}
          collections={collections}
          onRemove={handleRemoveCollection}
          onEdit={handleEditCollection}
          onSelectEdit={handleCollectionSelectEdit}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {previewCollection && (
          <ThemeProvider theme={config.theme}>
            <CollectionPreviewPaper
              previewCollection={previewCollection}
              onClose={handleCloseCollectionPreview}
            />
          </ThemeProvider>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSave}>
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
