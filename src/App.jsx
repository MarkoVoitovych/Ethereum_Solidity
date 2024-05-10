import { useEffect, useState } from 'react';

import web3 from './web3';
import './App.css';

function App() {
   const [count, setCount] = useState(0);

   useEffect(() => {
      console.log('web3.', web3.eth.getAccounts().then(console.log));
   }, []);

   return (
      <>
         <h1>Vite + React</h1>
         <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
               count is {count}
            </button>
         </div>
      </>
   );
}

export default App;
