import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Typography,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

export default function SidebarFiltersContent({ children }: Props) {
  return <Box sx={{ p: 2 }}>{children}</Box>;
}
