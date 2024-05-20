const ganache = require('ganache');
const { Web3 } = require('web3');
const { beforeEach, describe, it } = require('mocha');
const assert = require('assert');

const compiledFactory = require('../build/CampaignFactory.json');
const compiledCampaign = require('../build/Campaign.json');

global.crypto = {
   getRandomValues: function (arr) {
      for (var i = 0; i < arr.length; i++) {
         arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
   },
};

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();

   factory = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({
         data: compiledFactory.evm.bytecode.object,
      })
      .send({
         from: accounts[0],
         gas: '3000000',
      });

   await factory.methods.createCampaign('100').send({
      from: accounts[0],
      gas: '3000000',
   });

   [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

   campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
   it('deploys a factory and a campaign', async () => {
      assert.ok(factory.options.address);
      assert.ok(campaign.options.address);
   });

   it('marks caller as the campaign manager', async () => {
      const manager = await campaign.methods.manager().call();
      assert.equal(manager, accounts[0]);
   });

   it('allows people to contribute money and marks them as approvers', async () => {
      await campaign.methods.contribute().send({
         from: accounts[1],
         value: '200',
      });
      const isContributor = await campaign.methods
         .approvers(accounts[1])
         .call();
      assert.ok(isContributor);
   });

   it('requires a minimum contribution', async () => {
      try {
         await campaign.methods.contribute().send({
            from: accounts[1],
            value: '50',
         });
      } catch (error) {
         assert(error);
      }
   });

   it('allows a manager to make a payment request', async () => {
      await campaign.methods.contribute().send({
         from: accounts[0],
         value: web3.utils.toWei('100', 'ether'),
      });
      await campaign.methods
         .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
         .send({ from: accounts[0], gas: '3000000' });

      // error appears
      const request = await campaign.methods.getRequest(0).call();
      assert.equal('Buy batteries', request[0].description);
   });

   it('processes requests', async () => {
      await campaign.methods.contribute().send({
         from: accounts[0],
         value: web3.utils.toWei('10', 'ether'),
      });

      await campaign.methods
         .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
         .send({ from: accounts[0], gas: '2000000' });

      await campaign.methods.approveRequest(0).send({
         from: accounts[0],
         gas: '2000000',
      });

      await campaign.methods.finalizeRequest(0).send({
         from: accounts[0],
         gas: '2000000',
      });

      let balance = await web3.eth.getBalance(accounts[1]);
      balance = web3.utils.fromWei(balance, 'ether');
      balance = parseFloat(balance);
      console.log(balance);
      assert(balance > 1004);
   });
});
