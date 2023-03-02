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
import { transform, createEmptyGrid } from '../utils/myUtils';
const https = require('https');
const ws = require('ws');

const main = {
  serverGrid: createEmptyGrid(),
  espGrid: createEmptyGrid(),
  saved: {},
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
    const paletteStr = palette.reduce(
      (acc, color) => `${acc}${Math.round(color / 20)},`,
      ''
    );

    strToSend += `${paletteStr.slice(0, -1)}a`;
  }

  strToSend = strToSend.slice(0, -1);

  if (main.esp) {
    main.esp.send(strToSend);
  }
};

const checkGridDifference = () => {
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

let start;
let end;

function onConnectEsp(ws) {
  console.log('подключился esp');
  start = new Date().getTime();
  main.esp = ws;
  main.isOnline = true;

  ws.on('message', function(message) {
    console.log(message.toString());
  });

  ws.on('close', function() {
    console.log('отключился esp');
    end = new Date().getTime();
    console.log('в работе ', end - start);
    main.esp = null;
    main.isOnline = false;
  });

  updateEspGrid();
}

function onConnect(ws) {
  console.log('подключился');
  main.clients.add(ws);

  ws.on('message', function(message) {
    const data = JSON.parse(message);

    if (data?.action === 'draw') {
      main.serverGrid = data.grid;
    }

    if (data?.action === 'save') {
      main.saved[Math.random().toString()] = data.grid;
    }

    if (data?.action === 'delete') {
      delete main.saved[data.id];
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

  ws.send(JSON.stringify({ action: 'grid', grid: main.serverGrid }));
}

setInterval(checkGridDifference, 1500);

setInterval(() => {
  for (let client of main.clients) {
    client.send(JSON.stringify({ action: 'grid', grid: main.serverGrid }));
  }
}, 1600);

// setInterval(() => {
//   for (let client of main.clients) {
//     client.send(JSON.stringify({ action: 'saved', grids: main.saved }));
//   }
// }, 10000);

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
