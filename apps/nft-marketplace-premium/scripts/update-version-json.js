import fs from 'fs';

const __dirname = import.meta.dirname;

console.log(__dirname);

const pkg = JSON.parse(
  fs.readFileSync(`${__dirname}/../package.json`).toString(),
);

fs.writeFileSync(
  `${__dirname}/../src/constants/app-version.json`,
  JSON.stringify({ version: pkg.version }, null, '\t'),
);
