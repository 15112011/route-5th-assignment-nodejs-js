const { Router } = require('express')
const {
  initializeInventoryTable,
  injectTypeField,
  discardTypeField,
  enforceNameConstraint,
  registerNewItem,
  adjustItemCost,
  removeItemRecord,
  fetchMaxInventoryItem,
  fetchUnsoldItems
} = require('./products.controller')

const inventoryRouter = Router()

inventoryRouter.post('/create-table', initializeInventoryTable)
inventoryRouter.patch('/add-category', injectTypeField)
inventoryRouter.delete('/remove-category', discardTypeField)
inventoryRouter.patch('/modify-productname', enforceNameConstraint)
inventoryRouter.post('/', registerNewItem)
inventoryRouter.patch('/:id', adjustItemCost)
inventoryRouter.delete('/:id', removeItemRecord)
inventoryRouter.get('/highest-stock', fetchMaxInventoryItem)
inventoryRouter.get('/never-sold', fetchUnsoldItems)

module.exports = inventoryRouter
