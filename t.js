const WebSocket = require('ws');

const wsServer = new WebSocket.Server({ port: 9000 });

const onConnect = wsClient => {
  console.log('Новый пользователь');
  // отправка приветственного сообщения клиенту
  wsClient.send('Привет');

  wsClient.on('message', function(message) {
    /* обработчик сообщений от клиента */
  });

  wsClient.on('close', function() {
    // отправка уведомления в консоль
    console.log('Пользователь отключился');
  });
};

wsServer.on('connection', onConnect);
