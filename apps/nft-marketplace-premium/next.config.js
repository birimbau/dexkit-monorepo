/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['@dexkit/widgets']); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
  staticPageGenerationTimeout: 30000,
  experimental: { images: { allowFutureImage: true } },
  images: {
    domains: [
      'i.seadn.io',
      'dweb.link',
      'ipfs.io',
      'ipfs.moralis.io',
      'dashboard.mypinata.cloud',
      'raw.githubusercontent.com',
      'arpeggi.io',
      'arweave.net',
      'i.ibb.co',
      'assets.otherside.xyz',
      'dexkit-storage.nyc3.cdn.digitaloceanspaces.com',
      'dexkit-storage.nyc3.digitaloceanspaces.com',
    ],
  },
});
