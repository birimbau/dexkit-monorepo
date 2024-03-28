import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import { SectionRender } from '../section-config/SectionRender';

interface Props {
  sections: AppPageSection[];
}

export function SectionsRenderer({ sections }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sectionsToRender = sections.map((section, key) => {
    if (isMobile && section.hideMobile) {
      return null;
    }
    if (!isMobile && section.hideDesktop) {
      return null;
    }
    return (
      <ErrorBoundary
        key={key}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h6">
              <FormattedMessage
                id="something.went.wrong.with.section.type.contact.support"
                defaultMessage="Oops, something went wrong with section type {sectionType}. Contact support"
                description="Something went wrong error message"
                values={{
                  sectionType: section?.type || ' ',
                }}
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {String(error)}
            </Typography>
            <Button color="primary" onClick={resetErrorBoundary}>
              <FormattedMessage
                id="try.again"
                defaultMessage="Try again"
                description="Try again"
              />
            </Button>
          </Stack>
        )}
      >
        <SectionRender section={section} useLazy={key > 2} />
      </ErrorBoundary>
    );
  });

  return <>{sectionsToRender}</>;
}
