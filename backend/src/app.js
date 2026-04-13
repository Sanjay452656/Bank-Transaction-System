const express = require('express');
const authRouter = require('./routes/auth.routes.js')
const accountRouter = require('./routes/account.routes.js')
const cookieparser = require('cookie-parser');
const transactionRoutes = require('./routes/transaction.routes.js');
const cors = require('cors');


const app = express();

app.get('/',(req,res)=>{
  res.send("Welcome to the bank app API");
})

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieparser());

app.use('/api/auth',authRouter)
app.use('/api/accounts',accountRouter)
app.use('/api/transactions',transactionRoutes)

module.exports = app;
