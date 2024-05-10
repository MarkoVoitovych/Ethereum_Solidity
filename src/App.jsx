import { useEffect, useState } from 'react';

import web3 from './web3';
import lottery from './lottery';
import './App.css';

function App() {
   const [manager, setManager] = useState('');
   const [players, setPlayers] = useState([]);
   const [balance, setBalance] = useState('0');
   const [input, setInput] = useState('');
   const [myMoney, setMyMoney] = useState(0);
   const [address, setAddress] = useState('');
   const [message, setMessage] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         setMessage('Waiting on transaction success...');
         await lottery.methods.enter().send({
            from: address,
            value: web3.utils.toWei(Number(input), 'ether'),
         });
         setMessage('You have been entered!');
         setInput('');
      } catch (error) {
         console.error(error);
         setMessage('Transaction cancelled!');
      }
      setTimeout(() => {
         setMessage('');
      }, 3000);
   };

   const handlePickWinner = async () => {
      try {
         setMessage('Waiting on transaction success...');
         await lottery.methods.pickWinner().send({
            from: address,
         });
         setMessage('Waiting on transaction success...');
      } catch (error) {
         console.error(error);
         setMessage('Transaction cancelled!');
      }
      setTimeout(() => {
         setMessage('');
      }, 3000);
   };

   useEffect(() => {
      (async () => {
         const manager = await lottery.methods.manager().call();
         const players = await lottery.methods.getPlayers().call();
         const balance = await web3.eth.getBalance(lottery.options.address);

         setPlayers(players);
         setManager(manager);
         setBalance(balance);
      })();
      const fetchAccount = async () => {
         const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
         });
         setAddress(accounts[0]);
      };
      fetchAccount();
      window.ethereum.on('accountsChanged', fetchAccount);
      return () => {
         window.ethereum.off('accountsChanged', fetchAccount);
      };
   }, []);

   useEffect(() => {
      if (!address) {
         return;
      }
      (async () => {
         const myMoney = await web3.eth.getBalance(address);
         setMyMoney(web3.utils.fromWei(myMoney, 'ether'));
      })();
   }, [address]);

   return (
      <div>
         <h2>Lottery contract</h2>
         <p>This contract is managed by {manager}</p>
         <p>Your account is {address}</p>
         <p>
            There are currently {players.length} people entered, competing to
            win {web3.utils.fromWei(balance, 'ether')} ether!
         </p>

         <hr />
         <form onSubmit={handleSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
               <label>Amount of ether to enter {'  '}</label>
               <p></p>
               <input
                  value={input}
                  onChange={(event) => {
                     setInput(event.target.value);
                  }}
               />
            </div>
            <p> </p>
            <button disabled={Boolean(Number(input) > Number(myMoney))}>
               Enter
            </button>
         </form>

         <hr />

         <h4>Ready to pick a winner?</h4>
         <button type="button" onClick={handlePickWinner}>
            Pick a winner
         </button>

         <hr />

         <h2>{message}</h2>
      </div>
   );
}

export default App;
