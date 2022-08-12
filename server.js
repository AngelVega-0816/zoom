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
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT || 3001);