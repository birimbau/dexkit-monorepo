import { Box, IconButton, Stack, Typography } from '@mui/material';

import { GatedCondition } from '@dexkit/ui/modules/wizard/types';
import { FormattedMessage } from 'react-intl';

import { useCollection } from '@dexkit/ui/modules/nft/hooks/collection';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

export interface PageGatedConditionsListItemProps {
  condition: GatedCondition;
  index: number;
}

export default function PageGatedConditionsListItem({
  condition,
  index,
}: PageGatedConditionsListItemProps) {
  const [] = [];

  const { data: collection } = useCollection(
    condition.address as string,
    condition.chainId,
  );

  return (
    <Box>
      <Stack spacing={1}>
        {condition.condition && index > 0 && (
          <Typography
            sx={{ textTransform: 'uppercase' }}
            fontWeight="bold"
            color="primary"
          >
            {condition.condition}
          </Typography>
        )}
        <Box
          sx={{
            borderLeft: (theme) => `2px solid ${theme.palette.divider}`,
            px: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography fontWeight="bold" variant="body1">
              <FormattedMessage
                id="condition.index"
                defaultMessage="Condition {index}"
                values={{ index }}
              />
            </Typography>
            <IconButton size="small">
              <EditOutlinedIcon />
            </IconButton>
            <IconButton size="small">
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
          {condition.type === 'collection' && (
            <>
              <Typography
                fontWeight="500"
                variant="body2"
                color="text.secondary"
              >
                <FormattedMessage
                  id="collection.index.message"
                  defaultMessage="Collection: {collection}"
                  values={{
                    collection: (
                      <Typography
                        variant="inherit"
                        component="span"
                        fontWeight="400"
                      >
                        {collection?.name ?? ''}
                      </Typography>
                    ),
                  }}
                />
              </Typography>

              <Typography
                fontWeight="500"
                variant="body2"
                color="text.secondary"
              >
                <FormattedMessage
                  id="required.quantity.index"
                  defaultMessage="Required quantity: {amount}"
                  values={{
                    amount: (
                      <Typography
                        variant="inherit"
                        component="span"
                        fontWeight="400"
                      >
                        {condition.amount}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
