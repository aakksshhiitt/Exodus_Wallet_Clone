import React, { useState, useEffect } from 'react';
import './history.css';

function History() {

  const tabs = [
    'SwapDetails',
    'Staking',
    'Deposits',
    'Withdrawls',
    'Transfers',
    'Claims',
    'NFTs'
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [data, setData] = useState({
    SwapDetails: [],
    Staking: [],
    Deposits: [],
    Withdrawls: [],
    Transfers: [],
    Claims: [],
    NFTs:[]
  });

  // useEffect(() => {
  //   // Placeholder for actual data fetching (e.g. queryFilter from Ethers.js)
  //   setData({
  //     'Swap Details': 
  //     [
  //       { id: 1, from: 'Alice', to: 'Bob', amount: 100 }, 
  //       { id: 1, from: 'Blice', to: 'Bob', amount: 100 }, 
  //       { id: 1, from: 'Alice', to: 'Bob', amount: 100 }
  //     ],
  //     Staking: [{ id: 2, staker: 'Carol', amount: '50 ETH' }],
  //     Deposits: [{ id: 3, user: 'Dave', amount: '0.5 BTC' }],
  //     Withdrawls: [{ id: 4, user: 'Eve', amount: '200 USDT' }],
  //     Transfers: [{ id: 5, sender: 'Frank', receiver: 'Grace', amount: 300 }],
  //     Claims: [{ id: 6, claimer: 'Heidi', reward: '10 Token' }],
  //     NFTs: [{ id: 6, claimer: 'Heidi', reward: '10 Token' }],
  //   });
  // }, []);


const swapDetails=async()=>{
  const swapData = await fetch("http://localhost:5000/api/swap", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  // console.log(transferData);
  const data = await swapData.json();
  // console.log(data);
  setData({
      SwapDetails: data
    }); 
}  

const staking=async()=>{
  const stakeData = await fetch("http://localhost:5000/api/stake", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  // console.log(transferData);
  const data = await stakeData.json();
  // console.log(data);
  setData({
      Staking: data
    }); 
}  

const deposits=async()=>{
  const depositData = await fetch("http://localhost:5000/api/deposit", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  const data = await depositData.json();
  console.log(data);
  setData({
      Deposits: data
    });
}  

const withdrawls=async()=>{
  const withdrawlData = await fetch("http://localhost:5000/api/withdrawl", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  console.log(withdrawlData);
  const data = await withdrawlData.json();
  console.log(data);
  setData({
      Withdrawls: data
    }); 
}  

const transfers=async()=>{
  const transferData = await fetch("http://localhost:5000/api/transfer", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  // console.log(transferData);
  const data = await transferData.json();
  // console.log(data);
  setData({
      Transfers: data
    }); 
}  

const claims=async()=>{
  const claimData = await fetch("http://localhost:5000/api/claim", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  // console.log(transferData);
  const data = await claimData.json();
  // console.log(data);
  setData({
      Claims: data
    }); 
}  

const nfts=()=>{
  console.log("NFTs");
}  












  const renderTable = () => {
    const rows = data[activeTab] || [];
    if (rows.length === 0) {
      return <div>No data available for {activeTab}.</div>;
    }

    // Derive headers from object keys of first row
    const headers = Object.keys(rows[0]);

    return (
      <table className="tab-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {headers.map((col) => (
                <td key={`${row.id}-${col}`}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="tabbed-tables-container">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab)
              if(tab=='SwapDetails'){
                swapDetails();
              }
              else if(tab=='Staking'){
                staking();
              }
              else if(tab=='Deposits'){
                deposits();
              }
              else if(tab=='Withdrawls'){
                withdrawls();
              }
              else if(tab=='Transfers'){
                transfers();
              }
              else if(tab=='Claims'){
                claims();
              }
              else if(tab=='NFTs'){
                nfts();
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="table-container">{renderTable()}</div>
    </div>
  );
}

export default History;