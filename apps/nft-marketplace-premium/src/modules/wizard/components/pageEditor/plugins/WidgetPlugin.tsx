import { Widget } from '@dexkit/dexappbuilder-viewer/components/Widget';
import Container from '@mui/material/Container';
import type { CellPlugin } from '@react-page/editor';
import { TextareaControl } from '../components/TextareaControl';

type Data = {
  html?: string;
};
// you can pass the shape of the data as the generic type argument
const WidgetPlugin: CellPlugin<Data> = {
  Renderer: ({ data }) => <Widget htmlString={data?.html || '<></>'} />,
  id: 'dexkit-widget-plugin',
  title: 'Widget',
  description: 'Insert custom html and scripts',
  version: 1,
  controls: {
    type: 'custom',
    Component: (data) => (
      <Container sx={{ p: 2 }}>
        {' '}
        <TextareaControl data={data} />
      </Container>
    ),
  },
};

export default WidgetPlugin;
