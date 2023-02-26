import React, { useEffect, useState } from 'react';
import { socket } from '../store/reducers/activeFrameReducer';
import PixelCanvasContainer from './PixelCanvas';

const initialGrid = [];

for (let i = 0; i < 1024; i++) {
  initialGrid[i] = [0, 0, 0];
}

export const MyPixelCanvasContainer = ({ drawHandlersFactory }) => {
  if (!socket) return null;
// 'rgba(49, 49, 49, 1)'
  const [grid, setGrid] = useState(initialGrid);

  socket.onmessage = function(event) {
    const fullArr = JSON.parse(event.data);
    setGrid(fullArr);
  };

  return <PixelCanvasContainer drawHandlersFactory={drawHandlersFactory} myGrid={grid} />;
};
