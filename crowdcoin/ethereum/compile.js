const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
   language: 'Solidity',
   sources: {
      'Campaign.sol': {
         content: source,
      },
   },
   settings: {
      outputSelection: {
         '*': {
            '*': ['*'],
         },
      },
   },
};

fs.ensureDirSync(buildPath);

const contracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
   'Campaign.sol'
];

for (let contract in contracts) {
   fs.outputJSONSync(
      path.resolve(buildPath, contract + '.json'),
      contracts[contract]
   );
}
