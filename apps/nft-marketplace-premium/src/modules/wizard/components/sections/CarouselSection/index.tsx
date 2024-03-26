import { CarouselPageSection } from '@/modules/wizard/types/section';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Pagination from './Pagination';
import Slide from './Slide';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export interface CarouselProps {
  section: CarouselPageSection;
}

export default function CarouselSection({ section }: CarouselProps) {
  const [index, setIndex] = useState(0);

  const { interval, slides, height } = section.settings;

  const handleChangeIndex = (index: number, indexLatest: number) => {
    setIndex(index);
  };

  const handleNext = () => {
    if (index + 1 === slides?.length) {
      return setIndex(0);
    }

    setIndex((index) => index + 1);
  };

  const handlePrev = () => {
    if (index - 1 === -1) {
      return setIndex(slides?.length - 1);
    }

    setIndex((index) => index - 1);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <AutoPlaySwipeableViews
        index={index}
        onChangeIndex={handleChangeIndex}
        interval={interval ? interval : 5000}
      >
        {slides?.map((slide, index: number) => (
          <Slide
            key={index}
            title={slide.title}
            subtitle={slide.subtitle}
            imageUrl={slide.imageUrl}
            textColor={slide.textColor}
            height={height}
            action={
              slide.action
                ? slide.action.url
                  ? {
                      type: 'link',
                      caption: slide.action?.caption,
                      url: slide.action.url,
                    }
                  : undefined
                : undefined
            }
          />
        ))}
      </AutoPlaySwipeableViews>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
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
      <Pagination
        dots={slides?.length}
        index={index}
        onChangeIndex={(index: number) => {
          setIndex(index);
        }}
      />
    </Box>
  );
}
