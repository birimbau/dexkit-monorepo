import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import React, { KeyboardEvent, MouseEvent, useRef, useState } from 'react';

import DragIndicatorIcon from '@mui/icons-material/DragIndicatorOutlined';

import { CSS } from '@dnd-kit/utilities';

import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CheckOutlined, CloseOutlined } from '@mui/icons-material';
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
  onChangeName: (name: string) => void;
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
  onChangeName,
  section,
  active,
}: PageSectionProps) {
  const { transform, setNodeRef, listeners, attributes, isDragging } =
    useDraggable({ id });
  const { isOver, setNodeRef: setNodeRefDrop } = useDroppable({ id });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [isVisible, setVisible] = useState(false);

  const handleToggleVisibility = () => {
    setVisible((value) => !value);
  };

  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState(section?.name || section?.title);

  const handleEdit = () => {
    setIsEdit(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleStopPropagation = (cb: () => void) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      return cb();
    };
  };

  const handleSave = () => {
    if (name) {
      onChangeName(name);
    }

    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setName(section?.name || section?.title);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
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
        >
          <CardActionArea onClick={() => onAction('edit')}>
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
                  <Tooltip
                    title={
                      <FormattedMessage
                        id="drag.to.reorder"
                        defaultMessage="Drag to reorder"
                      />
                    }
                  >
                    <DragIndicatorIcon {...listeners} {...attributes} />
                  </Tooltip>
                  <Box>
                    {isEdit ? (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <TextField
                          value={name}
                          inputRef={(ref) => (inputRef.current = ref)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setName(e.target.value)}
                          variant="standard"
                          size="small"
                          onKeyDown={handleKeyDown}
                        />
                        <IconButton
                          size="small"
                          onClick={handleStopPropagation(handleSave)}
                        >
                          <CheckOutlined />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={handleStopPropagation(handleCancel)}
                        >
                          <CloseOutlined />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Box>
                        <Link
                          variant="body1"
                          underline="none"
                          sx={{ cursor: 'pointer' }}
                          onClick={handleStopPropagation(handleEdit)}
                          color="text.primary"
                        >
                          {title}
                        </Link>

                        <Typography variant="body2" color="text.secondary">
                          {subtitle}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {expand && section ? (
                    <Box pr={4}>
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
                </Stack>
              </Stack>
            </Box>
          </CardActionArea>
          {isVisible && section && (
            <PreviewPagePlatform sections={[section]} disabled={true} />
          )}
        </Card>
      </Box>
    </>
  );
}
