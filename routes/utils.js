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

module.exports = {
  STANDARD_DRINK,
  toLocalIsoString,
}
