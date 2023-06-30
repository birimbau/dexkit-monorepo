import { Container, useTheme } from "@mui/material";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { MarkdownEditorPageSection } from "../../types";

const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

interface Props {
  section: MarkdownEditorPageSection;
}

export function MDSection({ section }: Props) {
  const theme = useTheme();

  return (
    <Container>
      <EditerMarkdown
        source={section.config?.source}
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      />
    </Container>
  );
}
