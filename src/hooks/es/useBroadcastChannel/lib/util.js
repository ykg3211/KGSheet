var previousStamp = 0;
var additional = 0;
export function getTimeStamp() {
  var timeStamp = new Date().getTime() * 1e3;

  if (timeStamp === previousStamp) {
    additional++;
    return timeStamp + additional;
  }

  previousStamp = timeStamp;
  additional = 0;
  return timeStamp;
}