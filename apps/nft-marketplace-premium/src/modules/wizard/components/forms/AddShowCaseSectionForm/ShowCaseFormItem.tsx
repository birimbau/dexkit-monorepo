import { ShowCaseItem } from '@/modules/wizard/types/section';
import { ipfsUriToUrl } from '@dexkit/core/utils';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Check from '@mui/icons-material/Check';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Image from '@mui/icons-material/Image';

import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { Network } from '@dexkit/core/types';
import { useActiveChainIds } from '@dexkit/ui';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { Field, useField } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getNetworks } from 'src/utils/blockchain';
import AssetItem from './AssetItem';

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
  const { activeChainIds } = useActiveChainIds();

  const [itemProps, itemMeta, itemHelpers] = useField<ShowCaseItem>(
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
          <FormControl fullWidth>
            <Field
              fullWidth
              label={
                <FormattedMessage id="item.type" defaultMessage="Item type" />
              }
              component={Select}
              name={`items[${index}].type`}
            >
              <MenuItem value="image">
                <FormattedMessage id="image" defaultMessage="Image" />
              </MenuItem>
              <MenuItem value="asset">
                <FormattedMessage id="asset" defaultMessage="Asset" />
              </MenuItem>
            </Field>
          </FormControl>
        </Grid>
        {itemMeta.value.type === 'image' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  component={TextField}
                  name={`items[${index}].imageUrl`}
                  label={
                    <FormattedMessage
                      id="image.url"
                      defaultMessage="Image URL"
                    />
                  }
                  InputLabel={{ shrink: true }}
                  InputProps={{
                    shrink: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={onSelectImage}>
                          <Image />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  component={TextField}
                  name={`items[${index}].title`}
                  label={<FormattedMessage id="title" defaultMessage="Title" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  component={TextField}
                  name={`items[${index}].subtitle`}
                  label={
                    <FormattedMessage id="subtitle" defaultMessage="Subtitle" />
                  }
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
          </Grid>
        )}
        {itemMeta.value.type === 'asset' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Field
                    component={Select}
                    fullWidth
                    name={`items[${index}].chainId`}
                    renderValue={(value: ChainId) => {
                      return (
                        <Stack
                          direction="row"
                          alignItems="center"
                          alignContent="center"
                          spacing={1}
                        >
                          <Avatar
                            src={ipfsUriToUrl(NETWORKS[value]?.imageUrl || '')}
                            style={{ width: 'auto', height: '1rem' }}
                          />
                          <Typography variant="body1">
                            {NETWORKS[value]?.name}
                          </Typography>
                        </Stack>
                      );
                    }}
                  >
                    {getNetworks({ includeTestnet: true })
                      .filter((n) => activeChainIds.includes(n.chainId))
                      .map((network: Network, index: number) => (
                        <MenuItem key={index} value={network?.chainId}>
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
                                src={ipfsUriToUrl(network?.imageUrl || '')}
                                sx={{
                                  width: 'auto',
                                  height: '1rem',
                                }}
                              />
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={network?.name} />
                        </MenuItem>
                      ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  fullWidth
                  label={
                    <FormattedMessage
                      id="contract.address"
                      defaultMessage="Contract Address"
                    />
                  }
                  name={`items[${index}].contractAddress`}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  fullWidth
                  label={
                    <FormattedMessage id="token.id" defaultMessage="TokenID" />
                  }
                  name={`items[${index}].tokenId`}
                />
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
        {itemMeta.value.type === 'image' && (
          <>
            <Avatar variant="rounded" src={itemMeta.value.imageUrl} />
            {itemMeta.value.title && (
              <Box>
                <Typography
                  sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                  variant="body1"
                  fontWeight="bold"
                >
                  {itemMeta.value.title}
                </Typography>
                {itemMeta.value.subtitle && (
                  <Typography
                    sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {itemMeta.value.subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
        {itemMeta.value.type === 'asset' && <AssetItem item={itemMeta.value} />}
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
