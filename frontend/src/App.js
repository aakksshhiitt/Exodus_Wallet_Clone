import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Pages/nav";
import Wallet from "./Pages/wallet";
import History from "./Pages/history";
import DecideLater from "./Pages/decideLater";




// // use your wallet to sign transactions.

// // const PRIVATE_KEY = "0xYOUR_PRIVATE_KEY_HERE";
// // const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
// // const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
// // const contract = new ethers.Contract(contractAddress, contractABI, wallet);


 

  
function App(){
  return (

    

    <Router>
      <Navbar />
      <Routes>
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/history" element={<History />} />
        <Route path="/willDecideLater" element={<DecideLater />} />
      </Routes>
    </Router>
  );
};

export default App;