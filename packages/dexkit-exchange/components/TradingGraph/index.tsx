import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface TradingGraph {
  showSwaps?: boolean;
  showInfo?: boolean;
  network?: string;
  pools: { name: string; address: string }[];
  selectedPool?: string;
  onChange: (value: string) => void;
}

export default function TradingGraph({
  network,
  showInfo,
  showSwaps,
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

  console.log("vemvem", selectedPool);

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="flex-end">
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
      </CardContent>
      <Box sx={{ height: 500 }}>
        <iframe
          height="100%"
          width="100%"
          id="geckoterminal-embed"
          title="GeckoTerminal Embed"
          src={`https://www.geckoterminal.com/pt/${network}/pools/${selectedPool}?embed=1&info=${
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
