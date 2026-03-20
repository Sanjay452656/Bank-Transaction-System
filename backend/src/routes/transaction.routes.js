const express = require('express');
const { authMiddleware, authSystemUserMiddleware } = require('../middleware/auth.middleware.js');
const { createTransaction, createInitialFundsTransaction, getTransactionHistory } = require('../controller/transaction.controller.js');

const transactionRoutes = express.Router(); 

// GET /api/transactions
// get transaction history for the logged-in user
transactionRoutes.get('/', authMiddleware, getTransactionHistory)

// Post /api/transaction
// create a new transaction
transactionRoutes.post('/',authMiddleware,createTransaction)

// POSt /api/transaction/system/initial-funds
// create initial funds transaction from system user
transactionRoutes.post('/system/initial-funds',authSystemUserMiddleware,createInitialFundsTransaction)

module.exports = transactionRoutes;