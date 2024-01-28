const fs = require("fs");

const { Command } = require('commander');
const program = new Command();

program
  .option('-c, --chainId <chainId>', 'Add this chain id')
 
program.parse(process.argv);
const options = program.opts();


if (options.chainId){
  const chainId = Number(options.chainId);
/**
 * Script to add chain to DexAppBuilder nexto
 */

const chainListPath = './src/constants/chains copy.json';

async function addChain() {
  const data = JSON.parse(fs.readFileSync('./static/chains.json', 'utf8'));
  const chainList = JSON.parse(fs.readFileSync(chainListPath, 'utf8'));
  const chain = data.find(d => d.chainId === chainId);
  if(!chain){ 
    console.error('chain not identified');
    return
  }
  const findChain = chainList.find(c => c.chainId === chainId);
  if(findChain){
    console.error('chain already is on list');
    return
  }
  console.log(chain)
  chainList.push(chain);
  chainList.sort((a, b) => a.chainId-b.chainId);


  await fs.writeFileSync(chainListPath, JSON.stringify(chainList, null, 4));
  console.log("chains fetched")
}

async function main() {
  await addChain();
}

main().then(() => {});

}else{
  console.log('missing command --chainId')
}


