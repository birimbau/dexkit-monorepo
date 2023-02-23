import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { FormattedMessage } from 'react-intl';
import { HELP_FIELD_TEXT } from '../constants';

interface Props {
  field:
    | 'email'
    | 'name'
    | 'domain'
    | 'favicon.url'
    | 'logo.url'
    | 'custom.primary.color'
    | 'custom.secondary.color'
    | 'custom.background.default.color'
    | 'custom.text.primary.color';
}

export function TooltipInfo(props: Props) {
  const { field } = props;
  return (
    <Tooltip
      title={
        <FormattedMessage
          id={`wizard.field.${field}`}
          defaultMessage={HELP_FIELD_TEXT[field || 'email'] || ''}
          values={{ br: <br /> }}
        />
      }
      placement="bottom-start"
    >
      <IconButton aria-label={`info`} edge="end">
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
}

export default function InputInfoAdornment(props: Props) {
  const { field } = props;

  return (
    <InputAdornment position="end">
      <TooltipInfo field={field} />
    </InputAdornment>
  );
}
