const express = require('express');
const authRouter = require('./routes/auth.routes.js')
const accountRouter = require('./routes/account.routes.js')
const cookieparser = require('cookie-parser');
const transactionRoutes = require('./routes/transaction.routes.js');


const app = express();

app.use(express.json());
app.use(cookieparser());

app.use('/api/auth',authRouter)
app.use('/api/accounts',accountRouter)
app.use('/api/transactions',transactionRoutes)

module.exports = app;

