import express from "express"
import router from "./routok/posztroutes"
import authrouter from "./routok/authroutes"
import cors from "cors"
import bodyParser from "body-parser"


const app = express()
app.use(cors({origin:'*'}))

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/',router)
app.use('/auth',authrouter)
export default app

