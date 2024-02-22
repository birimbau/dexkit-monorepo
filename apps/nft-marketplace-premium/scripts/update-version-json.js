const fs = require('fs');
console.log(__dirname);

const package = JSON.parse(
  fs.readFileSync(`${__dirname}/../package.json`).toString(),
);

fs.writeFileSync(
  `${__dirname}/../src/constants/app-version.json`,
  JSON.stringify({ version: package.version }, null, '\t'),
);
