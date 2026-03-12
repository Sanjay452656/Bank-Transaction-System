const express = require('express')
const {authMiddleware} = require('../middleware/auth.middleware.js');
const {createAccount,getAccounts,getAccountBalance} = require('../controller/account.controller.js');

const router = express.Router();

// api/accounts
// create a new account
// Protected route
router.post("/",authMiddleware,createAccount)

router.get('/',authMiddleware,getAccounts)

// get account balance
// /api/accounts/balance/:accountId
router.get('/balance/:accountId',authMiddleware,getAccountBalance)

module.exports = router;
