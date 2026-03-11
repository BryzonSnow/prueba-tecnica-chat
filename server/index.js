// server/index.js
const io = require("socket.io")(3001, {
  cors: { 
    origin: "*", // conexion
  }
});

console.log("Servidor Socket.io corriendo en el puerto 3001...");

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado:", socket.id);

  socket.on("message", (msg) => {
    console.log("Mensaje recibido:", msg);
    // todos los clientes conectados
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado:", socket.id);
  });
});