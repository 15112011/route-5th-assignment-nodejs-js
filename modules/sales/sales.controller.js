const { dbInstance } = require('../../db')

const initTransactionTable = (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ProductID INT(11),
      QuantitySold INT(11),
      SaleDate DATE,
      FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    )
  `
  dbInstance.query(sql, (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Transaction ledger ready', data })
  })
}

const processNewTransaction = (req, res) => {
  const { ProductID, QuantitySold, SaleDate } = req.body
  const sql = 'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)'

  dbInstance.query(sql, [ProductID, QuantitySold, SaleDate], (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(201).json({
      success: true,
      message: 'Transaction recorded',
      data: { id: data.insertId, ProductID, QuantitySold, SaleDate }
    })
  })
}

const aggregateProductSales = (req, res) => {
  const sql = `
    SELECT P.ProductID, P.ProductName, SUM(S.QuantitySold) AS TotalSold 
    FROM Products P 
    LEFT JOIN Sales S ON P.ProductID = S.ProductID 
    GROUP BY P.ProductID, P.ProductName
  `
  dbInstance.query(sql, (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Sales aggregation complete', data })
  })
}

const fetchTransactionDetails = (req, res) => {
  const sql = `
    SELECT S.SaleID, P.ProductName, S.QuantitySold, S.SaleDate 
    FROM Sales S 
    JOIN Products P ON S.ProductID = P.ProductID
  `
  dbInstance.query(sql, (error, data) => {
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, message: 'Transaction history retrieved', data })
  })
}

module.exports = {
  initTransactionTable,
  processNewTransaction,
  aggregateProductSales,
  fetchTransactionDetails
}
