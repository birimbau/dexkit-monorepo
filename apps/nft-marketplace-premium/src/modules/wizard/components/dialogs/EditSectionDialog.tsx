import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppDialogTitle } from '../../../../components/AppDialogTitle';
import { AppPageSection } from '../../../../types/config';
import { AssetStoreSectionForm } from '../forms/AssetStoreSectionForm';
import CallToActionSectionForm from '../forms/CallToActionSectionForm';
import CollectionSectionForm from '../forms/CollectionSectionForm';
import FeaturedSectionForm from '../forms/FeaturedSectionForm';
import { SwapConfigSectionForm } from '../forms/SwapConfigSectionForm';
import VideoSectionForm from '../forms/VideoSectionForm';

interface Props {
  dialogProps: DialogProps;
  isEdit: boolean;
  onSave: (section: AppPageSection, index: number) => void;
  index: number;
  section?: AppPageSection;
}

type SectionType =
  | 'video'
  | 'call-to-action'
  | 'featured'
  | 'collections'
  | 'swap'
  | 'custom'
  | 'asset-store';

export default function EditSectionDialog({
  dialogProps,
  isEdit,
  onSave,
  index,
  section,
}: Props) {
  const { onClose } = dialogProps;
  const [sectionType, setSectionType] = useState<SectionType | undefined>(
    section ? section.type : 'video'
  );

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setSectionType(undefined);
    }
  };

  const handleChangeSectionType = (e: SelectChangeEvent<SectionType>) => {
    setSectionType(e.target.value as SectionType);
  };

  const handleSave = (section: AppPageSection) => {
    onSave(section, index);
    handleClose();
  };

  const renderSectionType = (sectionType?: string) => {
    if (sectionType === 'video') {
      return (
        <VideoSectionForm
          onSave={handleSave}
          onCancel={handleClose}
          section={section?.type === 'video' ? section : undefined}
        />
      );
    } else if (sectionType === 'call-to-action') {
      return (
        <CallToActionSectionForm
          onSave={handleSave}
          onCancel={handleClose}
          section={section?.type === 'call-to-action' ? section : undefined}
        />
      );
    } else if (sectionType === 'featured') {
      return (
        <FeaturedSectionForm
          onCancel={handleClose}
          onSave={handleSave}
          section={section?.type === 'featured' ? section : undefined}
        />
      );
    } else if (sectionType === 'collections') {
      return (
        <CollectionSectionForm
          onCancel={handleClose}
          onSave={handleSave}
          section={section?.type === 'collections' ? section : undefined}
        />
      );
    } else if (sectionType === 'swap') {
      return (
        <SwapConfigSectionForm
          onCancel={handleClose}
          onSave={handleSave}
          section={section?.type === 'swap' ? section : undefined}
        />
      );
    } else if (sectionType === 'asset-store') {
      return (
        <AssetStoreSectionForm
          onCancel={handleClose}
          onSave={handleSave}
          section={section?.type === 'asset-store' ? section : undefined}
        />
      );
    }

    return null;
  };

  useEffect(() => {
    if (section) {
      setSectionType(section.type);
    }
  }, [section]);

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          isEdit ? (
            <FormattedMessage id="edit.section" defaultMessage="Edit Section" />
          ) : (
            <FormattedMessage id="add.section" defaultMessage="Add Section" />
          )
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>
                <FormattedMessage
                  id="section.type"
                  defaultMessage="Section type"
                />
              </InputLabel>
              <Select
                label={
                  <FormattedMessage
                    id="section.type"
                    defaultMessage="Section type"
                  />
                }
                fullWidth
                value={sectionType}
                onChange={handleChangeSectionType}
              >
                <MenuItem value="video">
                  <FormattedMessage id="video" defaultMessage="Video" />
                </MenuItem>
                <MenuItem value="call-to-action">
                  <FormattedMessage
                    id="call.to.action"
                    defaultMessage="Call to action"
                  />
                </MenuItem>
                <MenuItem value="featured">
                  <FormattedMessage id="featured" defaultMessage="Featured" />
                </MenuItem>
                <MenuItem value="collections">
                  <FormattedMessage
                    id="featured"
                    defaultMessage="Collections"
                  />
                </MenuItem>
                <MenuItem value="swap">
                  <FormattedMessage id="swap" defaultMessage="Swap" />
                </MenuItem>
                <MenuItem value="asset-store">
                  <FormattedMessage id="nft.store" defaultMessage="NFT store" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {renderSectionType(sectionType)}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
