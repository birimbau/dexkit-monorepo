import { useLocale } from "@dexkit/ui/hooks";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

export interface TradingGraph {
  showSwaps?: boolean;
  showInfo?: boolean;
  network?: string;
  pools: { name: string; address: string }[];
  selectedPool?: string;
  onChange: (value: string) => void;
  onChangeShowSwaps: (value: boolean) => void;
}

export default function TradingGraph({
  network,
  showInfo,
  showSwaps,
  onChangeShowSwaps,
  pools,
  onChange,
  selectedPool,
}: TradingGraph) {
  const handleChange = async (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    onChange(event.target.value);
  };

  const { locale } = useLocale();

  const language = useMemo(() => {
    const result = locale.split("-");

    if (result.length >= 1) {
      return result[0];
    }

    return "en";
  }, [locale]);

  const handleChangeSwap = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onChangeShowSwaps(checked);
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="flex-end">
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox checked={showSwaps} onChange={handleChangeSwap} />
              }
              label={
                <FormattedMessage id="show.swaps" defaultMessage="Show Swaps" />
              }
            />
            <FormControl>
              <Select displayEmpty value={selectedPool} onChange={handleChange}>
                <MenuItem value="">
                  <FormattedMessage
                    id="selecte.a.pair"
                    defaultMessage="Select a pair"
                  />
                </MenuItem>
                {pools.map((pool, key) => (
                  <MenuItem value={pool.address} key={key}>
                    {pool.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </CardContent>
      <Box sx={{ height: showSwaps ? 800 : 500 }}>
        <iframe
          height="100%"
          width="100%"
          id="geckoterminal-embed"
          title="GeckoTerminal Embed"
          src={`https://www.geckoterminal.com/${language}/${network}/pools/${selectedPool}?embed=1&info=${
            showInfo ? "1" : "0"
          }&swaps=${showSwaps ? "1" : "0"}`}
          frameBorder="0"
          allow="clipboard-write"
          allowFullScreen
        />
      </Box>
    </Card>
  );
}
