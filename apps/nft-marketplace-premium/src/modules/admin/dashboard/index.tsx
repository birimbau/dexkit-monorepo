// in src/admin/App.jsx
import { Admin, Resource, ShowGuesser } from 'react-admin';
import { AuthProvider } from './authProvider';

import dataProvider from './dataProvider';
import { AssetEdit } from './edits/asset';
import { CollectionEdit } from './edits/collection';
import { AssetList } from './lists/asset';
import { CoinList } from './lists/coin';
import { CoinPlatformList } from './lists/coinPlatform';
import { CollectionList } from './lists/collection';
import { SiteList } from './lists/site';
import MyLoginPage from './pages/loginPage';
import { AssetShow } from './shows/asset';
import { CoinShow } from './shows/coin';
import { CoinPlatformShow } from './shows/coinPlatform';
import { CollectionShow } from './shows/collection';

const App = () => (
  <Admin
    dataProvider={dataProvider as any}
    loginPage={MyLoginPage}
    authProvider={AuthProvider as any}
  >
    <Resource
      name="collection"
      list={CollectionList}
      show={CollectionShow}
      edit={CollectionEdit}
    />
    <Resource name="asset" list={AssetList} show={AssetShow} edit={AssetEdit} />
    <Resource name="site" list={SiteList} show={ShowGuesser} />
    <Resource name="coin" list={CoinList} show={CoinShow} />
    <Resource
      name="coin-platform"
      list={CoinPlatformList}
      show={CoinPlatformShow}
    />
  </Admin>
);

export default App;
