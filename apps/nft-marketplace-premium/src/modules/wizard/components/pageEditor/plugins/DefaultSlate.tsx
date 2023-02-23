import slate from '@react-page/plugins-slate';
// import css as well. currently, we caannot do this here in the demo project and have moved that to _app.tsx
// see https://github.com/vercel/next.js/issues/19717
// import '@react-page/plugins-slate/lib/index.css';

import { ColorPickerField } from '@react-page/editor';
import { pluginFactories } from '@react-page/plugins-slate';

const colorSlate = pluginFactories.createComponentPlugin<{
  color: string;
}>({
  addHoverButton: true, // whether to show it above the text when selected
  addToolbarButton: true, // whether to show it in the bottom toolbar
  type: 'SetColor', // a well defined string, this is kind of the id of the plugin
  object: 'mark', // mark is like a span, other options are inline and block
  icon: <span>Color</span>, // an icon to show
  label: 'Set Color',
  Component: 'span', // the component to render
  getStyle: ({ color }) => ({ color }),
  controls: {
    // identical to custom cell plugins
    type: 'autoform',
    schema: {
      type: 'object',
      required: ['color'],
      properties: {
        color: {
          uniforms: {
            component: ColorPickerField,
          },
          default: 'rgba(0,0,255,1)',
          type: 'string',
        },
      },
    },
  },
});

export const DefaultSlate = slate((def) => ({
  ...def,
  plugins: {
    // this will pull in all predefined plugins
    ...def.plugins,
    // you can also add custom plugins. The namespace `custom` is just for organizing plugins
    custom: {
      color: colorSlate,
    },
  },
}));
