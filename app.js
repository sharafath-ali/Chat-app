const express = require('express')
const socket = require('socket.io')

const app = express()

const server = app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

const io = socket(server)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log(socket.id)
})