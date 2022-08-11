const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer")
const peerServer = ExpressPeerServer(server, {
  debug: true
})
const io = require("socket.io")(server)

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer)

app.get("/", (req, res) => {
	res.redirect(`/${uuidv4()}`);
});
app.get("/:room", (req, res) => {
  // if(req.params.room.length > 20) {
    // console.log(req.params.room, req.params.room[1]);
    res.render("room", { roomId: req.params.room });
  // }
});


io.on("connection", socket => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on("message", msg => {
      io.to(roomId).emit("createMessage", msg)
    })

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT || 3001);


// const express = require('express')
// const app = express()
// const cors = require('cors')
// app.use(cors())
// const server = require('http').Server(app)
// const io = require('socket.io')(server)
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
  // debug: true
// });
// const { v4: uuidV4 } = require('uuid')

// app.use('/peerjs', peerServer);

// app.set('view engine', 'ejs')
// app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room })
// })

// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected', userId);
//     // messages
//     socket.on('message', (message) => {
//       //send message to the same room
//       io.to(roomId).emit('createMessage', message)
//   }); 

//     socket.on('disconnect', () => {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId)
//     })
//   })
// })

// server.listen(process.env.PORT||3001)