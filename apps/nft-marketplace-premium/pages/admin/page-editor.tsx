import { createTheme, responsiveFontSizes } from '@mui/material';
import AuthMainLayout from '../../src/components/layouts/authMain';
import PageEditor from '../../src/modules/wizard/components/pageEditor/PageEditor';
import { lightThemes } from '../../src/theme';

function PageEditorPage() {
  return (
    <PageEditor
      theme={responsiveFontSizes(createTheme(lightThemes['kittygotchi'].theme))}
    ></PageEditor>
  );
}

(PageEditorPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

export default PageEditorPage;
