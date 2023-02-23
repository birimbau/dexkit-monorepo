import { NextPage } from 'next';
import AuthMainLayout from '../../../src/components/layouts/authMain';
import PageTemplateContainer from '../../../src/modules/wizard/components/pageTemplate/PageTemplateContainer';

export const CreatePageTemplate: NextPage = () => {
  return <PageTemplateContainer />;
};

(CreatePageTemplate as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

export default CreatePageTemplate;
