import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Box,
  Card,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import {
  AppPageSection,
  SectionType,
} from '@dexkit/ui/modules/wizard/types/section';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { FormattedMessage } from 'react-intl';

import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { useIsMobile } from '@dexkit/ui/hooks/misc';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Search from '@mui/icons-material/Search';
import { useMemo, useState } from 'react';
import { SECTION_CONFIG } from '../../constants/sections';
import { PageSectionKey } from '../../hooks/sections';
import PageSection from './PageSection';
import PageSectionsHeader from './PageSectionsHeader';

function getSectionType(section: AppPageSection) {
  const config = SECTION_CONFIG[section.type];
  if (config) {
    return {
      subtitle: config.title,
      title:
        section.type === 'custom' && !section.name && !section.title ? (
          <FormattedMessage
            id="custom.section"
            defaultMessage="Custom Section"
          />
        ) : section.name ? (
          section.name
        ) : (
          section.title || ''
        ),
      icon: config.icon,
    };
  }
  return null;
}

export interface PageSectionsProps {
  page: AppPage;
  onSwap: (index: number, other: number) => void;
  onAction: (action: string, index: number) => void;
  onClose: () => void;
  onClone: () => void;
  onEditTitle: (page: string, title: string) => void;
  onAdd: () => void;
  onPreview: () => void;
  activeSection?: PageSectionKey;
  pageKey?: string;
}

export default function PageSections({
  page,
  pageKey,
  onSwap,
  onAction,
  onClose,
  onAdd,
  onEditTitle,
  onClone,
  activeSection,
  onPreview,
}: PageSectionsProps) {
  const isMobile = useIsMobile();

  const [hideDesktop, setHideDesktop] = useState(true);
  const [hideMobile, setHideMobile] = useState(true);

  const [showFilters, setShowFilters] = useState(false);

  const [sectionType, setSectionType] = useState<SectionType>(
    '' as SectionType
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over) {
      onSwap(
        parseInt(event.active.id.toString()),
        parseInt(event.over?.id.toString())
      );
    }
  };

  const handleAction = (index: number) => {
    return (action: string) => {
      onAction(action, index);
    };
  };

  const [query, setQuery] = useState('');

  const handleChangeQuery = (value: string) => {
    setQuery(value);
  };

  const filteredSections = useMemo(() => {
    return page.sections?.filter((s) => {
      const hasTitle =
        s && s.title && s.title.toLowerCase()?.search(query.toLowerCase()) > -1;
      const hasName =
        s && s.name && s.name.toLowerCase()?.search(query.toLowerCase()) > -1;
      const hasType =
        s && s.type.toLowerCase()?.search(query.toLowerCase()) > -1;

      const filter = hasTitle || hasType || hasName || query === '';

      if (!hideDesktop && s.hideDesktop) {
        return false;
      }

      if (!hideMobile && s.hideMobile) {
        return false;
      }

      if ((sectionType as string) !== '') {
        return filter && sectionType === s.type;
      }

      return filter;
    });
  }, [
    JSON.stringify(page.sections),
    query,
    hideDesktop,
    hideMobile,
    sectionType,
  ]);

  return (
    <Box>
      <Stack spacing={2}>
        <PageSectionsHeader
          onClose={onClose}
          onPreview={onPreview}
          onClone={onClone}
          onEditTitle={(title) => {
            if (pageKey) {
              onEditTitle(pageKey, title);
            }
          }}
          page={page}
        />
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontWeight="400" variant="h6">
              <FormattedMessage
                id="page.sections"
                defaultMessage="Page Sections"
              />
            </Typography>
            <IconButton onClick={() => setShowFilters((value) => !value)}>
              {showFilters ? <FilterAltOffIcon /> : <FilterAltIcon />}
            </IconButton>
          </Stack>
          <LazyTextField
            onChange={handleChangeQuery}
            value={query}
            TextFieldProps={{
              size: 'small',
              variant: 'standard',
              value: query,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
        {showFilters && (
          <Collapse in={showFilters}>
            <Card>
              <Box p={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel shrink>
                        <FormattedMessage
                          id="section.type"
                          defaultMessage="Section Type"
                        />
                      </InputLabel>
                      <Select
                        notched
                        onChange={(e) =>
                          setSectionType(e.target.value as SectionType)
                        }
                        value={sectionType}
                        label={
                          <FormattedMessage
                            id="section.type"
                            defaultMessage="Section Type"
                          />
                        }
                        renderValue={(value) => {
                          if ((value as string) === '') {
                            return (
                              <FormattedMessage id="all" defaultMessage="All" />
                            );
                          }

                          return (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              {SECTION_CONFIG[value as SectionType]?.icon}
                              <Typography>
                                {SECTION_CONFIG[value as SectionType]?.title}
                              </Typography>
                            </Stack>
                          );
                        }}
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="">
                          <ListItemText
                            primary={
                              <FormattedMessage id="all" defaultMessage="All" />
                            }
                          />
                        </MenuItem>
                        {Object.keys(SECTION_CONFIG)
                          .filter(
                            (key) =>
                              SECTION_CONFIG[key as SectionType].title !==
                              undefined
                          )
                          .map((key) => (
                            <MenuItem value={key} key={key}>
                              <ListItemIcon>
                                {SECTION_CONFIG[key as SectionType].icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  SECTION_CONFIG[key as SectionType].title
                                }
                              />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl>
                      <FormLabel component="legend">
                        <FormattedMessage
                          id="show.hidden"
                          defaultMessage="Show Hidden"
                        />
                      </FormLabel>
                      <FormGroup aria-label="position" row>
                        <FormControlLabel
                          value="end"
                          control={<Checkbox />}
                          label={
                            <FormattedMessage
                              id="desktop"
                              defaultMessage="Desktop"
                            />
                          }
                          checked={hideDesktop}
                          onChange={(e, checked) => setHideDesktop(checked)}
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="end"
                          control={<Checkbox />}
                          label={
                            <FormattedMessage
                              id="mobile"
                              defaultMessage="Mobile"
                            />
                          }
                          onChange={(e, checked) => setHideMobile(checked)}
                          checked={hideMobile}
                          labelPlacement="end"
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Collapse>
        )}

        <Box>
          <DndContext onDragEnd={handleDragEnd}>
            <Grid container spacing={2}>
              {filteredSections?.map((section, index) => (
                <Grid item xs={12} key={index}>
                  <PageSection
                    expand={!isMobile}
                    icon={getSectionType(section)?.icon}
                    title={getSectionType(section)?.title}
                    subtitle={getSectionType(section)?.subtitle}
                    id={index.toString()}
                    onAction={handleAction(index)}
                    section={section}
                    active={
                      pageKey !== undefined &&
                      activeSection !== undefined &&
                      activeSection?.index === index &&
                      pageKey === activeSection.page
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </DndContext>
        </Box>
      </Stack>
    </Box>
  );
}
