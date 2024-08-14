import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Remove from "@mui/icons-material/Remove";
import { IconButton, Stack, Typography } from "@mui/material";

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
    <Stack direction="row" alignItems="center" spacing={2}>
      <IconButton onClick={onIncrement}>
        <Add />
      </IconButton>
      <Typography variant="body1">{value}</Typography>
      <IconButton onClick={onDecrement}>
        {value === 1 ? <Delete /> : <Remove />}
      </IconButton>
    </Stack>
  );
}
