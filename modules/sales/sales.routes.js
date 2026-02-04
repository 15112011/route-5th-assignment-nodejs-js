const { Router } = require('express')
const {
  initTransactionTable,
  processNewTransaction,
  aggregateProductSales,
  fetchTransactionDetails
} = require('./sales.controller')

const transactionRouter = Router()

transactionRouter.post('/create-table', initTransactionTable)
transactionRouter.post('/', processNewTransaction)
transactionRouter.get('/total-by-product', aggregateProductSales)
transactionRouter.get('/details', fetchTransactionDetails)

module.exports = transactionRouter
