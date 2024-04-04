import { CarouselPageSection } from "@dexkit/ui/modules/wizard/types/section";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Pagination from "./Pagination";
import Slide from "./Slide";

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
    <Box sx={{ position: "relative" }}>
      <Stack
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        sx={{ height: "100%", width: "100%" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            width: "auto",
            zIndex: 100,
          }}
        >
          <IconButton onClick={handlePrev} size="large">
            <KeyboardArrowLeftIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, marginRight: (theme) => -theme.spacing(16) }}>
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
                overlayColor={slide.overlayColor}
                overlayPercentage={slide.overlayPercentage}
                action={slide.action}
              />
            ))}
          </AutoPlaySwipeableViews>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            width: "auto",
            zIndex: 100,
          }}
        >
          <IconButton onClick={handleNext} size="large">
            <KeyboardArrowRightIcon fontSize="large" />
          </IconButton>
        </Box>
      </Stack>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          bottom: (theme) => theme.spacing(4),
        }}
      >
        <Pagination
          dots={slides?.length}
          index={index}
          onChangeIndex={(index: number) => {
            setIndex(index);
          }}
        />
      </Box>
    </Box>
  );
}
