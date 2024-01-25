import express from "express"
import db from '../utils/db.js';

const router = express.Router()

router.post('/Login',(req,res)=>{
    const sentloginUserName = req.body.LoginuserName
    const sentloginPassword = req.body.Loginpassword

    const SQL = 'SELECT * FROM userregister WHERE username = ? AND password = ?'

    const Values = [sentloginUserName,sentloginPassword]

    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Internal Server Error' });
        } else if (results.length > 0) {
            res.send(results);
        } else {
            res.status(401).send({ message: "Credentials Don't match!" });
        }
    })

})

export {router as loginRouter}