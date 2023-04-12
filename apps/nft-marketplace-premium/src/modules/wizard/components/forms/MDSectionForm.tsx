import {
  AppPageSection,
  MarkdownEditorPageSection,
} from '@/modules/wizard/types/section';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const EditerMarkdown = dynamic(
  () =>
    import('@uiw/react-md-editor').then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

interface Props {
  section?: MarkdownEditorPageSection;
  onSave: (section: AppPageSection) => void;
  onCancel: () => void;
}

export default function MDSectionForm({ section, onSave, onCancel }: Props) {
  const [value, setValue] = useState<string | undefined>(
    section?.config?.source
  );
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MDEditor value={value} onChange={setValue} />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button
            onClick={() =>
              onSave({
                ...section,
                type: 'markdown',
                config: { source: value },
              })
            }
            variant="contained"
            color="primary"
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
          <Button onClick={onCancel}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
