//Requisita do htmç os elementos principais do HTML
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
const botName = 'Nebula';

// Entrar no chat
socket.emit('entrar', { username, room });

//sair
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

// mensagem
socket.on('mensagem', (message) => {
  console.log(message);
  retornaMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Messagem enviada
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg.value;

  msg = msg.trim();
  document.getElementById(msg);
  if (!msg) {
    return false;
  }
  socket.emit('mensagemEnviada', msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Adiciona nome da sala
function retornaSala(room) {
  roomName.innerText = room;
}

// Retorna usuarios
function retornaUsuarios(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

// Retorna mensagem
function retornaMessage(message) {
  const div = document.createElement('div');
  if(message.username==="Nebula"){
    div.classList.add('bot-nome')
   }else
  div.classList.add('mensagem');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Retorna salas e usuarios
socket.on('attSala', ({ room, users }) => {
  retornaSala(room);
  retornaUsuarios(users);
});