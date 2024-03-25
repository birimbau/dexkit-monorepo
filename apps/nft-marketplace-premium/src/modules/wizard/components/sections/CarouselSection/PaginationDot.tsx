import { IconButton } from "@mui/material";

export interface PaginationDotProps {
  active?: boolean;
  onClick: () => void;
}

export default function PaginationDot({ active, onClick }: PaginationDotProps) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        borderRadius: "50%",
        borderWidth: 2,
        width: (theme) => theme.spacing(2),
        height: (theme) => theme.spacing(2),
        borderColor: (theme) => theme.palette.common.white,
        backgroundColor: (theme) =>
          active ? theme.palette.primary.main : theme.palette.primary.light,
      }}
    />
  );
}
