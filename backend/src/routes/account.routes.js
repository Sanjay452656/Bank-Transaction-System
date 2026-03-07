const express = require('express')
const authMiddleware = require('../middleware/auth.middleware.js');
const createAccount = require('../controller/account.controller.js');


const router = express.Router();

// api/accounts
// create a new account
// Protected route
router.post("/",authMiddleware,createAccount)


module.exports = router;
