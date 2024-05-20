const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
require('dotenv').config();

const { abi, evm } = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider({
   mnemonic: process.env.METAMASK_ACC_MNEMONIC,
   providerOrUrl: process.env.SEPOLIA_INFURA_ENDPOINT,
});

const web3 = new Web3(provider);

const deploy = async () => {
   const accounts = await web3.eth.getAccounts();

   const result = await new web3.eth.Contract(abi)
      .deploy({
         data: evm.bytecode.object,
      })
      .send({
         gas: '3000000',
         from: accounts[0],
      });

   console.log('Contract deployed to', result.options.address);
   provider.engine.stop();
};
deploy();