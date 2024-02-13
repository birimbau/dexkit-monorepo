import { Box, Grid, Skeleton, Stack } from "@mui/material";
import ImageButton from "./ImageButton";

export interface VariantsGridProps {
  gridSize: number;
  amount: number;
  onOpenMenu: (url: string, anchorEl: HTMLElement | null) => void;
  onSelect: (url: string) => void;
  selectable: boolean;
  selected: { [key: string]: boolean };
  isLoading?: boolean;
  images: string[];
}

export default function VariantsGrid({
  gridSize,
  onSelect,
  onOpenMenu,
  selectable,
  selected,
  isLoading,
  amount,
  images,
}: VariantsGridProps) {
  return (
    <Stack spacing={1}>
      <Box>
        <Grid spacing={2} container justifyContent="center">
          {images.map((img: string, index: number) => (
            <Grid key={index} item xs={12} sm={gridSize}>
              <ImageButton
                src={img}
                onOpenMenu={onOpenMenu}
                selected={selected[img]}
                onSelect={onSelect}
                selectable={selectable}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {isLoading && (
        <Box>
          <Grid spacing={2} container justifyContent="center">
            {new Array(amount).fill(null).map((_, index: number) => (
              <Grid key={index} item xs={12} sm={gridSize}>
                <Skeleton
                  variant="rectangular"
                  sx={{
                    aspectRatio: "1/1",
                    width: "100%",
                    minHeight: (theme) => theme.spacing(20),
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );
}
