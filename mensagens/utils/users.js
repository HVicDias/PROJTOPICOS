const users = [];

//  Entrar no chat
function entrarNoChat(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Retorna o usuario
function usuario(id) {
  return users.find(user => user.id === id);
}

// Sair
function sair(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Retorna a sala
function sala(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  entrarNoChat,
  usuario,
  sair,
  sala
};
