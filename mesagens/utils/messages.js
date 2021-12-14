const moment = require('moment');

function formatarMensagem(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatarMensagem;
