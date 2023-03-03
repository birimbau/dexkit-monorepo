import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppConfig, MenuTree } from '../../../../types/config';
import MenuSection from '../sections/MenuSection';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
}

export default function PagesMenuWizardContainer({
  config,
  onSave,
  onChange,
}: Props) {
  const [menu, setMenu] = useState<MenuTree[]>(config.menuTree || []);

  const handleSave = () => {
    const newConfig = { ...config, menuTree: menu };
    onSave(newConfig);
  };

  useEffect(() => {
    const newConfig = { ...config, menuTree: menu };
    onChange(newConfig);
  }, [menu]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'subtitle2'}>
            <FormattedMessage id="menu" defaultMessage="Menu" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="edit.marketplace.menu"
              defaultMessage="Edit Marketplace menu"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <MenuSection menu={menu} onSetMenu={setMenu} pages={config.pages} />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSave}>
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
