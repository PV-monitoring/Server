const express = require('express')
const db = require('../database/connection.js')

const loginRouter = express.Router()

loginRouter.post('/Login', (req, res) => {
    const sentloginUserName = req.body.LoginuserName
    const sentloginPassword = req.body.Loginpassword

    const SQL = 'SELECT * FROM userregister WHERE username = ? AND password = ?'

    const Values = [sentloginUserName,sentloginPassword]

    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send({error: err})
        }
        if (results.length > 0) {
            res.send(results)
            console.log('Login successfull!')
        }
        else {
            res.send({message: "Credentials Don't Match!"})
            console.log("Credentials Don't Match!")
        }
    })

})

module.exports = loginRouter