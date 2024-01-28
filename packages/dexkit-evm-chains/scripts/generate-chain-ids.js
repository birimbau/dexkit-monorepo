const fs = require("fs");

async function filterCoingeckoIds() {
  const data = JSON.parse(fs.readFileSync("./static/chains.json", "utf8"));
  const chainIds = {};
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    chainIds[`${element.name.replaceAll(" ", "_").replaceAll("-", "_")}`] =
      element.chainId;
  }
  await fs.writeFileSync(
    "./src/constants/chainIds.json",
    JSON.stringify(chainIds, null, 4)
  );
}

async function main() {
  await filterCoingeckoIds();
}

main().then(() => console.log("generated chain Ids"));
