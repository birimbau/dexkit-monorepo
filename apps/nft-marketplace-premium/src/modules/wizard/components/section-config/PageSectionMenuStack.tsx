import { IconButton, Stack, Tooltip } from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SECTION_MENU_OPTIONS } from '../../constants/sections';

export interface PropsPageSectionMenuStack {
  hideMobile: boolean;
  isVisible: boolean;
  hideDesktop: boolean;
  onAction: (action: string) => void;
}
export default function PageSectionMenuStack({
  hideMobile,
  isVisible,
  hideDesktop,
  onAction,
}: PropsPageSectionMenuStack) {
  const menuArr = useMemo(() => {
    return SECTION_MENU_OPTIONS({ hideMobile, hideDesktop, isVisible });
  }, [hideMobile, hideDesktop, isVisible]);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {menuArr.map((item, index) => (
        <IconButton key={index} onClick={() => onAction(item.value)}>
          <Tooltip
            title={
              <FormattedMessage
                id={item.title.id}
                defaultMessage={item.title.defaultMessage}
              />
            }
          >
            {item.icon}
          </Tooltip>
        </IconButton>
      ))}
    </Stack>
  );
}
