// server/index.js
const PORT = process.env.PORT || 3001;

const io = require("socket.io")(PORT, {
  cors: { 
    origin: "*", 
  }
});

console.log(`Servidor Socket.io corriendo en el puerto ${PORT}...`);

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado:", socket.id);

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado:", socket.id);
  });
});