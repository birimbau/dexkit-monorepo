import { NextPage } from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from '../../../src/components/layouts/authMain';
import { usePageTemplateByIdQuery } from '../../../src/hooks/whitelabel';
import PageTemplateContainer from '../../../src/modules/wizard/components/pageTemplate/PageTemplateContainer';

export const PageTemplateEdit: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: pageTemplate } = usePageTemplateByIdQuery({
    id: id as string,
  });

  return (
    (pageTemplate && <PageTemplateContainer pageTemplate={pageTemplate} />) ||
    null
  );
};

(PageTemplateEdit as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

export default PageTemplateEdit;
