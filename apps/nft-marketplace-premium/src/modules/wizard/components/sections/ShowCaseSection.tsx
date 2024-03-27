import { ShowCasePageSection } from '@/modules/wizard/types/section';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Card, CardContent, IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

export interface ShowCaseSectionProps {
  section: ShowCasePageSection;
}

export default function ShowCaseSection({ section }: ShowCaseSectionProps) {
  const [index, setIndex] = useState(0);

  const { items } = section.settings;

  const handleChangeIndex = (index: number, indexLatest: number) => {
    setIndex(index);
  };

  const handleNext = () => {
    if (index + 1 === items?.length) {
      return setIndex(0);
    }

    setIndex((index) => index + 1);
  };

  const handlePrev = () => {
    if (index - 1 === -1) {
      return setIndex(items?.length - 1);
    }

    setIndex((index) => index - 1);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
        {items?.map((item, index: number) => (
          <Card key={index}>
            <CardContent>{index}</CardContent>
          </Card>
        ))}
      </SwipeableViews>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          p: 4,
        }}
      >
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          sx={{ height: '100%', width: '100%' }}
        >
          <IconButton onClick={handlePrev} size="large">
            <KeyboardArrowLeftIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={handleNext} size="large">
            <KeyboardArrowRightIcon fontSize="large" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
