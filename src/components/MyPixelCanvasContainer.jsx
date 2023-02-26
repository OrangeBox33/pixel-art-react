import React, { useEffect, useState } from 'react';
import { socket } from '../store/reducers/activeFrameReducer';

export const MyPixelCanvasContainer = ({ drawHandlersFactory }) => {
  if (!socket) return null;

  const [grid, setGrid] = useState([]);
  socket.onmessage = function(event) {
    // console.log(event.data.toString());
    setGrid(JSON.parse(event.data));
  };

  useEffect(() => console.log(grid));

  return <h1>123</h1>;

  // return <PixelCanvasContainer drawHandlersFactory={drawHandlersFactory} />;
};
