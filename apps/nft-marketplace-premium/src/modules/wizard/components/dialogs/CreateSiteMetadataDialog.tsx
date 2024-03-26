import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { AppDialogTitle } from 'src/components/AppDialogTitle';
import { AssetAPI } from 'src/types/nft';

interface Props {
  dialogProps: DialogProps;
  isLoading?: boolean;
  isDone?: boolean;
  isError?: boolean;
  asset?: AssetAPI;
}

export default function CreateSiteMetadataDialog({
  dialogProps,
  isError,
  isLoading,
  isDone,
  asset,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="creating.site.metadata"
            defaultMessage="Creating site metadata"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Box p={2}>
          <Stack
            spacing={2}
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <List disablePadding>
              <ListItem divider>
                <ListItemAvatar>
                  {isLoading && (
                    <CircularProgress color="primary" size="2rem" />
                  )}
                  {isDone && <CheckCircle color="success" fontSize="large" />}
                  {isError && <ErrorIcon color="error" fontSize="large" />}
                </ListItemAvatar>
                <ListItemText>
                  {!(isLoading || isDone || isError) && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="creating.site.metadata"
                          defaultMessage="Creating site metadata"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isLoading && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="creating.site.metadata"
                          defaultMessage="Creating site metadata"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="creating.site.metadata"
                          defaultMessage="Creating site metadata"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isDone && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="site.metadata.created"
                          defaultMessage="Site metadata created"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.site.metadata.were.created"
                          defaultMessage="Your site metadata were created"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isError && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="site.metadata.created.error"
                          defaultMessage="Site metadata created error"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.site.metadata.were.not.created"
                          defaultMessage="Your site metadata were not created"
                        />
                      </Typography>
                    </Box>
                  )}
                </ListItemText>
              </ListItem>
            </List>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
