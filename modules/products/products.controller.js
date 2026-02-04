const { dbInstance } = require('../../db')

const initializeInventoryTable = (req, res) => {
  const query = `
    CREATE TABLE IF NOT EXISTS Products (
      ProductID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ProductName VARCHAR(100) NOT NULL,
      Price DECIMAL(10,2),
      StockQuantity INT(11),
      SupplierID INT(11),
      FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    )
  `
  dbInstance.query(query, (error, data) => {
    if (error) {
      return res.status(500).json({ success: false, error })
    }
    return res.status(200).json({ success: true, message: 'Table initialized', data })
  })
}

const injectTypeField = (req, res) => {
  dbInstance.query('ALTER TABLE Products ADD COLUMN Category VARCHAR(50)', (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Column injected', data })
  })
}

const discardTypeField = (req, res) => {
  dbInstance.query('ALTER TABLE Products DROP COLUMN Category', (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Column dropped', data })
  })
}

const enforceNameConstraint = (req, res) => {
  const sql = 'ALTER TABLE Products MODIFY ProductName VARCHAR(100) NOT NULL'
  dbInstance.query(sql, (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Constraint applied', data })
  })
}

const registerNewItem = (req, res) => {
  const { ProductName, Price, StockQuantity, SupplierID } = req.body
  const sql = 'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)'

  dbInstance.query(sql, [ProductName, Price, StockQuantity, SupplierID], (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(201).json({
      success: true,
      message: 'Item registered',
      data: { id: data.insertId, ...req.body }
    })
  })
}

const adjustItemCost = (req, res) => {
  const { id } = req.params
  const { Price } = req.body
  dbInstance.query('UPDATE Products SET Price = ? WHERE ProductID = ?', [Price, id], (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Cost updated', data })
  })
}

const removeItemRecord = (req, res) => {
  dbInstance.query('DELETE FROM Products WHERE ProductID = ?', [req.params.id], (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Record deleted', data })
  })
}

const fetchMaxInventoryItem = (req, res) => {
  dbInstance.query('SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1', (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, data: data[0] })
  })
}

const fetchUnsoldItems = (req, res) => {
  const query = `
    SELECT P.* FROM Products P 
    LEFT JOIN Sales S ON P.ProductID = S.ProductID 
    WHERE S.SaleID IS NULL
  `
  dbInstance.query(query, (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, data })
  })
}

module.exports = {
  initializeInventoryTable,
  injectTypeField,
  discardTypeField,
  enforceNameConstraint,
  registerNewItem,
  adjustItemCost,
  removeItemRecord,
  fetchMaxInventoryItem,
  fetchUnsoldItems
}
