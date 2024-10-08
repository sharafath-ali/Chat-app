const express = require('express')
const socket = require('socket.io')

const app = express();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = socket(server)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))


let socketsConnected = new Set();

io.on('connection', (socket) => {
  console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit("client-total", socketsConnected.size)

  socket.on('disconnect', () => {
    socketsConnected.delete(socket.id)
    io.emit("client-total", socketsConnected.size)
  })

  socket.on("message", (data) => {
    socket.broadcast.emit("message", data)
    console.log(data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit("feedback", data)
  })
})