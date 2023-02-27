import React from 'react';
import { fromJS } from 'immutable';
import Preview from './Preview';
import Output from './Output';
import UsefulData from './UsefulData';
import LoadFromFile from './loadFromFile';
import {
  getDataFromStorage,
  removeProjectFromStorage,
  generateExportString,
  exportedStringToProjectData
} from '../utils/storage';

/*
  Avoid error when server-side render doesn't recognize
  localstorage (browser feature)
*/
const browserStorage =
  typeof localStorage === 'undefined' ? null : localStorage;

export default class LoadDrawing extends React.Component {
  getExportCode() {
    const { frames, paletteGridData, cellSize, columns, rows } = this.props;
    const projectData = {
      frames,
      paletteGridData,
      cellSize,
      columns,
      rows,
      animate: frames.size > 1
    };
    return generateExportString(projectData);
  }

  importProject() {
    const importedProject = exportedStringToProjectData(
      this.importProjectData.value
    );
    const { actions, close } = this.props;

    if (importedProject) {
      const {
        frames,
        paletteGridData,
        columns,
        rows,
        cellSize
      } = importedProject;

      actions.setDrawing(frames, paletteGridData, cellSize, columns, rows);
      close();
      actions.sendNotification('Project successfully imported');
    } else {
      actions.sendNotification("Sorry, the project couldn't be imported");
    }
  }

  removeFromStorage(key, e) {
    const { actions, open, close } = this.props;
    e.stopPropagation();
    if (browserStorage) {
      const removed = removeProjectFromStorage(browserStorage, key);
      if (removed) {
        actions.sendNotification('Drawing deleted');
        close();
        open();
      }
    }
  }

  drawingClick(data) {
    const { actions, close } = this.props;
    actions.setDrawing(
      data.frames,
      data.paletteGridData,
      data.cellSize,
      data.columns,
      data.rows
    );
    close();
  }

  giveMeDrawings() {
    if (browserStorage) {
      const dataStored = getDataFromStorage(browserStorage);
      if (dataStored) {
        if (dataStored.stored.length > 0) {
          return dataStored.stored.map((data, i) => {
            const elem = {
              animate: data.animate,
              cellSize: 5, // Unify cellsize for load preview
              columns: data.columns,
              frames: fromJS(data.frames), // Parse to immutable
              paletteGridData: fromJS(data.paletteGridData),
              rows: data.rows,
              id: data.id
            };

            return (
              <div
                key={elem.id}
                onClick={() => {
                  this.drawingClick(elem);
                }}
                onKeyPress={() => {
                  this.drawingClick(elem);
                }}
                className="load-drawing__drawing"
                role="button"
                tabIndex={0}
              >
                <Preview
                  key={elem.id}
                  storedData={elem}
                  activeFrameIndex={0}
                  duration={1}
                />
                <button
                  type="button"
                  aria-label="Remove stored project"
                  className="drawing__delete"
                  onClick={event => {
                    this.removeFromStorage(i, event);
                  }}
                />
              </div>
            );
          });
        }
      }
    }
    return [];
  }

  giveMeOptions(type) {
    switch (type) {
      default: {
        const drawings = this.giveMeDrawings();
        const drawingsStored = drawings.length > 0;
        return (
          <div className="load-drawing">
            <div
              className={`load-drawing__container
                ${!drawingsStored ? 'empty' : ''}`}
            >
              {drawingsStored
                ? this.giveMeDrawings()
                : 'Nothing awesome yet...'}
            </div>
          </div>
        );
      }
    }
  }

  render() {
    const { loadType } = this.props;
    return this.giveMeOptions(loadType);
  }
}
