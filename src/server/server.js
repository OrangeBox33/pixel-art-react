import { renderToString } from 'react-dom/server';
import undoable, { includeAction } from 'redux-undo';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import React from 'react';
import { createStore } from 'redux';
import reducer from '../store/reducers/reducer';
import pkgjson from '../../package.json';
import Root from '../components/Root';
import {
  SHOW_SPINNER,
  CHANGE_DIMENSIONS,
  NEW_PROJECT,
  SET_DRAWING,
  SET_CELL_SIZE,
  SET_RESET_GRID
} from '../store/actions/actionTypes';
import { transform } from '../utils/transform';
const https = require('https');
const ws = require('ws');

const firstGrid = [];
for (let i = 0; i < 1024; i++) {
  firstGrid.push([0, 0, 0]);
}

const main = {
  serverGrid: firstGrid,
  espGrid: firstGrid,
  saved: [],
  isOnline: false,
  qtyOnline: 0,
  clients: new Set(),
  esp: null
};

const wss = new ws.Server({ port: 444 });
const wsEsp = new ws.Server({ port: 81 });

wsEsp.on('connection', onConnectEsp);

// wsServer.on('connection', onConnect);

const updateEspGrid = () => {
  let strToSend = '';

  const transformedEspGrid = transform(main.espGrid);

  for (let palette of transformedEspGrid) {
    const paletteStr = palette.reduce((acc, color) => `${acc},${color}`, '');
    strToSend += `${paletteStr}a`;
  }

  strToSend = strToSend.slice(0, -1);

  if (main.esp) {
    // console.log(strToSend.slice(20));
    main.esp.send(strToSend);
  }
};

const checkGridDifference = () => {
  // console.log('checkGridDifference');
  let needUpdate = false;

  for (let i = 0; i < 1024; i++) {
    const rgbCurrentCell = main.serverGrid[i];

    rgbCurrentCell.forEach((value, j) => {
      if (value !== main.espGrid[i][j]) {
        needUpdate = true;
        main.espGrid[i][j] = value;
      }
    });
  }

  if (needUpdate) {
    updateEspGrid();
  }
};

setInterval(checkGridDifference, 250);

function onConnectEsp(ws) {
  console.log('подключился esp');
  main.esp = ws;
  main.isOnline = true;

  ws.on('message', function(message) {
    console.log(message.toString().slice(0, 50));
  });

  ws.on('close', function() {
    console.log('отключился esp');
    main.esp = null;
    main.isOnline = false;
  });
}

function onConnect(ws) {
  console.log('подключился');
  main.clients.add(ws);

  ws.on('message', function(message) {
    if (message.length > 1000) {
      main.serverGrid = [...JSON.parse(message)];
    }
  });

  ws.on('close', function() {
    console.log('отключился');
    const espIsClose = !main.clients.delete(ws);

    if (espIsClose) {
      main.esp = null;
      main.isOnline = false;
    }
  });

  ws.send('try send');
}

const app = express();
module.exports = app;
console.log(`Version deployed: ${pkgjson.version}`);

/**
 * Configuration
 */
let configData;
const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') {
  configData = JSON.parse(fs.readFileSync('config.json', 'utf8')).dev;
} else {
  configData = process.env;
}

app.use((req, res, next) => {
  if (
    req.headers.upgrade &&
    req.headers.upgrade.toLowerCase() === 'websocket'
  ) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
    return;
  }
  return next();
});

app.set('views', `${__dirname}/../views`);
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/../../deploy`));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/**
 * Redux helper functions
 */
function renderHome(req, res) {
  // Create a new Redux store instance
  const store = createStore(
    undoable(reducer, {
      filter: includeAction([
        CHANGE_DIMENSIONS,
        SET_DRAWING,
        SET_CELL_SIZE,
        SET_RESET_GRID,
        NEW_PROJECT
      ]),
      debug: false,
      ignoreInitialState: true
    })
  );

  store.dispatch({
    type: SHOW_SPINNER
  });

  // Render the component to a string
  const html = renderToString(<Root store={store} />);

  const initialState = store.getState();

  // Send the rendered page back to the client
  res.render('index.pug', {
    reactOutput: html,
    initialState: JSON.stringify(initialState)
    // googleAnalyticsId: configData.GOOGLE_ANALYTICS_ID
  });
}

/**
 * Routes
 */
app.get('/', renderHome);

var options = {
  key: fs.readFileSync(`${__dirname}/ssl/privateKey.key`), // PRIVATE KEY
  cert: fs.readFileSync(`${__dirname}/ssl/cerfKey.pem`) // CERTIFICATE
};
var serverHttps = https.createServer(options, app);
// var serverHttp = http.createServer(app);

serverHttps.listen(443);
// serverHttp.listen(80);
