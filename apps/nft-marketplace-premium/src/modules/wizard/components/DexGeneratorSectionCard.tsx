import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';

export interface DexGeneratorSectionCardProps {
  id: number;
  name?: string;
  selected?: boolean;
  onClick: () => void;
  type?: string;
}

export default function DexGeneratorSectionCard({
  id,
  name,
  selected,
  onClick,
  type,
}: DexGeneratorSectionCardProps) {
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Box>
            {type && (
              <Typography variant="caption" color="primary" component="div">
                {type.toUpperCase()}
              </Typography>
            )}
            <Typography variant="body1" fontWeight="bold">
              {name}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
