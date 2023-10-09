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
import { AppDialogTitle } from '../../../../../components/AppDialogTitle';
import { BuilderKit } from '../../../constants';
import { AppPageSection, SectionType } from '../../../types/section';
import { SectionFormRender } from '../SectionFormRender';

interface Props {
  dialogProps: DialogProps;
  isEdit: boolean;
  onSave: (section: AppPageSection, index: number) => void;
  index: number;
  section?: AppPageSection;
  builderKit?: BuilderKit;
}

export default function EditSectionDialog({
  dialogProps,
  isEdit,
  onSave,
  index,
  section,
  builderKit,
}: Props) {
  const { onClose } = dialogProps;
  const [sectionType, setSectionType] = useState<SectionType | undefined>(
    section ? section.type : 'video',
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

  const renderSectionType = (sectionType?: SectionType) => {
    return SectionFormRender({
      section,
      sectionType,
      onSave: handleSave,
      onClose: handleClose,
    });
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
                {builderKit !== BuilderKit.Swap && (
                  <MenuItem value="call-to-action">
                    <FormattedMessage
                      id="call.to.action"
                      defaultMessage="Call to action"
                    />
                  </MenuItem>
                )}
                {builderKit !== BuilderKit.Swap && (
                  <MenuItem value="featured">
                    <FormattedMessage id="featured" defaultMessage="Featured" />
                  </MenuItem>
                )}
                {builderKit !== BuilderKit.Swap && (
                  <MenuItem value="collections">
                    <FormattedMessage
                      id="featured"
                      defaultMessage="Collections"
                    />
                  </MenuItem>
                )}
                {builderKit !== BuilderKit.NFT && (
                  <MenuItem value="swap">
                    <FormattedMessage id="swap" defaultMessage="Swap" />
                  </MenuItem>
                )}
                {builderKit !== BuilderKit.Swap && (
                  <MenuItem value="asset-store">
                    <FormattedMessage
                      id="nft.store"
                      defaultMessage="NFT store"
                    />
                  </MenuItem>
                )}
                <MenuItem value="markdown">
                  <FormattedMessage id="markdown" defaultMessage="Markdown" />
                </MenuItem>
                <MenuItem value="wallet">
                  <FormattedMessage id="wallet" defaultMessage="Wallet" />
                </MenuItem>
                <MenuItem value="contract">
                  <FormattedMessage id="contract" defaultMessage="Contract" />
                </MenuItem>
                <MenuItem value="user-contract-form">
                  <FormattedMessage
                    id="User contract form"
                    defaultMessage="User contract form"
                  />
                </MenuItem>
                <MenuItem value="exchange">
                  <FormattedMessage id="exchange" defaultMessage="Exchange" />
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
