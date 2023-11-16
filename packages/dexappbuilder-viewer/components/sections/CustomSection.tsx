import { CustomEditorSection } from "@dexkit/ui/modules/wizard/types";
import dynamic from "next/dynamic";

const PageEditor = dynamic(() => import("../page-editor/PageEditor"));

interface Props {
  section: CustomEditorSection;
}

export function CustomSection({ section }: Props) {
  return <PageEditor readOnly={true} value={section.data} />;
}

export default CustomSection;
