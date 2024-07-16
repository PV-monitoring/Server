const express = require('express')
const db = require('../database/connection.js')

const signupRouter = express.Router()

signupRouter.post('/',(req, res) => {
    const sentEmail = req.body.Email
    const sentUserName = req.body.userName
    const sentPassword = req.body.password

    const SQL = 'INSERT INTO userregister (email,username,password) VALUES (?,?,?)'

    const Values = [sentEmail,sentUserName,sentPassword]

    db.query(SQL, Values, (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send({ message: 'Error adding user' });
        } else {
            console.log('User inserted successfully!');
            res.send({ message: 'User added!' });
        }

    })
})

module.exports = signupRouter