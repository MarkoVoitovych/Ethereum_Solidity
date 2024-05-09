const ganache = require('ganache');
const { Web3 } = require('web3');
const { beforeEach, describe, it } = require('mocha');
const assert = require('assert');

const { abi, evm } = require('../compile');

global.crypto = {
   getRandomValues: function (arr) {
      for (var i = 0; i < arr.length; i++) {
         arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
   },
};

const web3 = new Web3(ganache.provider());

let lottery;
let accounts;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();
   lottery = await new web3.eth.Contract(abi)
      .deploy({
         data: evm.bytecode.object,
      })
      .send({
         from: accounts[0],
         gas: '1000000',
      });
});

describe('Lottery Contract', () => {
   it('deploys a contract', () => {
      assert.ok(lottery.options.address);
   });

   it('allows one account to enter', async () => {
      await lottery.methods.enter().send({
         from: accounts[0],
         value: web3.utils.toWei('0.002', 'ether'),
      });

      const players = await lottery.methods.getPlayers().call({
         from: accounts[0],
      });

      assert.equal(accounts[0], players[0]);
      assert.equal(players.length, 1);
   });

   it('allows multiple accounts to enter', async () => {
      await lottery.methods.enter().send({
         from: accounts[0],
         value: web3.utils.toWei('0.002', 'ether'),
      });
      await lottery.methods.enter().send({
         from: accounts[1],
         value: web3.utils.toWei('0.002', 'ether'),
      });
      await lottery.methods.enter().send({
         from: accounts[2],
         value: web3.utils.toWei('0.002', 'ether'),
      });

      const players = await lottery.methods.getPlayers().call({
         from: accounts[0],
      });

      assert.equal(accounts[0], players[0]);
      assert.equal(accounts[1], players[1]);
      assert.equal(accounts[2], players[2]);
      assert.equal(players.length, 3);
   });

   it('requires a minimum amount of ether to enter', async () => {
      try {
         await lottery.methods.enter().send({
            from: accounts[0],
            value: 200,
         });
         // if this code would run the test will fail -->
         assert(false);
      } catch (error) {
         assert(error);
      }
   });

   it('only manager can call pickWinner', async () => {
      try {
         await lottery.methods.pickWinner().send({
            from: accounts[1],
         });
         assert(false);
      } catch (error) {
         assert(error);
      }
   });

   it('send money to the winner and resets the players array', async () => {
      await lottery.methods.enter().send({
         from: accounts[0],
         value: web3.utils.toWei('2', 'ether'),
      });

      const initialBalance = await web3.eth.getBalance(accounts[0]);

      await lottery.methods.pickWinner().send({
         from: accounts[0],
      });

      const finalBalance = await web3.eth.getBalance(accounts[0]);
      const difference = finalBalance - initialBalance;
      assert(difference > web3.utils.toWei('1.9', 'ether'));
   });
});
