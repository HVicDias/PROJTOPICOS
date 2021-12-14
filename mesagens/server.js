//Inicializa as variaveis principais do node modules
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const handlebars = require("express-handlebars");

//importa de arquivos auxiliares
const formatarMensagem = require('./utils/messages');
const {
  entrarNoChat,
  usuario,
  sair,
  sala
} = require('./utils/users');
const socketsStatus = {};


// Deixa o app em uma pasta statica
app.use(express.static(path.join(__dirname, 'public')));
const customHandlebars = handlebars.create({ layoutsDir: "./views" });

app.engine("handlebars", customHandlebars.engine);
app.set("view engine", "handlebars");

app.use("/files", express.static("public"));

app.get("/home", (req, res) => {
  res.render("index");
});


const botName = 'Nebula';

// Entrar no chat
io.on('connection', socket => {
  socket.on('entrar', ({ username, room }) => {
    const user = entrarNoChat(socket.id, username, room);

    socket.join(user.room);

    socket.emit('mensagem', formatarMensagem(botName, 'Welcome to ChatCord!'));

    socket.broadcast
      .to(user.room)
      .emit(
        'mensagem',
        formatarMensagem(botName, `${user.username} has joined the chat`)
      );

    io.to(user.room).emit('attSala', {
      room: user.room,
      users: sala(user.room)
    });
  });

  // Ouve mensagens
  socket.on('mensagemEnviada', msg => {
    const user = usuario(socket.id);

    io.to(user.room).emit('mensagem', formatarMensagem(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = sair(socket.id);

    if (user) {
      io.to(user.room).emit(
        'mensagem',
        formatarMensagem(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('attSala', {
        room: user.room,
        users: sala(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
