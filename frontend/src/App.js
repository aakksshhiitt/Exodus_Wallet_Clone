import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { ethers } from 'ethers';
import { parseEther, formatEther } from 'ethers';
import { parseUnits, formatUnits } from "ethers";
import { useEffect } from 'react';
import "./App.css";



let provider, signer, AContractProvider, BContractProvider, CContractProvider, walletContractProvider, AContractSigner,BContractSigner,CContractSigner, walletContractSigner;





  const tokens = [
    { symbol: 'ETH', name: 'ETH'},
    { symbol: 'TA', name: 'TokenA'},
    { symbol: 'TB', name: 'TokenB'},
    { symbol: 'RT', name: 'Reward Token'},
  ];

 
const tokenAddresses={
	ETH: "0x0000000000000000000000000000000000000000",
	TA : "0x1781D77A7F74a2d0B55D37995CE3a4293203D3bc",
	TB : "0xB59505810840F523FF0da2BBc71581F84Fc1f2B1",
	RT : "0xb884F05Ca9c0b1d42FA7c446CF9f76be2bc4650E"
}
const walletContract = "0xFED17367D4465A41ce4bA4b73A7903F1f35816ed";


// Minimal ERC20 ABI to approve
const A_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const B_ABI=[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const C_ABI=[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// Swap contract ABI
const WALLET_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rewardPerETH",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ETH_ADDRESS",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TokenB",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TokenC",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "activateRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "checkRewardEarnedTillNow",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimStakingRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "depositTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "ethBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			}
		],
		"name": "fundsAvailableToWithdraw",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "poolFee",
		"outputs": [
			{
				"internalType": "uint24",
				"name": "",
				"type": "uint24"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardAPR",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardActivation",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "showMyStakedAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "stakeFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapRouter02",
		"outputs": [
			{
				"internalType": "contract IV3SwapRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenA",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenB",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			}
		],
		"name": "swapTokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "transferTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unstakeTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userHolding",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawAllETH",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const quoterABI=[
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenIn", "type": "address" },
          { "internalType": "address", "name": "tokenOut", "type": "address" },
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          { "internalType": "uint24", "name": "fee", "type": "uint24" },
          { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "internalType": "struct IQuoterV2.QuoteExactInputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "quoteExactInputSingle",
    "outputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
      { "internalType": "uint160", "name": "sqrtPriceX96After", "type": "uint160" },
      { "internalType": "uint32", "name": "initializedTicksCrossed", "type": "uint32" },
      { "internalType": "uint256", "name": "gasEstimate", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];



function App() {

  const [formData,setFormData]=useState({
    depositAmount:"",
    withdrawAmount:"",
    transferAmount:"",
	stakeAmount:"",
	swapAmount:"",
	swappedAmount:"",
    receiveAmount:""
  })
  const [tokenAddress,setTokenAddress]=useState("");
  const [amount, setAmount] = useState('');

   const [activeTab, setActiveTab] = useState('Swap');
  const [payToken, setPayToken] = useState('Select');
  const [receiveToken, setReceiveToken] = useState('Select');
  const [depositToken, setDepositToken] = useState('Select');
  const [withdrawToken, setWithdrawToken] = useState('Select');
  const [stakeToken, setStakeToken] = useState('Select');
  const [payDropdownOpen, setPayDropdownOpen] = useState(false);
  const [receiveDropdownOpen, setReceiveDropdownOpen] = useState(false);
  const [depositDropdownOpen, setdepositDropdownOpen] = useState(false);
  const [withdrawDropdownOpen, setwithdrawDropdownOpen] = useState(false);
  const [stakeDropdownOpen, setStakeDropdownOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [info, setinfo] = useState('');


   useEffect(()=>{

    const initializer=async()=>{
          // check if metamask is installed or not 
      if(await !window.ethereum){
    	  alert("Install Metamask");
        return;
    }

    try{
		// getting the ethereum accounts connected to the user wallet
    	const accounts=await window.ethereum.request({method:'eth_accounts'}); 

		// if it gives no account, request to open metamask is given
    	if(accounts.length===0){
          await window.ethereum.request({method:'eth_requestAccounts'});
        }
        provider= await new ethers.BrowserProvider(window.ethereum);   // getting the provider
        signer= await provider.getSigner();                      // getting the signer
        AContractProvider= await new ethers.Contract(tokenAddresses.TA,A_ABI, provider);   
        BContractProvider= await new ethers.Contract(tokenAddresses.TB,B_ABI, provider);  
        CContractProvider= await new ethers.Contract(tokenAddresses.RT,C_ABI, provider);   
        walletContractProvider= await new ethers.Contract(walletContract,WALLET_ABI, provider);  // instance of smart contract to read from the chain
                           // getting the signer
        AContractSigner= await new ethers.Contract(tokenAddresses.TA,A_ABI, signer);
        BContractSigner= await new ethers.Contract(tokenAddresses.TB,B_ABI, signer);
        CContractSigner= await new ethers.Contract(tokenAddresses.RT,C_ABI, signer);
        walletContractSigner= await new ethers.Contract(walletContract,WALLET_ABI, signer);     // instance of the smart contract to make changes to the blockchain state
      }
      catch(err){
        if(err.code===-32002){
          alert("Metamask is already requesting access, Open the popup.");
        }
        else{
          console.log("Connection error: ", err);
        }
      }
    }
    initializer();
  })

   const handleSwapTokens = () => {
    const tempToken = payToken;
    const tempAmount = payAmount;
    setPayToken(receiveToken);
    setReceiveToken(tempToken);
    setPayAmount(receiveAmount);
    setReceiveAmount(tempAmount);
  };

  const balance1= async(e)=>{
		const userAddress = await signer.getAddress();
    if(e=="TA"){
		  const tx=await walletContractSigner.fundsAvailableToWithdraw(userAddress, tokenAddresses["TA"]);
		  setinfo("Your Token A balance: " +Math.floor(formatUnits(tx, 18) * 1e5) / 1e5);
    }
    else if(e=="TB"){
		  const tx=await walletContractSigner.fundsAvailableToWithdraw(userAddress, tokenAddresses["TB"]);
		  setinfo("Your Token B balance: " +Math.floor(formatUnits(tx, 18) * 1e5) / 1e5);
    }
    else if(e=="RT"){
		  const tx=await walletContractSigner.fundsAvailableToWithdraw(userAddress, tokenAddresses["RT"]);
		  setinfo("Your Reward Token balance: " +Math.floor(formatUnits(tx, 18) * 1e5) / 1e5);
    }
    else if(e=="ETH"){
		  const tx=await walletContractSigner.fundsAvailableToWithdraw(userAddress, tokenAddresses["ETH"]);
		  setinfo("Your ETH balance: " +Math.floor(formatUnits(tx, 18) * 1e5) / 1e5);
	}
  }

   const getOutputTokens=async()=>{
   
	try {

    if(payToken=="ETH" || receiveToken=="ETH"){
			document.querySelector(".details").innerText = "ETH is only for staking for now";
			return;
		}
		if(payToken=="Select" || receiveToken=="Select" || formData.swapAmount==""){
			document.querySelector(".details").innerText = "Please select the token and add the amount to swap";
			return;
		}

    	const quoterAddress = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3"; // Uniswap QuoterV2
    	const quoter = new ethers.Contract(quoterAddress, quoterABI, signer);
    	const quoteParams = {
      		tokenIn: tokenAddresses[payToken],
      		tokenOut: tokenAddresses[receiveToken],
      		amountIn: parseUnits(String(formData.swapAmount),18),
      		fee: 3000,
      		sqrtPriceLimitX96: 0
    	};
		// console.log(quoteParams);
		const quote = await quoter.quoteExactInputSingle.staticCall(quoteParams);
		// console.log(String(quote.amountOut));
    	setFormData({...formData, receiveAmount:(formatUnits(quote.amountOut))});

		return;
    } 
	catch (err) {
      	console.error(err);
      	setinfo("Swap Error: " + (err.reason || err.message));
    }
  }

  const activate=async()=>{
    try {
		const userAddress = await signer.getAddress();
		const amount= await CContractSigner.balanceOf(userAddress);
		const tx= await CContractSigner.approve(walletContract,amount);
		setinfo("Activating...");
		await tx.wait();
		await walletContractSigner.activateRewards();
		setinfo("Activated...");
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const swap=async()=>{

    try {

    if(payToken=="ETH" || receiveToken=="ETH"){
			document.querySelector(".details").innerText = "ETH is only for staking for now";
			return;
		}
		if(payToken=="Select" || receiveToken=="Select" || formData.swapAmount==""){
			document.querySelector(".details").innerText = "Please refresh and select the token and add the amount to swap";
			return;
		}

		const inputToken=tokenAddresses[payToken];
		const outputToken=tokenAddresses[receiveToken];
		const amount=parseUnits(String(formData.swapAmount),18);
		
		// console.log(amount);
		const tx= await walletContractSigner.swapTokens(inputToken, outputToken, amount);
		document.querySelector(".details").innerText = "Swapping, please wait";
		await tx.wait(); 
		document.querySelector(".details").innerText = "Swap Completed, check your balance in deposit section";
		// setinfo("available funds: " + tx);
		// formData.availableTokenAddress="";
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const deposit=async()=>{
    try {
		if(depositToken=="Select" || formData.depositAmount==""){
			document.querySelector(".details").innerText = "Please refresh and enter the details";
			return;
		}
		if(tokenAddresses[depositToken]=="0x0000000000000000000000000000000000000000"){
			const amount=parseUnits(String(formData.depositAmount),18);
			const tx=await walletContractSigner.depositTokens(tokenAddresses[depositToken],amount,{value:amount});
			setinfo("Deposit Processing");
			await tx.wait();
			setinfo("Deposited, check balance");
			formData.depositAmount="";
			return;
		}

		const amount=parseUnits(String(formData.depositAmount),18);
		const tx= await AContractSigner.approve(walletContract, amount);
		setinfo("Approving...");
		await tx.wait();
		setinfo("Approved...");
		const tx2=await walletContractSigner.depositTokens(tokenAddresses[depositToken],amount);
		setinfo("Deposit Processing");
		await tx2.wait();
		setinfo("Deposited, check balance");
		formData.depositAmount="";
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const withdraw=async()=>{
    try {
		if(tokenAddresses[depositToken]=="" || formData.depositAmount==""){
			document.querySelector(".details").innerText = "Please refresh and enter the details";
			return;
		}

		const amount=parseUnits(String(formData.depositAmount),18);
		const tx=await walletContractSigner.withdrawFunds(tokenAddresses[depositToken],amount);
		setinfo("Processing");
		await tx.wait();
		setinfo("Withdrawl Successful...");
		formData.depositAmount="";
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const transfer=async()=>{
    try {
    if(withdrawToken=="ETH"){
			document.querySelector(".details").innerText = "ETH is only for staking for now";
			return;
		}
		if(tokenAddresses[withdrawToken]=="select" || formData.withdrawAmount==""){
			document.querySelector(".details").innerText = "Please refresh and enter the details";
			return;
		}

		const amount=parseUnits(String(formData.withdrawAmount),18);
		const tx=await walletContractSigner.transferTokens(tokenAddresses[withdrawToken], formData.transferReceiverAddress, amount);
		setinfo("Processing");
		await tx.wait();
		setinfo("Transfer Completed, check balance");
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const stake=async()=>{
    try {

		if(formData.stakeAmount==""){
			document.querySelector(".details").innerText = "Please refresh and enter the details";
			return;
		}
		const amount=parseUnits(String(formData.stakeAmount),18);
		// console.log(amount);
		const tx=await walletContractSigner.stakeFunds(amount);
		setinfo("Processing");
		await tx.wait();
		setinfo("Funds Staked, check staking balance");
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const checkStakedFunds=async()=>{
    try {

		// console.log(walletContractSigner);
		const tx=await walletContractSigner.showMyStakedAmount();
		const amount = formatEther(tx);
		setinfo(amount);
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const unStake=async()=>{
    try {
		const tx=await walletContractSigner.unstakeTokens();
		setinfo("Processing");
		await tx.wait();
		setinfo("Tokens Unstaked");
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const checkRewards=async()=>{
    try {
		const tx=await walletContractSigner.checkRewardEarnedTillNow();
		const decimalValue = formatUnits(tx, 36);
		setinfo(decimalValue + "  Reward Tokens");
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }

  const claim=async()=>{
    try {

		const tx1=await walletContractSigner.claimStakingRewards();
		setinfo("Claiming");
		await tx1.wait();
		setinfo("Claimed");
    } 
    catch (err) {
      let errorMessage = "An unexpected error occurred.";

  			if (err.code === "CALL_EXCEPTION" && err.reason) {
    			errorMessage = err.reason;
  			} else if (err.info && err.info.error && err.info.error.message) {
    			errorMessage = err.info.error.message;
  			} else if (err.message) {
    			errorMessage = err.message;
  			}
  			document.querySelector(".details").innerText = errorMessage;
    }
  }




// // use your wallet to sign transactions.

// // const PRIVATE_KEY = "0xYOUR_PRIVATE_KEY_HERE";
// // const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
// // const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
// // const contract = new ethers.Contract(contractAddress, contractABI, wallet);


 

  const renderTokenDropdown = (isOpen, setIsOpen, selectedToken, onSelect, type) => (
    <div className="token-selector" onClick={() => setIsOpen(!isOpen)}>
      <div className="token-display">
        <span className="token-symbol">{selectedToken}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          {tokens.map((token) => (
            <div 
              key={token.symbol}
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(token.symbol);
                setIsOpen(false);
                balance1(token.symbol);
              }}
            >
              <div className={`token-icon ${token.symbol.toLowerCase()}`}>
                {token.symbol === 'ETH' && '⟠'}
                {token.symbol === 'USDT' && '₮'}
                {token.symbol === 'BTC' && '₿'}
                {token.symbol === 'USDC' && '$'}
                {token.symbol === 'DAI' && '◈'}
              </div>
              <div className="token-info">
                <span className="token-name">{token.symbol}</span>
                <span className="token-balance">{token.balance}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSwapInterface = () => (
    <div className="swap-container">
      <div className="swap-section">
        <div className="section-header">
          <span className="section-label">You Pay</span>
        </div>
        <div className="input-row">
          {renderTokenDropdown(payDropdownOpen, setPayDropdownOpen, payToken, setPayToken, 'pay')}
          <div className="amount-section">
          <input type="text" className='amount-input' placeholder="Amount " value={formData.swapAmount} onChange={(e)=>{setFormData({...formData, swapAmount:e.target.value }) }}/>

             
          </div>
        </div>
      </div>
      <div className="swap-section">
        <div className="section-header">
          <span className="section-label">Receive</span>
        </div>
        <div className="input-row">
          {renderTokenDropdown(receiveDropdownOpen, setReceiveDropdownOpen, receiveToken, setReceiveToken, 'receive')}
          <div className="amount-section">
          <input type="text" className='amount-input' placeholder="You receive" value={formData.receiveAmount} onChange={(e)=>setFormData({...formData, receiveAmount:receiveAmount})}/>

          </div>
        </div>
      </div>

      <div>
        <button className="main-stake-button" onClick={getOutputTokens}>Check</button>&nbsp;
        <button className="main-stake-button" onClick={swap}>Swap</button>&nbsp;
      </div>  
    </div>
    
  );

  const renderDepositInterface = () => (
    <div className="deposit-container">
      <div className="deposit-section">
        <div className="section-header">
        </div>
        <div className="section-header">
          <span className="section-label">Select Token</span>
        </div>
        <div className="input-row">
          {renderTokenDropdown(depositDropdownOpen, setdepositDropdownOpen, depositToken, setDepositToken, 'deposit')}
          <div className="amount-section">
          <input type="text" className='amount-input' placeholder="Amount " value={formData.depositAmount} onChange={(e)=>setFormData({...formData, depositAmount:e.target.value })}/>
          </div>
        </div>
        <button className="main-stake-button" onClick={deposit}>Deposit</button>&nbsp;&nbsp;&nbsp;
        <button className="main-stake-button" onClick={withdraw}>Withdraw</button>
      </div>
      <div className="deposit-section">
        <div className="section-header">
        </div>
         <div className="section-header">
          <span className="section-label">Select Token</span>
        </div>
        <div className="input-row">
          {renderTokenDropdown(withdrawDropdownOpen, setwithdrawDropdownOpen, withdrawToken, setWithdrawToken, 'deposit')}
          <div className="amount-section">
          <input type="text" className='amount-input2' placeholder="Amount " value={formData.withdrawAmount} onChange={(e)=>setFormData({...formData, withdrawAmount:e.target.value })}/><br></br><br></br>
          <input type="text" className='amount-input2' placeholder="receiver " value={formData.transferReceiverAddress} onChange={(e)=>setFormData({...formData, transferReceiverAddress:e.target.value })}/>
          </div>
        </div>
        <button className="main-swap-button" onClick={transfer}>Transfer</button>
      </div>
    </div>
  );

  const renderStakeInterface = () => (
    <div className="stake-container">
      <div className="stake-section">
        <div className="input-row">
          <button className="main-stake-button" onClick={stake}>Stake(ETH)</button>
          <div className="amount-section">
          <input type="Number" className='amount-input1'  placeholder="  amount" value={formData.stakeAmount} onChange={(e)=>setFormData({...formData,stakeAmount:e.target.value})}/>
          </div>
        </div>
      </div>
      <div className="stake-section">
          
          &nbsp;&nbsp;<button className="main-stake-button" onClick={checkStakedFunds}> Staked Amount</button>&nbsp;
          <button className="main-stake-button" onClick={checkRewards}>Check Rewards</button>&nbsp;
          <button className="main-swap-button" onClick={unStake}>Unstake(ETH)</button>&nbsp;
          
      </div>
      <button className="main-claim-button" onClick={claim}>Claim Rewards</button>
      <br></br><br></br>
    </div>
  );

  return (
    <div className="app-container">
      <style>{`
        
      `}</style>
      
      <div className="header">
        <div className="logo">Wallet</div>
        <div className="user-section">
          <div className="notification-icon">🔔</div>
          <div className="user-info">
            <span>Connected</span>
            <div style={{width: '20px', height: '20px', borderRadius: '50%', background: '#4ade80'}}></div>
          </div>
        </div>
      </div>

      <div className="main-interface">
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <button 
            className={`interface-tab ${activeTab === 'Swap' ? 'active' : ''}`}
            onClick={() => setActiveTab('Swap')}
            style={{flex: 1}}
          >
            Swap
          </button>
          <button 
            className={`interface-tab ${activeTab === 'Deposit' ? 'active' : ''}`}
            onClick={() => setActiveTab('Deposit')}
            style={{flex: 1}}
          >
            Deposit
          </button>
          <button 
            className={`interface-tab ${activeTab === 'Stake' ? 'active' : ''}`}
            onClick={() => setActiveTab('Stake')}
            style={{flex: 1}}
          >
            Stake
          </button>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '20px'}}>
        </div>

        {activeTab === 'Swap' && renderSwapInterface()}
        {activeTab === 'Deposit' && renderDepositInterface()}
        {activeTab === 'Stake' && renderStakeInterface()}
      </div>
      <br></br>
      <div className="balance-info">
          <p className='details'>{info}</p>
      </div>
    </div>
  );
};

export default App;