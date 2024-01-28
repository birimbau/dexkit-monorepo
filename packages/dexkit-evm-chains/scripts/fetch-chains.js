const fs = require("fs");

async function fetchChains() {
  var data;
  const response = await fetch("https://chainid.network/chains.json");
  data = await response.json();
  await fs.writeFileSync("./static/chains.json", JSON.stringify(data, null, 4));
}

async function main() {
  await fetchChains();
}

main().then(() => console.log("chains fetched"));
