// const path = require('path');
// const express = require("express");
// const bodyParser = require("body-parser");
// const http = require('http');
const WebSocket = require('ws');








// const app = express();

// app.use(express.static(path.resolve(__dirname, "./public")));

// app.use(express.json());

// app.use(bodyParser.urlencoded({
//   extended: true
// }));



// var options = {
//   key: fs.readFileSync('./ssl/privateKey.key'), // PRIVATE KEY
//   cert: fs.readFileSync('./ssl/cerfKey.pem') // CERTIFICATE
// };
// var server1 = https.createServer(options, app);
// var server2 = http.createServer(app);

// server1.listen(443);

// server2.listen(80);







const clients = new Set();

const wsServer = new WebSocket.Server({ port: 81 });

wsServer.on('connection', onConnect);


function onConnect(ws) {
  console.log(ws instanceof Set);
  console.log(ws instanceof Map);
  console.log('подключился');
  // console.log(ws);
  clients.add(ws);

  ws.on('message', function(message) {
    console.log(message.toString().slice(0, 50));

    // for(let client of clients) {
    //   client.send(message);
    // }
  });

  ws.on('close', function() {
    console.log('отключился')
    clients.delete(ws);
  });
}

console.log('Сервер запущен на 80 порту');

