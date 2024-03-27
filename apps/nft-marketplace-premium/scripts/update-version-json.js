const fs = require('fs');

const pkg = JSON.parse(
  fs.readFileSync(`${__dirname}/../package.json`).toString(),
);

fs.writeFileSync(
  `${__dirname}/../src/constants/app-version.json`,
  JSON.stringify({ version: pkg.version }, null, '\t'),
);
