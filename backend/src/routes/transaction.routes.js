const express = require('express');
const { authMiddleware, authSystemUserMiddleware } = require('../middleware/auth.middleware.js');
const { createTransaction, createInitialFundsTransaction } = require('../controller/transaction.controller.js');

const transactionRoutes = express.Router(); 

// Post /api/transaction
// create a new transaction
transactionRoutes.post('/',authMiddleware,createTransaction)

// POSt /api/transaction/system/initial-funds
// create initial funds transaction from system user
transactionRoutes.post('/system/initial-funds',authSystemUserMiddleware,createInitialFundsTransaction)

module.exports = transactionRoutes;