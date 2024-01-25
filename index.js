import express from "express"
import cors from "cors"

import { signupRouter } from './routes/signup.js'
import { loginRouter } from './routes/login.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use('/', signupRouter)
app.use('/', loginRouter)

app.listen(3002, () => {
    console.log("Server is running .....")
})