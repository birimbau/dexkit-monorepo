import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Remove from "@mui/icons-material/Remove";
import { Box, IconButton, Stack, Typography } from "@mui/material";

export interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function Counter({
  value,
  onIncrement,
  onDecrement,
}: CounterProps) {
  return (
    <Box
      sx={{
        p: 0.5,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton size="small" onClick={onDecrement}>
          {value === 1 ? <Delete /> : <Remove />}
        </IconButton>
        <Typography variant="body1">{value}</Typography>
        <IconButton size="small" onClick={onIncrement}>
          <Add />
        </IconButton>
      </Stack>
    </Box>
  );
}
