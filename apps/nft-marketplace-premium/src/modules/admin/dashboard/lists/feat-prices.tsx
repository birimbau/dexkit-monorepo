import { Datagrid, List, SearchInput, TextField } from 'react-admin';

const FeatPricesList = () => (
  <List
    filters={[<SearchInput source="q" alwaysOn />]}
    filterDefaultValues={{ q: '' }}
  >
    <Datagrid rowClick="edit">
      <TextField source="feat" />
      <TextField source="plan" />
      <TextField source="model" />
      <TextField source="price" />
    </Datagrid>
  </List>
);

export default FeatPricesList;
