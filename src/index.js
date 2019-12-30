import express from 'express'
import path from 'path'
import fs from 'fs'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import multer from 'multer'
import uuid from 'uuid/v4'
import cors from 'cors'
import methodOverride from 'method-override'
import ssr from './routes/SSR'
import User from './routes/User'
import Storage from './routes/Storage'
const db = require('./config')
mongoose.connect(db.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })



const app = express()


app.use(express.static("public"))
app.set('views', path.join(__dirname, "views"))
app.set("view engine", "ejs")
const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/img"),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname))
    }
})
app.use(multer({ storage }).single("image"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride("_method"))
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-width, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
    next()

})

app.use("/", ssr)
app.use('/userapi/', User)
app.use('/storageapi', Storage)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`🚀 ==> Server running on port http://localhost:${port}`)
})