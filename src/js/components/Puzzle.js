import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showErrors } from '../actions/puzzle';

import Grid from './Grid';
import Clues from './Clues';
import ToggleBox from './ToggleBox';


class Puzzle extends React.Component {
  setShowErrors = (event) => {
    console.log(event);
    this.props.dispatch(showErrors(event.target.checked));
  }


  render() {
    return (
      <div className='puzzle-holder'>

        <div className='grid-flex'>

          <div className='grid-holder'>
          
            <Grid />

            <div className='options-holder'>
              <ToggleBox
                id='show-errors'
                enabledText='errors on'
                disabledText='errors off'
                enabled={ this.props.showErrors }
                onChange={ this.props.setShowErrors }
              />
            </div>

          </div>

        </div>

        <div className='clues-holder'>
          <Clues />
        </div>

      </div>
    );
  }
}

Puzzle.defaultProps = {};

Puzzle.propTypes = {
  showErrors: PropTypes.bool,
};

Puzzle.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => {
  return { showErrors: state.puzzle.showErrors };
}

export default connect(select)(Puzzle);