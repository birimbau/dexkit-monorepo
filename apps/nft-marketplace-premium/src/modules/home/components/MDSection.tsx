import { MarkdownEditorPageSection } from '@/modules/wizard/types/section';
import { Container } from '@mui/material';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';

const EditerMarkdown = dynamic(
  () =>
    import('@uiw/react-md-editor').then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

interface Props {
  section: MarkdownEditorPageSection;
}

export function MDSection({ section }: Props) {
  return (
    <Container>
      <EditerMarkdown source={section.config?.source} />
    </Container>
  );
}
