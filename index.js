const expressModule = require('express')
const { establishConnection } = require('./db')

const supplierEndpoints = require('./modules/suppliers/suppliers.routes')
const productEndpoints = require('./modules/products/products.routes')
const salesEndpoints = require('./modules/sales/sales.routes')
const adminEndpoints = require('./modules/admin/admin.routes')

const SERVER_PORT = 3000
const coreApp = expressModule()

coreApp.use(expressModule.json())

establishConnection()

coreApp.use('/api/suppliers', supplierEndpoints)
coreApp.use('/api/products', productEndpoints)
coreApp.use('/api/sales', salesEndpoints)
coreApp.use('/api/admin', adminEndpoints)

coreApp.listen(SERVER_PORT, () => {
  console.log(`Core system active here: http://localhost:${SERVER_PORT}`)
})
