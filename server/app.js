require("dotenv").config()

const express = require('express')
const app = express()
const router = require('./routers')
const port = process.env.PORT || 3000
const cors = require('cors')
const http = require('http').createServer(app)
const io = require('socket.io')(http)


app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

// listening
io.on('connection', (socket) => {
    console.log('a user connected');
});

http.listen(3000, () => {
    console.log(`listening on *:${port}`);
});

app.use(router)

module.exports = app