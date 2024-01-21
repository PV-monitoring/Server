const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.listen(3002,()=>{
    console.log('Sever is running ')
} )

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password:'',
    database: 'pv_monitoring',

})

app.post('/Register',(req,res)=>{
    const sentEmail = req.body.Email
    const sentUserName = req.body.userName
    const sentPassword = req.body.password

    const SQL = 'INSERT INTO register_table (email,username,password) VALUES (?,?,?)'

    const Values = [sentEmail,sentUserName,sentPassword]

    db.query(SQL,Values,(err,results)=>{
        if(err){
            res.send(err)
        }
        else{
            console.log('User inserted successfully!')
            res.send({message:'User added!'})
        }

    })
})

app.post('/Login',(req,res)=>{
    
    const sentloginUserName = req.body.LoginuserName
    const sentloginPassword = req.body.Loginpassword

    const SQL = 'SELECT * FROM register_table WHERE username = ? && password = ? '

    const Values = [sentloginUserName,sentloginPassword]

    db.query(SQL,Values,(err,results)=>{
        if(err){
            res.send({error: err})
        }
        if(results.length > 0){
            res.send(results)

        }
        else{
            res.send({message:"Credentials Dont't match!"})
        }

    })

})