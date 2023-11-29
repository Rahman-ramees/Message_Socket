const { Socket } = require('dgram');
let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

let activeUser = [];

const port = process.env.PORT || 3000;

server.listen(port, ()=>{
    console.log(`server running successfully on ${port}`);
})

io.on('connection', (socket) => {
    socket.on('new-user-add', (newUserId) => {
        if (!activeUser.some((user) => user.userId === newUserId)) {
            activeUser.push({
                userId:newUserId,
                socketId:socket.id
            })
        }
        console.log(activeUser)
    })

    socket.on('message', (data) => {
        const user = activeUser.find(user => user.userId === data.phone)
        io.to(user.socketId).emit('new-message', {user:data.user, message: data.message})
    })
})