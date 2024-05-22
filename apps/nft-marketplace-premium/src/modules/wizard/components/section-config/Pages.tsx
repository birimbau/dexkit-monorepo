import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import { Box, Grid } from '@mui/material';
import { useMemo, useState } from 'react';
import Page from './Page';
import PageSections from './PageSections';

export interface PagesProps {
  pages: {
    [key: string]: AppPage;
  };
}

export default function Pages({ pages }: PagesProps) {
  const keys = useMemo(() => {
    return Object.keys(pages);
  }, [pages]);

  const [selectedKey, setSelectedKey] = useState<string>();

  const handleSelect = (id: string) => {
    return () => {
      setSelectedKey(id);
    };
  };

  if (selectedKey) {
    return <PageSections page={pages[selectedKey]} />;
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {keys.map((pageKey, index) => (
          <Grid item xs={12} key={index}>
            <Page
              page={pages[pageKey]}
              index={index}
              onSelect={handleSelect(pageKey)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
