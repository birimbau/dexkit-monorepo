import { Box, Popover } from "@mui/material";
import { TextImproveAction } from "../constants/ai";
import CompletationForm from "./CompletationForm";

export interface CompletationPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  output?: string;
  initialPrompt?: string;
  onClose: () => void;
  onGenerate: (prompt: string, action?: TextImproveAction) => Promise<void>;
  onConfirm: () => void;
}

export default function CompletationPopover({
  open,
  anchorEl,
  output,
  initialPrompt,
  onClose,
  onGenerate,
  onConfirm,
}: CompletationPopoverProps) {
  return (
    <Popover
      onClose={onClose}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      anchorPosition={{ top: 0, left: 0 }}
      sx={(theme) => ({
        [theme.breakpoints.up("sm")]: {
          width: theme.breakpoints.values.lg,
          maxWidth: theme.breakpoints.values.lg,
        },
        width: "100%",
      })}
    >
      <Box sx={{ p: 2 }}>
        <CompletationForm
          onGenerate={onGenerate}
          output={output}
          onConfirm={onConfirm}
          initialPrompt={initialPrompt}
        />
      </Box>
    </Popover>
  );
}
