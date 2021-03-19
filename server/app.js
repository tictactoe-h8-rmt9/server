// require("dotenv").config()

const express = require('express')
const app = express()
const router = require('./routers')
const port = process.env.PORT || 3000
const cors = require('cors')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const fs = require('fs');


app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

let listPlayer = []
let giliran  = null
let yangBermain = {
    p1 : {
        id : null,
        name : '',
        xo : "X",
        turn : true
    },
    p2 : {
        id : null,
        name : '',
        xo : "O",
        turn : false
    }
}
let position = [
    {el: ''},{el: ''},{el: ''},
    {el: ''},{el: ''},{el: ''},
    {el: ''},{el: ''},{el: ''}
  ]

  // listening
  io.on('connection', (socket) => {
    io.emit('fetchDataBoard', position)
    io.emit('fetchPemain', yangBermain)
    console.log(`a user ${socket.id}`);
    
    
    socket.on('daftar', (data)=>{
        if (yangBermain.p1.id === null) {
            yangBermain.p1.id = socket.id
            yangBermain.p1.name = data
        }else if(yangBermain.p2.id === null){
            yangBermain.p2.id = socket.id
            yangBermain.p2.name = data
        }else{
            listPlayer.push({id: socket.id, name: data})
        }
        io.emit('fetchPemain', yangBermain)
        console.log(yangBermain);
        console.log(listPlayer);
    })



    socket.on('updateBoard', (data)=>{
        if (socket.id === yangBermain.p1.id && yangBermain.p1.turn) {
            position[data].el = yangBermain.p1.xo
            yangBermain.p1.turn = false
            yangBermain.p2.turn = true
            checkMenang(yangBermain.p1.xo)
        }else if(socket.id === yangBermain.p2.id && yangBermain.p2.turn){
            position[data].el = yangBermain.p2.xo
            yangBermain.p1.turn = true
            yangBermain.p2.turn = false
            checkMenang(yangBermain.p2.xo)
        }
        console.log(position);
        console.log(data);
        io.emit('fetchDataBoard', position)
    })

    socket.on('disconnect', () => {

        if (socket.id === yangBermain.p1.id) {
            yangBermain.p1.id = null
            yangBermain.p1.name = ''
            checkMenang(yangBermain.p1.xo, true)
            if (listPlayer.length !== 0) {
                yangBermain.p1.id = listPlayer[0].id
                yangBermain.p1.name = listPlayer[0].name
            }
        }else if(socket.id === yangBermain.p2.id){
            yangBermain.p2.id = null
            yangBermain.p2.name = ''
            checkMenang(yangBermain.p2.xo, true)
            if (listPlayer.length !== 0) {
                yangBermain.p2.id = listPlayer[0].id
                yangBermain.p2.name = listPlayer[0].name
            }
        }
        console.log(yangBermain);
        io.emit('fetchDataBoard', position)
        console.log(`user disconnected ${socket.id}`);
    });

    function checkMenang(xo, jikaDc = false) {
        let menang = false;
        if (position[0].el === xo && position[1].el === xo && position[2].el === xo) {
            menang = true;
        }else if (position[3].el === xo && position[4].el === xo && position[5].el === xo) {
            menang = true;
        }else if (position[6].el === xo && position[7].el === xo && position[8].el === xo) {
            menang = true;
        }else if (position[0].el === xo && position[3].el === xo && position[6].el === xo) {
            menang = true;
        }else if (position[1].el === xo && position[4].el === xo && position[7].el === xo) {
            menang = true;
        }else if (position[2].el === xo && position[5].el === xo && position[8].el === xo) {
            menang = true;
        }else if (position[0].el === xo && position[4].el === xo && position[8].el === xo) {
            menang = true;
        }else if (position[2].el === xo && position[4].el === xo && position[6].el === xo) {
            menang = true;
        }
        let filtersSeri = position.filter(x => x.el !== '')
        let seri = (filtersSeri.length === 9) ? true : false
        
        if (menang) {
            io.emit('pemenang', (xo === "X") ? yangBermain.p1 : yangBermain.p2)
        }

        //buat reset 
        if (menang || jikaDc || seri) {
            position = [
                {el: ''},{el: ''},{el: ''},
                {el: ''},{el: ''},{el: ''},
                {el: ''},{el: ''},{el: ''}
            ]
        }
        
    }
});



http.listen(3000, () => {
    console.log(`listening on *:${port}`);
});


app.use(router)

module.exports = app