import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { ethers } from 'ethers';
import { parseEther, formatEther } from 'ethers';
import { parseUnits, formatUnits } from "ethers";
import { useEffect } from 'react';
import "./App.css";



let provider, signer, AContractProvider, BContractProvider, CContractProvider, walletContractProvider, AContractSigner,BContractSigner,CContractSigner, walletContractSigner;

const tokenAddresses={
	ETH: "0x0000000000000000000000000000000000000000",
	TOKEN_A : "0x1781D77A7F74a2d0B55D37995CE3a4293203D3bc",
	TOKEN_B : "0xB59505810840F523FF0da2BBc71581F84Fc1f2B1",
	REWARD_TOKEN : "0xb884F05Ca9c0b1d42FA7c446CF9f76be2bc4650E"
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
    depositTokenAddress:"",
    withdrawTokenAddress:"",
    transferTokenAddress:"",
    availableTokenAddress:"",
	transferReceiverAddress:"",
    depositAmount:"",
    withdrawAmount:"",
    transferAmount:"",
	stakeAmount:"",
	swapAmount:"",
	swappedAmount:""
  })
  const [tokenAddress,setTokenAddress]=useState("");
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [stakeStatus, setStakeStatus] = useState('');

  
  const [activeTab, setActiveTab] = useState('swap');
  const [fromToken, setFromToken] = useState('Select token');
  const [toToken, setToToken] = useState('');
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [tokenCheckDropdownOpen, setTokenCheckDropdownOpen] = useState(false);

  const tokenOptions = ['TOKEN_A', 'TOKEN_B', 'REWARD_TOKEN'];
  const tokenOptions2 = ['ETH', 'TOKEN_A', 'TOKEN_B', 'REWARD_TOKEN'];


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
        AContractProvider= await new ethers.Contract(tokenAddresses.TOKEN_A,A_ABI, provider);
        BContractProvider= await new ethers.Contract(tokenAddresses.TOKEN_B,B_ABI, provider);
        CContractProvider= await new ethers.Contract(tokenAddresses.REWARD_TOKEN,C_ABI, provider);
        walletContractProvider= await new ethers.Contract(walletContract,WALLET_ABI, provider);  // instance of smart contract to read from the chain
                            // getting the signer
        AContractSigner= await new ethers.Contract(tokenAddresses.TOKEN_A,A_ABI, signer);
        BContractSigner= await new ethers.Contract(tokenAddresses.TOKEN_B,B_ABI, signer);
        CContractSigner= await new ethers.Contract(tokenAddresses.REWARD_TOKEN,C_ABI, signer);
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

   const getOutputTokens=async()=>{
   
	try {

		if(fromToken=="Select token" || toToken=="Select token" || formData.swapAmount==""){
			document.querySelector(".details").innerText = "Please select the token and add the amount to swap";
			return;
		}

    	const quoterAddress = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3"; // Uniswap QuoterV2
    	const quoter = new ethers.Contract(quoterAddress, quoterABI, signer);
    	const quoteParams = {
      		tokenIn: tokenAddresses[fromToken],
      		tokenOut: tokenAddresses[toToken],
      		amountIn: parseUnits(String(formData.swapAmount),18),
      		fee: 3000,
      		sqrtPriceLimitX96: 0
    	};
		// console.log(quoteParams);
		const quote = await quoter.quoteExactInputSingle.staticCall(quoteParams);
		// console.log(String(quote.amountOut));
    	setFormData({...formData, swappedAmount:(formatUnits(quote.amountOut))});
		return;
    } 
	catch (err) {
      	console.error(err);
      	setStatus("Swap Error: " + (err.reason || err.message));
    }
  }

  const activate=async()=>{
    try {
		const userAddress = await signer.getAddress();
		const amount= await CContractSigner.balanceOf(userAddress);
		const tx= await CContractSigner.approve(walletContract,amount);
		setStatus("Activating...");
		await tx.wait();
		await walletContractSigner.activateRewards();
		setStatus("Activated...");
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
		if(fromToken=="Select token" || toToken=="Select token" || formData.swapAmount==""){
			document.querySelector(".details").innerText = "Please refresh and select the token and add the amount to swap";
			return;
		}

		const inputToken=tokenAddresses[fromToken];
		const outputToken=tokenAddresses[toToken];
		const amount=parseUnits(String(formData.swapAmount),18);
		
		// console.log(amount);
		const tx= await walletContractSigner.swapTokens(inputToken, outputToken, amount);
		document.querySelector(".details").innerText = "Swapping, please wait";
		await tx.wait(); 
		document.querySelector(".details").innerText = "Swap Completed, check your balance in deposit section";
		// setStatus("available funds: " + tx);
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

		if(formData.depositTokenAddress=="" || formData.depositAmount==""){
			document.querySelector(".details").innerText = "Please refresh and enter the details";
			return;
		}
		if(!(formData.depositTokenAddress==tokenAddresses["TOKEN_A"] || formData.depositTokenAddress==tokenAddresses["TOKEN_B"] || formData.depositTokenAddress==tokenAddresses["REWARD_TOKEN"] || formData.depositTokenAddress==tokenAddresses["ETH"])){
			document.querySelector(".details").innerText = "This token does not exist, enter token address of the selected tokens";
			return;
		}
		if(formData.depositTokenAddress=="0x0000000000000000000000000000000000000000"){
			const amount=parseUnits(String(formData.depositAmount),18);
			const tx=await walletContractSigner.depositTokens(formData.depositTokenAddress,amount,{value:amount});
			setStatus("Deposit Processing");
			await tx.wait();
			setStatus("Deposited, check balance");
			formData.depositTokenAddress="";
			formData.depositAmount="";
			return;
		}

		const amount=parseUnits(String(formData.depositAmount),18);
		const tx= await AContractSigner.approve(walletContract, amount);
		setStatus("Approving...");
		await tx.wait();
		setStatus("Approved...");
		const tx2=await walletContractSigner.depositTokens(formData.depositTokenAddress,amount);
		setStatus("Deposit Processing");
		await tx2.wait();
		setStatus("Deposited, check balance");
		formData.depositTokenAddress="";
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
		if(formData.withdrawTokenAddress=="" || formData.withdrawAmount==""){
			document.querySelector(".details").innerText = "Please refresh and enter the details";
			return;
		}
		if(!(formData.withdrawTokenAddress==tokenAddresses["TOKEN_A"] || formData.withdrawTokenAddress==tokenAddresses["TOKEN_B"] || formData.withdrawTokenAddress==tokenAddresses["REWARD_TOKEN"] || formData.withdrawTokenAddress==tokenAddresses["ETH"])){
			document.querySelector(".details").innerText = "This token does not exist, enter token address of the selected tokens";
			return;
		}

		const amount=parseUnits(String(formData.withdrawAmount),18);
		const tx=await walletContractSigner.withdrawFunds(formData.withdrawTokenAddress,amount);
		setStatus("Processing");
		await tx.wait();
		setStatus("Withdrawl Successful...");
		formData.withdrawTokenAddress="";
		formData.withdrawAmount="";
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

  const availableFunds=async()=>{
    try {
		if(formData.availableTokenAddress==""){
			document.querySelector(".details").innerText = "Please refresh and enter the token address";
			return;
		}
		if(!(formData.availableTokenAddress==tokenAddresses["TOKEN_A"] || formData.availableTokenAddress==tokenAddresses["TOKEN_B"] || formData.availableTokenAddress==tokenAddresses["REWARD_TOKEN"] || formData.availableTokenAddress==tokenAddresses["ETH"])){
			document.querySelector(".details").innerText = "This token does not exist, enter token address of the selected tokens";
			return;
		}
		const userAddress = await signer.getAddress();
		const tx=await walletContractSigner.fundsAvailableToWithdraw(userAddress, formData.availableTokenAddress);
		const amount = formatEther(tx);
		// console.log(tx);
		setStatus("available funds: " + amount);
		formData.availableTokenAddress="";
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
		if(formData.transferTokenAddress=="" || formData.transferAmount==""){
			document.querySelector(".details").innerText = "Please refresh and enter the details";
			return;
		}
		if(!(formData.transferTokenAddress==tokenAddresses["TOKEN_A"] || formData.transferTokenAddress==tokenAddresses["TOKEN_B"] || formData.transferTokenAddress==tokenAddresses["REWARD_TOKEN"] || formData.transferTokenAddress==tokenAddresses["ETH"])){
			document.querySelector(".details").innerText = "This token does not exist, enter token address of the selected tokens";
			return;
		}

		const amount=parseUnits(String(formData.transferAmount),18);
		const tx=await walletContractSigner.transferTokens(formData.transferTokenAddress, formData.transferReceiverAddress, amount);
		setStatus("Processing");
		await tx.wait();
		setStatus("Transfer Completed, check balance");
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
		setStakeStatus("Processing");
		await tx.wait();
		setStakeStatus("Funds Staked, check staking balance");
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
		setStakeStatus(amount);
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
		setStakeStatus("Processing");
		await tx.wait();
		setStakeStatus("Tokens Unstaked");
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
		setStakeStatus(decimalValue + "Reward Tokens");
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
		setStakeStatus("Claiming");
		await tx1.wait();
		setStakeStatus("Claimed");
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





  return (
	
        <div className="app-container">
		<button className="connect-btn3" onClick={activate}>Activate</button>
      <div className="uniswap-header">Wallet</div>
      <div className="tab-selector">
        <button className={activeTab === 'swap' ? 'active' : ''} onClick={() => setActiveTab('swap')}>
          Swap
        </button>
        <button className={activeTab === 'deposit' ? 'active' : ''} onClick={() => setActiveTab('deposit')}>
          Deposit
        </button>
        <button className={activeTab === 'stake' ? 'active' : ''} onClick={() => setActiveTab('stake')}>
          Stake
        </button>
      </div>

      {activeTab === 'swap' && (
        <div className="swap-panel">
          <div className="input-group">
            <label>From</label>
            <div className="input-box">
              <input type="number" placeholder="0.0" value={formData.swapAmount} onChange={(e)=>{setFormData({...formData, swapAmount:e.target.value});}}/>
              <div className="dropdown">
                <button className="token-btn" onClick={() => setFromDropdownOpen(!fromDropdownOpen)}>
                  {fromToken} ⏷
                </button>
                {fromDropdownOpen && (
                  <div className="dropdown-menu">
                    {tokenOptions.map((token) => (
                      <div
                        key={token}
                        onClick={() => {
                          setFromToken(token);
                          setFromDropdownOpen(false);
                        }}
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="arrow"><button className="connect-btn2" onClick={getOutputTokens}>Check Output ↓</button></div>

          <div className="input-group">
            <label>To</label>
            <div className="input-box">
              <input type="number" placeholder="0.0" value={formData.swappedAmount} onChange={(e)=>{setFormData({...formData, swappedAmount:e.target.value})}} />
              <div className="dropdown">
                <button className="token-btn" onClick={() => setToDropdownOpen(!toDropdownOpen)}>
                  {toToken || 'Select a token'} ⏷
                </button>
                {toDropdownOpen && (
                  <div className="dropdown-menu">
                    {tokenOptions.map((token) => (
                      <div
                        key={token}
                        onClick={() => {
                          setToToken(token);
                          setToDropdownOpen(false);
                        }}
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="connect-btn" onClick={swap}>Swap</button>

		  <br></br><br></br><br></br>
		  <h4>Check Registered Token Address</h4>
		  <div className="input-group">
                <button className="token-btn" onClick={() => setTokenCheckDropdownOpen(!tokenCheckDropdownOpen)}>
                  {fromToken} ⏷
                </button>
                {tokenCheckDropdownOpen  && (
                  <div className="dropdown-menu">
                    {tokenOptions2.map((token) => (
                      <div
                        key={token}
                        onClick={() => {
							document.querySelector(".details").innerText = tokenAddresses[token];
                        }}
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                )}
            </div>

		  <p className='details'></p>

        </div>
      )}


      {activeTab === 'deposit' && (
        <div className="tab-panel">
          <h3>Deposit Funds</h3>
          <input type="text" className='btn1' placeholder="Enter token Address" value={formData.depositTokenAddress} onChange={(e)=>setFormData({...formData, depositTokenAddress:e.target.value})} />
          <input type="Number" className='btn1' placeholder="Enter token amount" value={formData.depositAmount} onChange={(e)=>setFormData({...formData, depositAmount:e.target.value })}/>
          <button className="connect-btn" onClick={deposit}>Deposit</button>
          <h3>Withdraw</h3>
          <input type="text" className='btn1' placeholder="Enter token Address" value={formData.withdrawTokenAddress} onChange={(e)=>setFormData({...formData, withdrawTokenAddress:e.target.value})} />
          <input type="number" className='btn1' placeholder="Enter withdraw amount" value={formData.withdrawAmount} onChange={(e)=>setFormData({...formData, withdrawAmount:e.target.value})} />
          <button className="connect-btn" onClick={withdraw}>Withdraw</button>
          <h3>Transfer</h3>
          <input type="text" className='btn2' placeholder="Enter receiver's Address" value={formData.transferReceiverAddress} onChange={(e)=>setFormData({...formData, transferReceiverAddress:e.target.value})}/>
          <input type="text" className='btn2' placeholder="Enter token Address" value={formData.transferTokenAddress} onChange={(e)=>setFormData({...formData, transferTokenAddress:e.target.value})}/>
          <input type="number" className='btn2' placeholder="Enter withdraw amount" value={formData.transferAmount} onChange={(e)=>setFormData({...formData, transferAmount:e.target.value})} />
          <button className="connect-btn" onClick={transfer}>Transfer</button>
          <h3>My available Funds</h3>
          <input type="text" className='btn1' placeholder="Enter token Address" value={formData.availableTokenAddress} onChange={(e)=>setFormData({...formData, availableTokenAddress:e.target.value})} />
          <button className="connect-btn" onClick={availableFunds}>Get funds</button>
		  <p className='details'>{status}</p>
        </div>
      )}

      {activeTab === 'stake' && (
        <div className="tab-panel">
          <h3>Stake Funds (ETH)</h3>
          <input type="Number" className='half'  placeholder="Enter token amount" value={formData.stakeAmount} onChange={(e)=>setFormData({...formData,stakeAmount:e.target.value})}/>
          <button className="connect-btn2" onClick={stake}>Stake</button>&nbsp;<button className="connect-btn2" onClick={checkStakedFunds}>Check Staked Amount</button><br></br><br></br>
          <h3>Unstake Funds</h3>
          <button className="connect-btn" onClick={unStake}>Withdraw</button><br></br><br></br>
          <h3>Check Rewards Earned Till Now</h3>
          <button className="connect-btn" onClick={checkRewards}>Fetch</button><br></br><br></br>
          <h3>Claim Rewards</h3>
          <button className="connect-btn" onClick={claim}>Claim</button><br></br><br></br>
          <p className='details'>{stakeStatus}</p>
		  <p>Funds will be staked for 1 year to claim the rewards, before that you can only unstake the staking position</p>
		  
        </div>
      )}

    </div>
     

    
  );
}

export default App;




// use your wallet to sign transactions.

// const PRIVATE_KEY = "0xYOUR_PRIVATE_KEY_HERE";
// const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
// const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
// const contract = new ethers.Contract(contractAddress, contractABI, wallet);