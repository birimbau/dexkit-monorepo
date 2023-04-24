import { ThemeMode } from '@dexkit/ui/constants/enum';
import { createTheme, responsiveFontSizes } from '@mui/material';
import { useThemeMode } from 'src/hooks/app';
import AuthMainLayout from '../../src/components/layouts/authMain';
import PageEditor from '../../src/modules/wizard/components/pageEditor/PageEditor';
import { themes } from '../../src/theme';

function PageEditorPage() {
  const { mode } = useThemeMode();

  return (
    <PageEditor
      theme={responsiveFontSizes(
        createTheme(
          mode === ThemeMode.light
            ? themes['kittygotchi'].theme.colorSchemes.light
            : themes['kittygotchi'].theme.colorSchemes.dark
        )
      )}
    ></PageEditor>
  );
}

(PageEditorPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

export default PageEditorPage;
