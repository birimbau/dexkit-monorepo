import { CustomEditorSection } from '@/modules/wizard/types/section';
import PageEditor from '../../wizard/components/pageEditor/PageEditor';

interface Props {
  section: CustomEditorSection;
}

export function CustomSection({ section }: Props) {
  return <PageEditor readOnly={true} value={section.data} />;
}

export default CustomSection;
