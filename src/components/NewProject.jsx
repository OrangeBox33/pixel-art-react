import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../store/actions/actionCreators';
import { createEmptyGrid } from '../utils/myUtils';
import { socket } from '../store/reducers/activeFrameReducer';

const NewProject = props => {
  const newProject = () => {
    props.actions.newProject();

    if (socket) {
      socket.send(JSON.stringify({ action: 'draw', grid: createEmptyGrid() }));
    }
  };

  return (
    <div className="new-project">
      <button
        type="button"
        onClick={() => {
          newProject();
        }}
      >
        NEW
      </button>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

const NewProjectContainer = connect(null, mapDispatchToProps)(NewProject);
export default NewProjectContainer;
