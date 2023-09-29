import { AppPageSection, SectionType } from '../../types/section';
import { AssetStoreSectionForm } from '../forms/AssetStoreSectionForm';
import CallToActionSectionForm from '../forms/CallToActionSectionForm';
import CollectionSectionForm from '../forms/CollectionSectionForm';
import { ContractSectionForm } from '../forms/ContractSectionForm';
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
  onClose: () => void;
}

export function SectionFormRender({
  section,
  sectionType,
  onSave,
  onClose,
}: Props) {
  if (sectionType === 'video') {
    return (
      <VideoSectionForm
        onSave={onSave}
        onCancel={onClose}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'call-to-action') {
    return (
      <CallToActionSectionForm
        onSave={onSave}
        onCancel={onClose}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'featured') {
    return (
      <FeaturedSectionForm
        onCancel={onClose}
        onSave={onSave}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'collections') {
    return (
      <CollectionSectionForm
        onCancel={onClose}
        onSave={onSave}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'swap') {
    return (
      <SwapConfigSectionForm
        onCancel={onClose}
        onSave={onSave}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'asset-store') {
    return (
      <AssetStoreSectionForm
        onCancel={onClose}
        onSave={onSave}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'markdown') {
    return (
      <MDSectionForm
        onCancel={onClose}
        onSave={onSave}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'wallet') {
    return (
      <WalletSectionForm
        onCancel={onClose}
        onSave={onSave}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'contract') {
    return (
      <ContractSectionForm
        onCancel={onClose}
        onSave={onSave}
        section={section?.type === sectionType ? section : undefined}
      />
    );
  } else if (sectionType === 'user-contract-form') {
    return (
      <UserContractForm
        onCancel={onClose}
        onSave={(formId, hideFormInfo) => {
          if (formId) {
            onSave({ type: 'user-contract-form', formId, hideFormInfo });
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
        section={section?.type === 'exchange' ? section : undefined}
      />
    );
  }

  return null;
}
