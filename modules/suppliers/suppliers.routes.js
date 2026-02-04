const { Router } = require('express')
const {
  setupProviderTable,
  adjustContactFormat,
  enrollProvider,
  queryProviders
} = require('./suppliers.controller')

const providerRoutes = Router()

providerRoutes.post('/create-table', setupProviderTable)
providerRoutes.patch('/modify-contact', adjustContactFormat)
providerRoutes.post('/', enrollProvider)
providerRoutes.get('/search', queryProviders)

module.exports = providerRoutes
