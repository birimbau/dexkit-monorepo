import ContractFormView from "@dexkit/web3forms/components/ContractFormView";
import { ContractFormParams } from "@dexkit/web3forms/types";
import { Box } from "@mui/material";
import type { CellPlugin } from "@react-page/editor";

// you can pass the shape of the data as the generic type argument
const ContractFormPlugin: CellPlugin<ContractFormParams> = {
  Renderer: ({ data, isEditMode }) =>
    data.abi ? (
      <Box sx={{ p: 2 }}>
        <ContractFormView params={data} />
      </Box>
    ) : null,
  id: "contract-form-settings-plugin",
  title: "Contract",
  description: "Contract form",
  version: 1,
  /* controls: {
    type: 'custom',
    Component: ({ data, onChange }) => (
      <Box p={2}>
        <ContractForm updateOnChange params={data} onChange={onChange} />
      </Box>
    ),
  },*/
};

export default ContractFormPlugin;
