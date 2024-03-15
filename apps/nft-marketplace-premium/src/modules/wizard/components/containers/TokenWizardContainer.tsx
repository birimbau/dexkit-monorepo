import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SiteResponse } from 'src/types/whitelabel';
import { Token } from '../../../../types/blockchain';
import { AppConfig } from '../../../../types/config';
import { isAddressEqual } from '../../../../utils/blockchain';
import { StepperButtonProps } from '../../types';
import { TOKEN_KEY } from '../../utils';
import TokensSection from '../sections/TokensSection';
import { StepperButtons } from '../steppers/StepperButtons';

interface Props {
  config: AppConfig;
  site?: SiteResponse | null;
  onSave: (config: AppConfig) => void;
  onHasChanges?: (hasChanges: boolean) => void;
  isOnStepper?: boolean;
  isSwap?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function TokenWizardContainer({
  site,
  config,
  onSave,
  isOnStepper,
  onHasChanges,
  stepperButtonProps,
  isSwap,
}: Props) {
  const [hasChanged, setHasChanged] = useState(false);

  const appUrl = useMemo(() => {
    if (site?.domain) {
      return `https://${site?.domain}`;
    }
    if (site?.previewUrl) {
      return site?.previewUrl;
    }
  }, [site]);

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [hasChanged, onHasChanges]);

  const [selectedKeys, setSelectedKeys] = useState<{
    [key: string]: boolean;
  }>({});

  const [tokens, setTokens] = useState<Token[]>(
    config?.tokens?.length ? config?.tokens[0].tokens || [] : [],
  );

  const handleMakeTradable = (key: string) => {
    const newTokens = [...tokens];
    const index = newTokens.findIndex((t) => TOKEN_KEY(t) === key);

    if (index > -1) {
      const token = { ...newTokens[index] } as Token;

      if (token.tradable) {
        token.tradable = false;
      } else {
        token.tradable = true;
      }

      newTokens[index] = token;
      setTokens(newTokens);
      setHasChanged(true);
    }
  };

  const handleRemoveTokens = () => {
    setHasChanged(true);
    return setTokens((value) => {
      let newTokens = value.filter((token) => {
        return !Boolean(selectedKeys[TOKEN_KEY(token)]);
      });

      setSelectedKeys({});

      return newTokens;
    });
  };

  const handleSaveTokens = useCallback((tokens: Token[]) => {
    setTokens((value) => {
      let filteredTokens = tokens.filter((newToken) => {
        const token = value.find(
          (t) =>
            isAddressEqual(t.address, newToken.address) &&
            Number(t.chainId) === Number(newToken.chainId),
        );

        return !token;
      });
      setHasChanged(true);
      return [...value, ...filteredTokens];
    });
  }, []);

  const handleSelectToken = useCallback((key: string) => {
    setSelectedKeys((value) => {
      if (!Boolean(value[key])) {
        return { ...value, [key]: true };
      }
      const newObj = { ...value };
      delete newObj[key];
      return newObj;
    });
  }, []);

  const handleSelectAllTokens = () => {
    let indexes: {
      [key: string]: boolean;
    } = {};

    for (let t of tokens) {
      const key = TOKEN_KEY(t);

      if (selectedKeys[key] !== undefined) {
        delete indexes[key];
      } else {
        indexes[key] = true;
      }
    }

    setSelectedKeys(indexes);
  };
  const handleSave = () => {
    const newConfig = {
      ...config,
      tokens: [
        {
          name: 'Custom List',
          keywords: ['custom list'],
          tokens: tokens,
        },
      ],
    };
    onSave(newConfig);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
            <FormattedMessage id="tokens" defaultMessage="Tokens" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="select.or.import.tokens.for.your.app"
              defaultMessage="Select or import tokens for your app"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <TokensSection
          onSelect={handleSelectToken}
          onSave={handleSaveTokens}
          onSelectAll={handleSelectAllTokens}
          selectedKeys={selectedKeys}
          onRemove={handleRemoveTokens}
          tokens={tokens}
          appUrl={appUrl}
          onMakeTradable={isSwap ? undefined : handleMakeTradable}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {isOnStepper ? (
          <StepperButtons
            {...stepperButtonProps}
            handleNext={() => {
              handleSave();
              if (stepperButtonProps?.handleNext) {
                stepperButtonProps.handleNext();
              }
            }}
            disableContinue={false}
          />
        ) : (
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!hasChanged}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
