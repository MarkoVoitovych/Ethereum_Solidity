import web3 from './web3';

const address = '';

const abi = [
   {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
   },
   {
      inputs: [],
      name: 'enter',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
   },
   {
      inputs: [],
      name: 'getPlayers',
      outputs: [[Object]],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [],
      name: 'manager',
      outputs: [[Object]],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [],
      name: 'pickWinner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [[Object]],
      name: 'players',
      outputs: [[Object]],
      stateMutability: 'view',
      type: 'function',
   },
];

export default new web3.eth.Contract(abi, address);
