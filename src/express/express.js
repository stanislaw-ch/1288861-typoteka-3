'use strict';

const express = require(`express`);
const session = require(`express-session`);
const path = require(`path`);
const chalk = require(`chalk`);

const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {HttpCode} = require(`../constants`);
const getSequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const {Server} = require(`socket.io`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();

const http = require(`http`);
const server = http.createServer(app);
const io = new Server(server, {serveClient: true});

const socketObject = {
  emit(action, data) {
    io.sockets.emit(action, data);
  },
};

app.set(`socketio`, socketObject);

const mySessionStore = new SequelizeStore({
  db: getSequelize(),
  expiration: 180000,
  checkExpirationInterval: 60000
});

getSequelize().sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((err, _req, res, _next) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

// io.on(`connection`, (socket) => {
//   // socket.on(`message`, (data) => {
//     socketObject.emit(`message`, data);
//   // });
// });

server.listen(process.env.PORT || DEFAULT_PORT)
  .on(`listening`, () => {
    return console.info(chalk.green(`Ожидаю соединений на ${DEFAULT_PORT}`));
  })
  .on(`error`, (err) => {
    return console.error(`Ошибка при создании сервера`, err);
  });
