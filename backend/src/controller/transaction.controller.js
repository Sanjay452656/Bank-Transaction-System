const transactionModel = require('../models/transaction.model.js')
const ledgerModel = require('../models/ledger.model.js')
const accountModel = require('../models/account.model.js')
const mongoose = require('mongoose');

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

async function createTransaction(req, res) {

    //  1. Validate request
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Required fields are not given"
        })
    }

    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid from or to Account"
        })
    }
    /**
     * 2. Validate idempotency key
     */
    const isTransactionAlreadyExists = await transactionModel.findOne({ idempotencyKey: idempotencyKey })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Trasaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is pending"
            })
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(200).json({
                message: "Transaction is still processing"
            })
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    /**
     * 3. Check account status
     */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**
     * 4. Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
        return res.status(400).json({
            message: "Insufficent balance"
        })
    }


    /**
    * 5. Create transaction (PENDING)
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        status: "PENDING",
        amount,
        idempotencyKey,
    }, { session })

    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    }, { session })

    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }, { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction();
    session.endSession()

    /**
     * 10. Send email notification
     */
    const subject = "Transaction Successful";

    const html = `
   <h2>Transaction Completed</h2>
   <p>Your transfer was successful.</p>

   <ul>
   <li><b>From Account:</b> ${fromAccount}</li>
   <li><b>To Account:</b> ${toAccount}</li>
   <li><b>Amount:</b> ₹${amount}</li>
   <li><b>Transaction ID:</b> ${transaction._id}</li>
   <li><b>Status:</b> COMPLETED</li>
   </ul>

   <p>Thank you for using Bank App.</p>
   `;

    await sendEmail(fromUserAccount.email, subject, html);

    return res.status(201).json({
        message:"Transaction completed successfully",
        transaction:transaction
    })


}


async function createInitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey} = req.body;
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(401).json({
            message:"All fields are required"
        })
    }

    const toUserAccount = await accountModel.findOne({_id:toAccount});

    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid toAccount "
        })
    }
    console.log("REQ USER:", req.user._id);
    const fromUserAccount = await accountModel.findOne({
        user:req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }

    // whenever you pass the data through session always pass through array
   const session = await mongoose.startSession();
session.startTransaction();

const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    status: "PENDING",
    amount,
    idempotencyKey
});

await transaction.save({ session });

await ledgerModel.create([{
    account: fromUserAccount._id,
    amount,
    transaction: transaction._id,
    type: "DEBIT"
}], { session });

await ledgerModel.create([{
    account: toAccount,
    amount,
    transaction: transaction._id,
    type: "CREDIT"
}], { session });

transaction.status = "COMPLETED";
await transaction.save({ session });

await session.commitTransaction();

    return res.status(201).json({
        message:"Initial funds transaction completed",
        transaction:transaction
    })

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
};
