import SwapWidget from '@/modules/wizard/components/pageEditor/components/SwapWidget';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { SwapPageSection } from '../../../types/config';

interface Props {
  section: SwapPageSection;
}

export function SwapSection({ section }: Props) {
  return (
    <Box py={8}>
      <Container maxWidth={'sm'}>
        <SwapWidget formData={section.config} />
      </Container>
    </Box>
  );
}

export default SwapSection;
