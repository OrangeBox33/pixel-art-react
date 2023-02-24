const WebSocket = require('ws');

const myWs = new WebSocket('ws://188.225.60.209:81');
// const myWs2 = new WebSocket('ws://188.225.60.209:81');

myWs.onopen = function () {
  console.log('подключился');
};

myWs.onmessage = function (event) {
  console.log(event.data.toString());
};

// myWs2.onopen = function () {
//   console.log('подключился');
// };

// myWs2.onmessage = function (event) {
//   console.log(event.data.toString());
// };

function wsSendEcho() {
  // myWs2.send('asdadad');
  myWs.send('zxczxc');
}

setInterval(wsSendEcho, 2000);
