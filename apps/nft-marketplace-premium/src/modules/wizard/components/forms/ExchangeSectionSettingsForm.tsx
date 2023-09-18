import ExchangeSettingsForm from '@dexkit/exchange/components/ExchangeSettingsForm';
import { DexkitExchangeSettings } from '@dexkit/exchange/types';
import { useAllTokenList } from 'src/hooks/blockchain';
import { ExchangePageSection } from '../../types/section';

interface Props {
  onSave: (section: ExchangePageSection) => void;
  onCancel: () => void;
  section?: ExchangePageSection;
}

export default function ExchangeSectionSettingsForm({
  onSave,
  onCancel,
  section,
}: Props) {
  const handleSave = (settings: DexkitExchangeSettings) => {
    if (onSave) {
      onSave({
        type: 'exchange',
        settings,
      });
    }
  };

  const tokens = useAllTokenList({
    includeNative: true,
    isWizardConfig: true,
  });

  return (
    <ExchangeSettingsForm
      onCancel={onCancel}
      onSave={handleSave}
      settings={section?.settings}
      tokens={tokens.map((t) => ({
        chainId: t.chainId,
        contractAddress: t.address,
        name: t.name,
        decimals: t.decimals,
        symbol: t.symbol,
        logoURI: t.logoURI,
      }))}
    />
  );
}
