import { GamificationPoint } from '@/modules/wizard/types';
import { AppRanking } from '@/modules/wizard/types/ranking';
import { UserEvents } from '@dexkit/core/constants/userEvents';
import { beautifyCamelCase } from '@dexkit/core/utils';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Cancel from '@mui/icons-material/Cancel';
import Check from '@mui/icons-material/Check';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete as AutocompleteMUI,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  Stack,
  TextField as TextFieldMUI,
  Typography,
} from '@mui/material';
import { Field, FormikErrors, FormikTouched } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CollectionFilterForm from './Filters/CollectionFilterForm';
import DropCollectionFilterForm from './Filters/DropCollectionFilter';
import SwapFilterForm from './Filters/SwapFilterForm';

const userEvents = [
  {
    value: UserEvents.nftAcceptListERC1155,
    name: 'Accept listing ERC1155',
  },
  {
    value: UserEvents.nftAcceptOfferERC1155,
    name: 'Accept offer ERC1155',
  },
  {
    value: UserEvents.nftAcceptListERC721,
    name: 'Accept listing ERC721',
  },
  {
    value: UserEvents.nftAcceptOfferERC721,
    name: 'Accept offer ERC721',
  },
  {
    value: UserEvents.buyDropCollection,
    name: 'Buy drop collection',
  },
  {
    value: UserEvents.buyDropEdition,
    name: 'Buy drop edition',
  },
  {
    name: 'Sign login message',
    value: UserEvents.loginSignMessage,
  },
  {
    name: beautifyCamelCase(UserEvents.swap),
    value: UserEvents.swap,
  },
];

export interface LeaderboardRuleProps {
  index: number;
  setFieldValue: (field: string, value: any) => void;
  values: {
    from: string | undefined;
    to: string | undefined;
    settings: GamificationPoint[];
  };
  touched: FormikTouched<{
    from: string | undefined;
    to: string | undefined;
    settings: GamificationPoint[];
  }>;
  errors: FormikErrors<{
    from: string | undefined;
    to: string | undefined;
    settings: GamificationPoint[];
  }>;
  ranking: AppRanking;
  onRemove: () => void;
  isNew: boolean;
  onSave: () => void;
}

export default function LeaderboardRule({
  index,
  setFieldValue,
  values,
  touched,
  errors,
  ranking,
  onRemove,
  isNew,
  onSave,
}: LeaderboardRuleProps) {
  const renderFilter = (event?: string) => {
    switch (event) {
      case UserEvents.swap:
        return (
          <SwapFilterForm
            item={
              values?.settings[index]?.filter
                ? JSON.parse(values?.settings[index]?.filter as string)
                : undefined
            }
            onChange={(item) =>
              setFieldValue(
                `settings[${index}].filter`,
                item ? JSON.stringify(item) : undefined,
              )
            }
          />
        );
      case UserEvents.nftAcceptListERC721:
      case UserEvents.nftAcceptOfferERC721:
      case UserEvents.nftAcceptListERC1155:
      case UserEvents.nftAcceptOfferERC1155:
        return (
          <CollectionFilterForm
            item={
              values?.settings[index]?.filter
                ? JSON.parse(values?.settings[index]?.filter as string)
                : undefined
            }
            onChange={(item) =>
              setFieldValue(
                `settings[${index}].filter`,
                item ? JSON.stringify(item) : undefined,
              )
            }
            isERC1155={
              values.settings[index]?.userEventType ===
                UserEvents.nftAcceptOfferERC1155 ||
              values.settings[index]?.userEventType ===
                UserEvents.nftAcceptListERC1155
            }
          />
        );
      case UserEvents.buyDropCollection:
      case UserEvents.buyDropEdition:
        return (
          <DropCollectionFilterForm
            item={
              values?.settings[index]?.filter
                ? JSON.parse(values?.settings[index]?.filter as string)
                : undefined
            }
            index={index}
            onChange={(item) => {
              setFieldValue(
                `settings[${index}].filter`,
                item ? JSON.stringify(item) : undefined,
              );
            }}
            isERC1155={
              values.settings[index]?.userEventType ===
              UserEvents.buyDropEdition
            }
          />
        );
      default:
        break;
    }

    return null;
  };

  const { chainId } = useWeb3React();

  const [edit, setEdit] = useState(isNew);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontWeight="bold" variant="body1">
              <FormattedMessage
                id="rule.index.value"
                defaultMessage="Rule {index}"
                values={{
                  index: index + 1,
                }}
              />
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Field
            disabled={!edit}
            component={TextField}
            type="number"
            InputLabelProps={{ shrink: true }}
            name={`settings[${index}].points`}
            label={<FormattedMessage id="points" defaultMessage="Points" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="filled">
                <AutocompleteMUI
                  disabled={!edit}
                  value={userEvents.find(
                    (u) => u.value === values.settings[index]?.userEventType,
                  )}
                  options={userEvents}
                  onChange={(e: any, value: any) => {
                    setFieldValue(`settings[${index}]`, {
                      userEventType: value?.value,
                      chainId: chainId,
                      points: 0,
                    });
                  }}
                  isOptionEqualToValue={(option: any, value: any) => {
                    return option.value === value;
                  }}
                  getOptionLabel={(option: { name?: string; value?: string }) =>
                    option?.name || ' '
                  }
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextFieldMUI
                      {...params}
                      // We have to manually set the corresponding fields on the input component

                      //@ts-ignore
                      error={
                        //@ts-ignore
                        touched[`settings[${index}].userEventType`] &&
                        //@ts-ignore
                        !!errors[`settings[${index}].userEventType`]
                      }
                      helperText={
                        //@ts-ignore
                        errors[`settings[${index}].userEventType`]
                      }
                      label={
                        <FormattedMessage
                          id="user.event"
                          defaultMessage="User Event"
                        />
                      }
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        {values.settings[index]?.userEventType &&
          values.settings[index]?.userEventType !==
            UserEvents.loginSignMessage && (
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ArrowDownward />}>
                  <Typography>
                    <FormattedMessage
                      id="filter.event"
                      defaultMessage="Filter event"
                    />
                  </Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{ pt: 3 }}>
                  {renderFilter(values.settings[index]?.userEventType)}
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}

        <Grid item xs={12}>
          {edit ? (
            <Box>
              <Stack direction="row" spacing={2}>
                {!isNew ? (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={onRemove}
                  >
                    <FormattedMessage id="remove" defaultMessage="Remove" />
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => {
                      if (isNew) {
                        return onRemove();
                      }
                      setEdit(false);
                    }}
                  >
                    <FormattedMessage id="cancel" defaultMessage="Cancel" />
                  </Button>
                )}

                <Button
                  size="small"
                  startIcon={<Check />}
                  onClick={() => {
                    setEdit(false);
                    onSave();
                  }}
                  variant="contained"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box>
              <Stack direction="row" spacing={2}>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => setEdit(true)}
                >
                  <FormattedMessage id="edit" defaultMessage="Edit" />
                </Button>
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
