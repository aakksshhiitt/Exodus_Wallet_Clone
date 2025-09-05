import React, { useState, useEffect } from 'react';
import './history.css';

function History() {
  const tabs = [
    'Swap Details',
    'Staking',
    'Deposits',
    'Withdrawals',
    'Transfers',
    'Claims',
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [data, setData] = useState({
    'Swap Details': [],
    Staking: [],
    Deposits: [],
    Withdrawals: [],
    Transfers: [],
    Claims: [],
  });

  useEffect(() => {
    // Placeholder for actual data fetching (e.g. queryFilter from Ethers.js)
    setData({
      'Swap Details': 
      [
        { id: 1, from: 'Alice', to: 'Bob', amount: 100 }, 
        { id: 1, from: 'Blice', to: 'Bob', amount: 100 }, 
        { id: 1, from: 'Alice', to: 'Bob', amount: 100 }
      ],
      Staking: [{ id: 2, staker: 'Carol', amount: '50 ETH' }],
      Deposits: [{ id: 3, user: 'Dave', amount: '0.5 BTC' }],
      Withdrawals: [{ id: 4, user: 'Eve', amount: '200 USDT' }],
      Transfers: [{ id: 5, sender: 'Frank', receiver: 'Grace', amount: 300 }],
      Claims: [{ id: 6, claimer: 'Heidi', reward: '10 Token' }],
    });
  }, []);

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
            onClick={() => setActiveTab(tab)}
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