import React from 'react';
import { useDispatch } from 'react-redux';
import { socket, saveSaved } from '../store/reducers/activeFrameReducer';
import PixelCanvasContainer from './PixelCanvas';
import { setDrawing } from '../store/actions/actionCreators';
import { createFrames, palette } from '../utils/myUtils';
import { useEffect } from 'react';

export const MyPixelCanvasContainer = ({ drawHandlersFactory }) => {
  const dispatch = useDispatch();

  if (!socket) return null;

  socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    if (data?.action === 'grid') {
      const frames = createFrames(data.grid);
      dispatch(setDrawing(frames, palette, 10, 32, 32));
    }

    if (data?.action === 'saved') {
      saveSaved(data.grids);
    }
  };

  return <PixelCanvasContainer drawHandlersFactory={drawHandlersFactory} />;
};
