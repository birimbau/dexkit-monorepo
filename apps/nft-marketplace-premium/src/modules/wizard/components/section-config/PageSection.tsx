import {
  Box,
  Card,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import React, { MouseEvent, useState } from 'react';

import DragHandleIcon from '@mui/icons-material/DragHandle';

import { CSS } from '@dnd-kit/utilities';

import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import MoreVert from '@mui/icons-material/MoreVert';
import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
import PreviewPagePlatform from '../PreviewPagePlatform';
import PageSectionMenuStack from './PageSectionMenuStack';

const PageSectionMenu = dynamic(() => import('./PageSectionMenu'));

export interface PageSectionProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  id: string;
  expand?: boolean;
  onAction: (action: string) => void;
  section?: AppPageSection;
  active?: boolean;
}

export default function PageSection({
  icon,
  title,
  subtitle,
  id,
  expand,
  onAction,
  section,
  active,
}: PageSectionProps) {
  const { transform, setNodeRef, listeners, attributes, isDragging } =
    useDraggable({ id });
  const { isOver, setNodeRef: setNodeRefDrop } = useDroppable({ id });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [isVisible, setVisible] = useState(false);

  const handleToggleVisibility = () => {
    setVisible((value) => !value);
  };

  return (
    <>
      {anchorEl && section && (
        <PageSectionMenu
          hideDesktop={section?.hideDesktop}
          hideMobile={section?.hideMobile}
          isVisible={isVisible}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
        />
      )}

      <Box
        sx={(theme) => ({
          borderRadius: theme.shape.borderRadius / 2,
          border: isOver
            ? `2px solid ${theme.palette.primary.main}`
            : undefined,
        })}
        ref={setNodeRefDrop}
      >
        <Card
          sx={{
            border: active
              ? (theme) => `2px solid ${theme.palette.primary.main}`
              : undefined,
            transform: CSS.Translate.toString(transform),
            zIndex: isDragging
              ? (theme) => theme.zIndex.snackbar + 1
              : undefined,
          }}
          ref={setNodeRef}
          variant="elevation"
        >
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
                <Box>
                  <Typography variant="body1">{title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                {expand && section ? (
                  <Box pr={8}>
                    <PageSectionMenuStack
                      hideDesktop={section?.hideDesktop}
                      hideMobile={section?.hideMobile}
                      isVisible={isVisible}
                      onAction={onAction}
                      onToggleVisibilty={handleToggleVisibility}
                    />
                  </Box>
                ) : (
                  <IconButton onClick={handleOpenMenu}>
                    <MoreVert />
                  </IconButton>
                )}

                <Tooltip
                  title={
                    <FormattedMessage
                      id="drag.section"
                      defaultMessage="Drag section"
                    />
                  }
                >
                  <DragHandleIcon {...listeners} {...attributes} />
                </Tooltip>
              </Stack>
            </Stack>
          </Box>
          {isVisible && section && (
            <PreviewPagePlatform sections={[section]} disabled={true} />
          )}
        </Card>
      </Box>
    </>
  );
}
