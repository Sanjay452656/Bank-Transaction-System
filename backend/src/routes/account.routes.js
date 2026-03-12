const express = require('express')
const {authMiddleware} = require('../middleware/auth.middleware.js');
const {createAccount,getAccounts} = require('../controller/account.controller.js');

const router = express.Router();

// api/accounts
// create a new account
// Protected route
router.post("/",authMiddleware,createAccount)

router.get('/',authMiddleware,getAccounts)

module.exports = router;
