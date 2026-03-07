const express = require('express');
const authMiddleware = require('../middleware/auth.middleware.js')

const transactionRoutes = express.Router();

// Post /api/transaction
// create a new transaction
transactionRoutes.post('/',authMiddleware,)

module.exports = transactionRoutes;