'use strict';

(() => {

  const SERVER_URL = `http://localhost:3000`;

  const socket = io(SERVER_URL);

  socket.addEventListener(`category:create`, (message) => {
    console.log(message);
    return console.log('message: ', message.name);
  });
})();
