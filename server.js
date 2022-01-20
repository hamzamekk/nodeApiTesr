const http = require('http');
const app = require('./app');


const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require("socket.io")(server)

io.on("connection", (data) => {
    console.log(data)
})

server.listen(port);
