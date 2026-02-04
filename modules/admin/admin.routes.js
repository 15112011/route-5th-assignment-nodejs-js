const { Router } = require('express')
const {
  configureManagerRole,
  removeEditPrivileges,
  authorizeSalesDeletion
} = require('./admin.controller')

const accessControlRouter = Router()

accessControlRouter.post('/create-store-manager', configureManagerRole)
accessControlRouter.delete('/revoke-update', removeEditPrivileges)
accessControlRouter.patch('/grant-delete-sales', authorizeSalesDeletion)

module.exports = accessControlRouter
