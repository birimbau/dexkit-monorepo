/*import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
console.log(__dirname);

const packg = JSON.parse(
  fs.readFileSync(`${__dirname}/../package.json`).toString(),
);

fs.writeFileSync(
  `${__dirname}/../src/constants/app-version.json`,
  JSON.stringify({ version: packg.version }, null, '\t'),
);*/
