const { dbInstance } = require('../../db')

const configureManagerRole = (req, res) => {
  const { password } = req.body
  const authString = password || 'store_manager_password'

  dbInstance.query(`CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY ?`, [authString], (err, _) => {
    if (err) return res.status(500).json({ success: false, error: err })

    dbInstance.query(`GRANT SELECT, INSERT, UPDATE ON *.* TO 'store_manager'@'localhost'`, (err2, __) => {
      if (err2) return res.status(500).json({ success: false, error: err2 })

      dbInstance.query('FLUSH PRIVILEGES', (err3, ___) => {
        if (err3) return res.status(500).json({ success: false, error: err3 })

        return res.status(201).json({
          success: true,
          message: 'Manager role configured',
          data: { user: 'store_manager', privileges: ['SELECT', 'INSERT', 'UPDATE'] }
        })
      })
    })
  })
}

const removeEditPrivileges = (req, res) => {
  dbInstance.query(`REVOKE UPDATE ON *.* FROM 'store_manager'@'localhost'`, (err, _) => {
    if (err) return res.status(500).json({ success: false, error: err })

    dbInstance.query('FLUSH PRIVILEGES', (err2, __) => {
      if (err2) return res.status(500).json({ success: false, error: err2 })
      return res.status(200).json({ success: true, message: 'Edit privileges revoked' })
    })
  })
}

const authorizeSalesDeletion = (req, res) => {
  dbInstance.query('SELECT DATABASE() as db_name', (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err })

    const targetDb = result[0].db_name
    dbInstance.query(`GRANT DELETE ON ${targetDb}.Sales TO 'store_manager'@'localhost'`, (err2, _) => {
      if (err2) return res.status(500).json({ success: false, error: err2 })

      dbInstance.query('FLUSH PRIVILEGES', (err3, __) => {
        if (err3) return res.status(500).json({ success: false, error: err3 })

        return res.status(200).json({
          success: true,
          message: 'Sales deletion authorized',
          data: { scope: 'Sales', permission: 'DELETE' }
        })
      })
    })
  })
}

module.exports = {
  configureManagerRole,
  removeEditPrivileges,
  authorizeSalesDeletion
}
