const STANDARD_DRINK = 0.6;

function pad(n) {
  return n < 10 ? '0' + n : n;
};
// https://stackoverflow.com/a/16177227
function toLocalIsoString(date) {
  return `${
    date.getFullYear()
  }-${
    pad(date.getMonth() + 1)
  }-${
    pad(date.getDate())
  }T${
    pad(date.getHours())
  }:${
    pad(date.getMinutes())
  }`;
};

function standardDrinks(alcoholContent) {
  return (Number(alcoholContent) / STANDARD_DRINK).toFixed(3);
}

module.exports = {
  toLocalIsoString,
  standardDrinks,
}
