'use strict';

module.exports = {
  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  shuffle: (someArray) => {
    for (let i = someArray.length - 1; i > 0; i--) {
      const randomPosition = Math.floor(Math.random() * i);
      [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
    }

    return someArray;
  },
  getRandomDate: () => {
    const startPoint = new Date().getTime();
    const endPoint = startPoint - new Date(90 * (24 * 3600 * 1000)).getTime();
    const date = new Date(endPoint + Math.random() * (startPoint - endPoint));

    return date;
  },
  ensureArray: (value) => Array.isArray(value) ? value : [value],
  convertDate: (value) => {
    const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    const replaceDate = value.replace(pattern, `$3-$2-$1`);
    const date = new Date(replaceDate).getTime();

    return date;
  },
};
