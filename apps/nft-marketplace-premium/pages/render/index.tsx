import { NextPage } from 'next';

import RenderDexAppBuilder from '@dexkit/dexappbuilder-viewer';

const Render: NextPage = () => {
  return <RenderDexAppBuilder slug={'crypto-fans'} withLayout={true}/>;
};

export default Render;
