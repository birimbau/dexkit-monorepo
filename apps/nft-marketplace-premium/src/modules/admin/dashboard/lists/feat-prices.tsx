import { Datagrid, List, TextField } from 'react-admin';

const FeatPricesList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="feat" />
      <TextField source="plan" />
      <TextField source="model" />
      <TextField source="price" />
    </Datagrid>
  </List>
);

export default FeatPricesList;
