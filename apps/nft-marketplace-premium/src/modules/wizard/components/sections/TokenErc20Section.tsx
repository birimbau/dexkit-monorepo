import { Box, Container, Grid, Stack } from '@mui/material';
import { useContract } from '@thirdweb-dev/react';
import { TokenErc20PageSection } from '../../types/section';

export interface TokenErc20SectionProps {
  section: TokenErc20PageSection;
}

export default function TokenErc20Section({ section }: TokenErc20SectionProps) {
  const { address, network } = section.settings;

  const { data: contract } = useContract(address, 'custom');

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <Stack></Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
