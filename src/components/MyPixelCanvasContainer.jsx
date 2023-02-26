import React from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '../store/reducers/activeFrameReducer';
import PixelCanvasContainer from './PixelCanvas';
import { setDrawing } from '../store/actions/actionCreators';
import { createFrames, palette } from '../utils/myUtils';

export const MyPixelCanvasContainer = ({ drawHandlersFactory }) => {
  const dispatch = useDispatch();

  if (!socket) return null;

  socket.onmessage = function(event) {
    const frames = createFrames(JSON.parse(event.data));
    dispatch(setDrawing(frames, palette, 10, 32, 32));
  };

  return <PixelCanvasContainer drawHandlersFactory={drawHandlersFactory} />;
};
