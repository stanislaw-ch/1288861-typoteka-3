'use strict';

const help = require(`./help`);
const generate = require(`./fill-db`);
const clear = require(`./clear-db`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);

const Cli = {
  [clear.name]: clear,
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
};

module.exports = {
  Cli,
};
