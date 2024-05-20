// compile code will go here
const path = require('path');
const fs = require('fs');
const solc = require('solc');

const conractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(conractPath, 'utf8');

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

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
   'Campaign.sol'
].Campaign;
