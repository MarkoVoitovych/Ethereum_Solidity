const HDWalletProvider = require('@truffle/hdwallet-provider');
const { default: Web3 } = require('web3');
require('dotenv').config();

const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
   process.env.METAMASK_ACC_MNEMONIC,
   process.env.SEPOLIA_INFURA_ENDPOINT
);
const initialString = 'Hi there!';
const web3 = new Web3(provider);

const deploy = async () => {
   const accounts = await web3.eth.getAccounts();
   const contract = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
         data: bytecode,
         arguments: [initialString],
      })
      .send({
         from: accounts[0],
         gas: '1000000',
      });
   console.log('contract', contract.options.address);
   provider.engine.stop();
};
deploy();
