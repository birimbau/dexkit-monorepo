import { ChainId } from '@dexkit/core';
import { getBlockExplorerUrl } from '@dexkit/widgets/src/utils';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AppMutationDialog from 'src/components/dialogs/AppMutationDialog';
import { LoginAppButton } from 'src/components/LoginAppButton';
import {
  useAuthUserQuery,
  useClaimCampaignMutation,
  useUserClaimCampaignQuery,
} from '../hooks';
export function UserAirdrop() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const authUserQuery = useAuthUserQuery();
  const authUser = authUserQuery.data;
  const claimCampaignMutation = useClaimCampaignMutation();
  const claimCampaignQuery = useUserClaimCampaignQuery();
  const postData = claimCampaignMutation.data;
  const needToCompleteProfile =
    !authUser?.discordVerified ||
    !authUser?.twitterVerified ||
    !authUser?.username;

  const claimData = claimCampaignQuery?.data;
  return (
    <>
      <AppMutationDialog
        dialogProps={{
          open: open,
          onClose: () => setOpen(false),
        }}
        isError={claimCampaignMutation.isError}
        isLoading={claimCampaignMutation.isLoading}
        isSuccess={claimCampaignMutation.isSuccess}
        title={
          <FormattedMessage
            id="claim.kit.airdrop"
            defaultMessage={'Claim KIT airdrop'}
          />
        }
        successBlock={
          <>
            <Typography variant="h5">
              <FormattedMessage
                id="kit.claim.submitted"
                defaultMessage={'KIT claim submitted'}
              />
              !
            </Typography>
            <Typography variant="body1" align={'center'}>
              <FormattedMessage
                id="claim.submitted.wait.for.transaction.confirm.onchain.to.receive.airdropped.kit"
                defaultMessage={
                  'Your claim has been submitted. Please wait for the transaction to be confirmed on the blockchain to receive your airdropped KIT!'
                }
              />
              !
            </Typography>
            {postData && (
              <Button
                variant={'contained'}
                color="primary"
                href={`${getBlockExplorerUrl(ChainId.Polygon)}/tx/${
                  postData.txHash
                }`}
                target="_blank"
              >
                <FormattedMessage
                  id="view.transaction"
                  defaultMessage="View Transaction"
                  description="View transaction"
                />
              </Button>
            )}
            <Button
              variant={'contained'}
              color={'inherit'}
              onClick={async () => {
                setOpen(false);
              }}
            >
              <FormattedMessage
                id="close.modal"
                defaultMessage={'Close modal'}
              />
            </Button>
          </>
        }
        loadingBlock={
          <Typography variant="h5">
            <FormattedMessage
              id="sending.airdrop.to.your.wallet"
              defaultMessage={'Sending airdrop to your wallet'}
            />
          </Typography>
        }
        errorBlock={
          <>
            <Typography variant="h5">
              {(claimCampaignMutation.error as any)?.response?.data
                ?.statusCode === 403 ? (
                <FormattedMessage id="forbidden" defaultMessage={'Forbidden'} />
              ) : (
                <FormattedMessage id="error" defaultMessage={'Error'} />
              )}
            </Typography>
            <Typography variant="body1">
              <FormattedMessage
                id="error.reason"
                defaultMessage={'Error reason: {value}'}
                values={{
                  value: (claimCampaignMutation.error as any)?.response?.data
                    ?.message,
                }}
              />
            </Typography>
            <Button
              variant={'contained'}
              onClick={async () => {
                claimCampaignMutation.mutate();
              }}
            >
              <FormattedMessage id="try.gain" defaultMessage={'Try again'} />
            </Button>
          </>
        }
      />
      <Grid container spacing={2} justifyContent={'center'} alignItems="center">
        <Grid item xs={12}>
          <Box display={'flex'} justifyContent={'center'}>
            <Typography variant="h6">
              <FormattedMessage
                id="airdrop.user.info"
                defaultMessage={
                  'Airdrop for users that complete profile and connect to both Discord and Twitter'
                }
              />
            </Typography>
          </Box>
        </Grid>
        {!claimData?.status && (
          <Grid item xs={12}>
            <Box display={'flex'} justifyContent={'center'}>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    <FormattedMessage
                      id="airdrop.requirements"
                      defaultMessage={'Airdrop requirements'}
                    />
                  </ListSubheader>
                }
              >
                <ListItem>
                  <ListItemIcon>
                    {authUser?.username && <DoneIcon color={'success'} />}
                    {!authUser?.username && <CloseIcon color={'error'} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="complete.user.profile"
                        defaultMessage={'Complete user profile'}
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {authUser?.discordVerified && (
                      <DoneIcon color={'success'} />
                    )}
                    {!authUser?.discordVerified && (
                      <CloseIcon color={'error'} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="verify.discord"
                        defaultMessage={'Verify Discord'}
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {authUser?.twitterVerified && (
                      <DoneIcon color={'success'} />
                    )}
                    {!authUser?.twitterVerified && (
                      <CloseIcon color={'error'} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="verify.discord"
                        defaultMessage={'Verify Twitter'}
                      />
                    }
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
        )}
        {needToCompleteProfile && authUser && (
          <Grid item xs={12}>
            <Box display={'flex'} justifyContent={'center'}>
              <Button
                variant={'contained'}
                onClick={() => {
                  router.push('/u/edit');
                }}
              >
                <FormattedMessage
                  id="complete.profile"
                  defaultMessage={'Complete Profile'}
                />
              </Button>
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box display={'flex'} justifyContent={'center'}>
            {!authUser && <LoginAppButton />}
          </Box>
        </Grid>

        {!claimCampaignQuery.isLoading && !claimData && authUser && (
          <Grid item xs={12}>
            <Box display={'flex'} justifyContent={'center'}>
              <Button
                variant={'contained'}
                onClick={async () => {
                  setOpen(true);
                  claimCampaignMutation.mutate();
                }}
              >
                <FormattedMessage
                  id="claim.airdrop"
                  defaultMessage={'Claim Airdrop'}
                />
              </Button>
            </Box>
          </Grid>
        )}

        {claimData && (
          <Grid item xs={12}>
            <Stack spacing={2} justifyContent={'start'} alignItems={'center'}>
              <CelebrationIcon color={'success'} sx={{ fontSize: 80 }} />
              <Typography variant="h6">
                <FormattedMessage
                  id="congrats.you.claimed.your.kit.airdrop"
                  defaultMessage={'Congrats you claimed your KIT airdrop'}
                />
                !
              </Typography>
              <Typography variant="subtitle2">
                <FormattedMessage id="status" defaultMessage={'Status'} />:{' '}
                <b>{claimData?.status.toUpperCase()}</b>
              </Typography>
              <Button
                variant={'contained'}
                color="primary"
                href={`${getBlockExplorerUrl(ChainId.Polygon)}/tx/${
                  claimData.txHash
                }`}
                target="_blank"
              >
                <FormattedMessage
                  id="view.transaction"
                  defaultMessage="View Transaction"
                  description="View transaction"
                />
              </Button>
            </Stack>
          </Grid>
        )}
      </Grid>
    </>
  );
}
