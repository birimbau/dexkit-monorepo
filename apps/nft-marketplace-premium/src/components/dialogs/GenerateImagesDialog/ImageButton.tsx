import CheckCircle from '@mui/icons-material/CheckCircle';
import { CardActionArea, Paper } from '@mui/material';

export interface ImageButtonProps {
  selected?: boolean;
  src: string;
  onSelect: (url: string) => void;
}

export default function ImageButton({
  selected,
  src,
  onSelect,
}: ImageButtonProps) {
  return (
    <Paper
      sx={{
        borderWidth: selected ? (theme) => 1 : undefined,
        borderColor: selected
          ? (theme) => theme.palette.primary.main
          : undefined,
      }}
    >
      <CardActionArea
        onClick={() => onSelect(src)}
        sx={{
          position: 'relative',
        }}
      >
        <img
          src={src}
          style={{
            display: 'block',

            filter: selected ? 'grayscale(50%)' : undefined,
            width: '100%',
            aspectRatio: '1/1',
          }}
        />

        {selected && (
          <CheckCircle
            sx={{
              position: 'absolute',
              right: (theme) => theme.spacing(1),
              top: (theme) => theme.spacing(1),
              color: (theme) => theme.palette.primary.main,
              filter: 'opacity(80%)',
            }}
          />
        )}
      </CardActionArea>
    </Paper>
  );
}
