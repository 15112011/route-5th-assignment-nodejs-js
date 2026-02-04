const { dbInstance } = require('../../db')

const setupProviderTable = (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      SupplierName VARCHAR(100) NOT NULL,
      ContactNumber VARCHAR(20) NOT NULL
    )
  `
  dbInstance.query(sql, (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Provider table ready', data })
  })
}

const adjustContactFormat = (req, res) => {
  dbInstance.query('ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)', (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Contact format updated', data })
  })
}

const enrollProvider = (req, res) => {
  const { SupplierName, ContactNumber } = req.body
  const sql = 'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)'

  dbInstance.query(sql, [SupplierName, ContactNumber], (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(201).json({
      success: true,
      message: 'Provider enrolled',
      data: { id: data.insertId, SupplierName, ContactNumber }
    })
  })
}

const queryProviders = (req, res) => {
  const { name } = req.query
  dbInstance.query('SELECT * FROM Suppliers WHERE SupplierName LIKE ?', [`${name}%`], (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, count: data.length, data })
  })
}

module.exports = {
  setupProviderTable,
  adjustContactFormat,
  enrollProvider,
  queryProviders
}
