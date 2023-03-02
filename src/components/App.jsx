import React from 'react';
// import ColorPickerContainer from './ColorPicker';
import ModalContainer from './Modal';
// import EraserContainer from './Eraser';
// import BucketContainer from './Bucket';
// import MoveContainer from './Move';
// import EyedropperContainer from './Eyedropper';
import PaletteGridContainer from './PaletteGrid';
import SaveDrawingContainer from './SaveDrawing';
import NewProjectContainer from './NewProject';
import SimpleNotificationContainer from './SimpleNotification';
import SimpleSpinnerContainer from './SimpleSpinner';
// import UndoRedoContainer from './UndoRedo';
import initialSetup from '../utils/startup';
import drawHandlersProvider from '../utils/drawHandlersProvider';
import Button from './common/Button';
import { MyPixelCanvasContainer } from './MyPixelCanvasContainer';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      modalType: null,
      modalOpen: false,
      helpOn: false
    };
    Object.assign(this, drawHandlersProvider(this));
  }

  componentDidMount() {
    const { dispatch } = this.props;
    initialSetup(dispatch, localStorage);
  }

  changeModalType(type) {
    this.setState({
      modalType: type,
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  toggleHelp() {
    const { helpOn } = this.state;
    this.setState({ helpOn: !helpOn });
  }

  render() {
    const { helpOn, modalType, modalOpen } = this.state;
    return (
      <div
        className="app__main"
        onMouseUp={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
        onTouchCancel={this.onMouseUp}
      >
        <SimpleSpinnerContainer />
        <SimpleNotificationContainer
          fadeInTime={1000}
          fadeOutTime={1500}
          duration={1500}
        />

        <div className="app__central-container">
          <div className="left col-1-4">
            <div className="app__left-side">
              <div className="app__mobile--container max-width-container">
                <div className="app__mobile--group">
                  {/* <div data-tooltip={helpOn ? 'New project' : null}>
                    <NewProjectContainer />
                  </div> */}
                  {/* <div className="app__load-save-container">
                    <button
                      type="button"
                      className="app__load-button"
                      onClick={() => {
                        this.changeModalType('load');
                      }}
                      data-tooltip={
                        helpOn ? 'Load projects you stored before' : null
                      }
                    >
                      LOAD
                    </button>
                    <div data-tooltip={helpOn ? 'Save your project' : null}>
                      <SaveDrawingContainer />
                    </div>
                  </div>
                  <Button
                    type="file"
                    onChange={() => {}}
                    ariaLabel="Load image file"
                  >
                    LOAD PHOTO
                  </Button> */}
                  {/* <div
                    data-tooltip={helpOn ? 'Undo (CTRL+Z) Redo (CTRL+Y)' : null}
                  >
                    <UndoRedoContainer />
                  </div> */}
                  {/* <div className="app__tools-wrapper grid-3">
                    <div
                      data-tooltip={
                        helpOn
                          ? 'It fills an area of the current frame based on color similarity (B)'
                          : null
                      }
                    >
                      <BucketContainer />
                    </div>
                    <div
                      data-tooltip={
                        helpOn ? 'Sample a color from your drawing (O)' : null
                      }
                    >
                      <EyedropperContainer />
                    </div>
                    <div
                      data-tooltip={
                        helpOn
                          ? 'Choose a new color that is not in your palette (P)'
                          : null
                      }
                    >
                      <ColorPickerContainer />
                    </div>
                    <div data-tooltip={helpOn ? 'Remove colors (E)' : null}>
                      <EraserContainer />
                    </div>
                    <div
                      data-tooltip={
                        helpOn
                          ? 'Move your drawing around the canvas (M)'
                          : null
                      }
                    >
                      <MoveContainer />
                    </div>
                  </div> */}
                </div>
                <div className="app__mobile--group">
                  <PaletteGridContainer />
                </div>
              </div>
            </div>
          </div>
          <div className="center col-2-4">
            <MyPixelCanvasContainer
              drawHandlersFactory={this.drawHandlersFactory}
            />
          </div>
        </div>
        <ModalContainer
          type={modalType}
          isOpen={modalOpen}
          close={() => {
            this.closeModal();
          }}
          open={() => {
            this.changeModalType(modalType);
          }}
        />
      </div>
    );
  }
}
