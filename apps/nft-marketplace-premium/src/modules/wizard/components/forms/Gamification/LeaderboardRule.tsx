import { GamificationPoint } from '@/modules/wizard/types';
import { UserEvents } from '@dexkit/core/constants/userEvents';
import { beautifyCamelCase } from '@dexkit/core/utils';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete as AutocompleteMUI,
  AutocompleteRenderInputParams,
  Box,
  Divider,
  FormControl,
  Grid,
  TextField as TextFieldMUI,
  Typography,
} from '@mui/material';
import { Field, FormikErrors, FormikTouched } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import CollectionFilterForm from './Filters/CollectionFilterForm';
import DropCollectionFilterForm from './Filters/DropCollectionFilter';
import SwapFilterForm from './Filters/SwapFilterForm';

const userEvents = [
  {
    name: beautifyCamelCase(UserEvents.loginSignMessage),
    value: UserEvents.loginSignMessage,
  },
  {
    name: beautifyCamelCase(UserEvents.swap),
    value: UserEvents.swap,
  },
  {
    value: UserEvents.nftAcceptListERC721,
    name: 'Accept listing ERC721',
  },
  {
    value: UserEvents.nftAcceptListERC1155,
    name: 'Accept listing ERC1155',
  },
  {
    value: UserEvents.nftAcceptOfferERC721,
    name: 'Accept offer ERC721',
  },
  {
    value: UserEvents.nftAcceptOfferERC1155,
    name: 'Accept offer ERC1155',
  },
  {
    value: UserEvents.buyDropCollection,
    name: 'Buy drop collection',
  },
  {
    value: UserEvents.buyDropEdition,
    name: 'Buy drop edition',
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
}

export default function LeaderboardRule({
  index,
  setFieldValue,
  values,
  touched,
  errors,
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
            onChange={(item) =>
              setFieldValue(
                `settings[${index}].filter`,
                item ? JSON.stringify(item) : undefined,
              )
            }
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

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="body1">
            <FormattedMessage
              id="rule.index.value"
              defaultMessage="Rule {index}"
              values={{
                index: index + 1,
              }}
            />
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Field
            component={TextField}
            type="number"
            name={`settings[${index}].points`}
            label={<FormattedMessage id="points" defaultMessage="Points" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="filled">
                <AutocompleteMUI
                  value={userEvents.find(
                    (u) => u.value === values.settings[index]?.userEventType,
                  )}
                  options={userEvents}
                  onChange={(e: any, value: any) =>
                    setFieldValue(
                      `settings[${index}].userEventType`,
                      value?.value,
                    )
                  }
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
        {values.settings[index]?.userEventType && (
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownward />}>
                <Typography>
                  <FormattedMessage id="filter" defaultMessage="Filter" />
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails sx={{ pt: 3 }}>
                {renderFilter(values.settings[index]?.userEventType)}
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
