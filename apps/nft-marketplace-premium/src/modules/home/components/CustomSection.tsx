import { CustomEditorSection } from '../../../types/config';
import PageEditor from '../../wizard/components/pageEditor/PageEditor';

interface Props {
  section: CustomEditorSection;
}

export function CustomSection({ section }: Props) {
  return <PageEditor readOnly={true} value={section.data} />;
}

export default CustomSection;
