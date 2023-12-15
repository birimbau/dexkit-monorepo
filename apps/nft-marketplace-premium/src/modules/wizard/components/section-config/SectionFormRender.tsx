import { DexkitApiProvider } from '@dexkit/core/providers';
import { Box } from '@mui/material';
import { myAppsApi } from 'src/services/whitelabel';
import { AppPageSection, SectionType } from '../../types/section';
import AssetSectionForm from '../forms/AssetSectionForm';
import { AssetStoreSectionForm } from '../forms/AssetStoreSectionForm';
import CallToActionSectionForm from '../forms/CallToActionSectionForm';
import CodeSectionForm from '../forms/CodeSectionForm';
import CollectionSectionForm from '../forms/CollectionSectionForm';
import CollectionSectionFormAlt from '../forms/CollectionSectionFormAlt';
import { ContractSectionForm } from '../forms/ContractSectionForm';
import DexGeneratorSectionForm from '../forms/DexGeneratorSectionForm';
import ExchangeSectionSettingsForm from '../forms/ExchangeSectionSettingsForm';
import FeaturedSectionForm from '../forms/FeaturedSectionForm';
import MDSectionForm from '../forms/MDSectionForm';
import { SwapConfigSectionForm } from '../forms/SwapConfigSectionForm';
import { UserContractForm } from '../forms/UserContractForm';
import VideoSectionForm from '../forms/VideoSectionForm';
import WalletSectionForm from '../forms/WalletSectionForm';

interface Props {
  sectionType: SectionType | undefined;
  section: AppPageSection | undefined;
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onClose: () => void;
}

export function SectionFormRender({
  section,
  sectionType,
  onSave,
  onChange,
  onClose,
}: Props) {
  if (sectionType === 'video') {
    return (
      <VideoSectionForm
        onSave={onSave}
        onCancel={onClose}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'call-to-action') {
    return (
      <CallToActionSectionForm
        onSave={onSave}
        onCancel={onClose}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'featured') {
    return (
      <FeaturedSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'collections') {
    return (
      <CollectionSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'swap' || sectionType === 'swap-lifi') {
    return (
      <SwapConfigSectionForm
        onCancel={onClose}
        onSave={onSave}
        type={sectionType}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'asset-store') {
    return (
      <AssetStoreSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'markdown') {
    return (
      <MDSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'wallet') {
    return (
      <WalletSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'contract') {
    return (
      <ContractSectionForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'user-contract-form') {
    return (
      <UserContractForm
        onCancel={onClose}
        saveOnChange
        onSave={(formId, hideFormInfo) => {
          if (formId) {
            onSave({ type: 'user-contract-form', formId, hideFormInfo });
          }
        }}
        showSaveButton
        onChange={(formId, hideFormInfo) => {
          if (formId) {
            onChange({ type: 'user-contract-form', formId, hideFormInfo });
          }
        }}
        hideFormInfo={
          section?.type === 'user-contract-form'
            ? section.hideFormInfo
            : undefined
        }
        formId={
          section?.type === 'user-contract-form' ? section.formId : undefined
        }
      />
    );
  } else if (sectionType === 'exchange') {
    return (
      <ExchangeSectionSettingsForm
        onCancel={onClose}
        onSave={onSave}
        onChange={onChange}
        section={section?.type === 'exchange' ? section : undefined}
      />
    );
  } else if (sectionType === 'code-page-section') {
    return (
      <Box p={2}>
        <CodeSectionForm
          onCancel={onClose}
          onSave={onSave}
          onChange={onChange}
          section={section?.type === 'code-page-section' ? section : undefined}
        />
      </Box>
    );
  } else if (sectionType === 'dex-generator-section') {
    return (
      <Box p={2}>
        <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
          <DexGeneratorSectionForm
            onCancel={onClose}
            onSave={onSave}
            onChange={onChange}
            section={
              section?.type === 'dex-generator-section' ? section : undefined
            }
            showSaveButton
          />
        </DexkitApiProvider.Provider>
      </Box>
    );
  } else if (sectionType === 'collection') {
    return (
      <Box p={2}>
        <CollectionSectionFormAlt
          onCancel={onClose}
          onSave={onSave}
          onChange={onChange}
          section={section?.type === 'collection' ? section : undefined}
          showSaveButton
        />
      </Box>
    );
  } else if (sectionType === 'asset-section') {
    return (
      <Box p={2}>
        <AssetSectionForm
          onCancel={onClose}
          onSave={onSave}
          onChange={onChange}
          section={section?.type === 'asset-section' ? section : undefined}
          showSaveButton
        />
      </Box>
    );
  }

  return null;
}
