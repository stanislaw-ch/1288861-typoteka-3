'use strict';
const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для API.
    Гайд:
      npm run cli <command>
      Команды:
      --server:             запускает сервер
      --version:            выводит номер версии
      --help:               печатает этот текст
      --filldb <count>      наполняет базу данных моковыми значениями
      --cleardb             очищает базу от моковых данных
    `;
    console.log(chalk.gray(text));
  }
};
