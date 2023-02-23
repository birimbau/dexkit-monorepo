import { memo } from 'react';

// The editor core
import Editor, {
  BottomToolbar,
  BottomToolbarProps,
  Value,
} from '@react-page/editor';

// import the main css, uncomment this: (this is commented in the example because of https://github.com/vercel/next.js/issues/19717)
import '@react-page/editor/lib/index.css';

// The rich text area plugin
// Stylesheets for the rich text area plugin
import '@react-page/plugins-slate/lib/index.css';

// Stylesheets for the imagea plugin
import '@react-page/plugins-image/lib/index.css';
//
import background, { ModeEnum } from '@react-page/plugins-background';

import '@react-page/plugins-background/lib/index.css';

import divider from '@react-page/plugins-divider';

// The html5-video plugin
import html5video from '@react-page/plugins-html5-video';
import '@react-page/plugins-html5-video/lib/index.css';

// The video plugin
import video from '@react-page/plugins-video';
import '@react-page/plugins-video/lib/index.css';

import ExtendedSpacer from './plugins/ExtendedSpacerPlugin';
import '@react-page/plugins-spacer/lib/index.css';

import { Theme } from '@mui/material';
import { styled } from '@mui/system';
import AssetListPlugin from './plugins/AssetListPlugin';
import AssetPlugin from './plugins/AssetPlugin';
import ButtonPlugin from './plugins/ButtonPlugin';
import CodeSnippet from './plugins/CodeSnippet';
import CollectionPlugin from './plugins/CollectionPlugin';
import ContainerPlugin from './plugins/ContainerPlugin';
import CustomContentPluginTwitter from './plugins/CustomContentPluginTwitter';
import { DefaultSlate } from './plugins/DefaultSlate';
import ImagePlugin from './plugins/ImagePlugin';
import StackPlugin from './plugins/StackPlugin';
import SwapPlugin from './plugins/SwapPlugin';
import WidgetPlugin from './plugins/WidgetPlugin';
import SearchNFTPlugin from './plugins/SearchNFTPlugin';
// Define which plugins we want to use.
const cellPlugins = [
  background({
    enabledModes:
      ModeEnum.COLOR_MODE_FLAG |
      ModeEnum.GRADIENT_MODE_FLAG |
      ModeEnum.IMAGE_MODE_FLAG,
  }),
  ButtonPlugin,

  CodeSnippet,
  CollectionPlugin,
  ContainerPlugin,
  divider,
  html5video,
  ImagePlugin,
  AssetPlugin,
  AssetListPlugin,

  ExtendedSpacer,
  StackPlugin,

  //  CustomLayoutPlugin,
  SwapPlugin,
  SearchNFTPlugin,
  DefaultSlate,
  CustomContentPluginTwitter,
  video,
  WidgetPlugin,
];
// https://github.com/react-page/react-page/issues/970
const BottomToolbarStyled = styled(BottomToolbar)({
  '&, & > *': {
    // Passed to MuiPaper
    zIndex: `1200 !important`,
  },
});

const CustomToolbar = memo<BottomToolbarProps>((props) => {
  return <BottomToolbarStyled {...props} />;
});

CustomToolbar.displayName = 'CustomToolbar';

interface Props {
  readOnly?: boolean;
  value?: string | undefined | null;
  onChange?: (value: string | null) => void;
  theme?: Theme;
}

export default function PageEditor(props: Props) {
  const { readOnly, onChange, value, theme } = props;

  const onChangeValue = (val: Value | null) => {
    if (onChange) {
      if (val) {
        onChange(JSON.stringify(val));
      } else {
        onChange(null);
      }
    }
  };

  return (
    <Editor
      components={{
        BottomToolbar: CustomToolbar,
      }}
      cellPlugins={cellPlugins}
      value={JSON.parse(value || 'null')}
      onChange={onChangeValue}
      readOnly={readOnly}
      //@ts-ignore
      uiTheme={theme}
    />
  );
}
