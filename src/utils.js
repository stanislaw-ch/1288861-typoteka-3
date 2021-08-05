'use strict';

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.getRandomDate = () => {
  const startPoint = new Date().getTime();

  const endPoint = startPoint - new Date(90 * (24 * 3600 * 1000)).getTime();

  // const options = {
  //   day: `numeric`,
  //   month: `numeric`,
  //   year: `numeric`,
  //   hour: `numeric`,
  //   minute: `numeric`,
  //   second: `numeric`
  // };

  const date = new Date(endPoint + Math.random() * (startPoint - endPoint));

  return date;
};
