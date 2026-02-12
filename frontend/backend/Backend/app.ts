import express from "express"
import router from "./routok/posztroutes"
import authrouter from "./routok/authroutes"
import adminrouter from "./routok/adminroutes"
import cors from "cors"
import bodyParser from "body-parser"
import path from "path"


const app = express()
app.use(cors({origin:'*'}))

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/',router)
app.use('/auth',authrouter)
app.use('/admin',adminrouter)
export default app
