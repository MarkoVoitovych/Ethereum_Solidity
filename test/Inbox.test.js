const ganache = require('ganache');
const { describe, it, beforeEach } = require('mocha');
const { default: Web3 } = require('web3');
const assert = require('assert');

const { interface, bytecode } = require('../compile');

global.crypto = {
   getRandomValues: function (arr) {
      for (var i = 0; i < arr.length; i++) {
         arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
   },
};

const web3 = new Web3(ganache.provider());
const initialString = 'Hi there!';
let accounts;
let inbox;

beforeEach(async () => {
   // get a list of all accounts
   accounts = await web3.eth.getAccounts();

   // use one of those accounts to deploy the contract
   inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
         data: bytecode,
         arguments: [initialString],
      })
      .send({
         from: accounts[0],
         gas: '1000000',
      });
});

describe('Inbox', () => {
   it('deploys a contract', () => {
      assert.ok(inbox.options.address);
   });

   it('has a default message', async () => {
      const message = await inbox.methods.message().call();
      assert.equal(message, initialString);
   });

   it('can modify a message', async () => {
      await inbox.methods.setMessage('Bye there!').send({
         from: accounts[0],
      });
      const message = await inbox.methods.message().call();
      assert.equal(message, 'Bye there!');
   });
});
