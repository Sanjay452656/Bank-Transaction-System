const express = require('express');
const authMiddleware = require('../middleware/auth.middleware.js');
const createTransaction = require('../controller/transaction.controller.js');

const transactionRoutes = express.Router();

// Post /api/transaction
// create a new transaction
transactionRoutes.post('/',authMiddleware,createTransaction)

module.exports = transactionRoutes;