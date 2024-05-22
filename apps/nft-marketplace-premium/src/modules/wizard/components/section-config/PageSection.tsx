import { Box, Card, IconButton, Stack, Typography } from '@mui/material';

import React, { MouseEvent, useState } from 'react';

import DragHandleIcon from '@mui/icons-material/DragHandle';

import { CSS } from '@dnd-kit/utilities';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import MoreVert from '@mui/icons-material/MoreVert';
import dynamic from 'next/dynamic';
import PageSectionMenuStack from './PageSectionMenuStack';

const PageSectionMenu = dynamic(() => import('./PageSectionMenu'));

export interface PageSectionProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  id: string;
  expand?: boolean;
}

export default function PageSection({
  icon,
  title,
  subtitle,
  id,
  expand,
}: PageSectionProps) {
  const hideMobile = false;
  const isVisible = true;
  const hideDesktop = false;

  const { transform, setNodeRef, listeners, attributes } = useDraggable({ id });
  const { isOver, setNodeRef: setNodeRefDrop } = useDroppable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleAction = (action: string) => {};

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <PageSectionMenu
        hideDesktop={hideDesktop}
        hideMobile={hideMobile}
        isVisible={isVisible}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
      />
      <Box
        sx={(theme) => ({
          borderRadius: theme.shape.borderRadius / 2,
          border: isOver
            ? `2px solid ${theme.palette.primary.main}`
            : undefined,
        })}
        ref={setNodeRefDrop}
      >
        <Card style={style} ref={setNodeRef} variant="elevation">
          <Box sx={{ py: 1, px: 2 }}>
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                direction="row"
              >
                {icon}
                <Box>
                  <Typography variant="body1">{subtitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {title}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                {expand ? (
                  <PageSectionMenuStack
                    hideDesktop={hideDesktop}
                    hideMobile={hideMobile}
                    isVisible={isVisible}
                    onAction={handleAction}
                  />
                ) : (
                  <IconButton onClick={handleOpenMenu}>
                    <MoreVert />
                  </IconButton>
                )}

                <DragHandleIcon {...listeners} {...attributes} />
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Box>
    </>
  );
}
