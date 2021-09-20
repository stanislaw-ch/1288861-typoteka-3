'use strict';

const socket = io();

socket.addEventListener(`message`, async (message) => {
  console.log(message);
});
