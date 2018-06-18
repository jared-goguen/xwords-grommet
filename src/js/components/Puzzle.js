import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showErrors } from '../actions/puzzle';

import CheckBox from 'grommet/components/CheckBox';

import Grid from './Grid';
import Clues from './Clues';
import ToggleBox from './ToggleBox';


class Puzzle extends React.Component {
  constructor(props) {
    super(props);
    this.flexHolder = React.createRef();
    this.gridHolder = React.createRef();
    this.puzzleHolder = React.createRef();
    this.state = {sizeClass: 'small-puzzle', marginRight: 0};
  }

  setShowErrors = (event) => {
    this.props.dispatch(showErrors(event.target.checked));
  }

  updateDimensionState = async () => {
    let sizeClass;
    if (this.puzzleHolder.current.offsetWidth < 800) {
      sizeClass = 'small-puzzle'; 
    } else {
      sizeClass = 'big-puzzle'; 
    }

    if ( sizeClass !== this.state.sizeClass ) {
      await this.setState({ sizeClass });
    }

    const outerWidth = this.flexHolder.current.offsetWidth;
    const innerWidth = this.gridHolder.current.offsetWidth;
    const marginRight = (outerWidth - innerWidth) / 2 - 15;
    this.setState({ marginRight });
  }

  componentDidMount() {
    this.updateDimensionState()
    window.addEventListener('resize', this.updateDimensionState);
  }

  componentWillUnmount() {
     window.addEventListener('resize', this.updateDimensionState);
  }

  render() {
    const style = {marginRight: this.state.marginRight}
    return (
      <div className={this.state.sizeClass} ref={this.puzzleHolder}>
      
        <div className={'puzzle-holder'}>

          <div className='clues-holder'>
            <Clues />
          </div>

          <div className='grid-flex' ref={this.flexHolder}>

            <div className='grid-holder' ref={this.gridHolder} style={style}>
            
              <Grid />

              <div className='options-holder'>
                <CheckBox
                  id='show-errors'
                  label='show errors'
                  named='show-errors'
                  toggle={true}
                  onChange={ this.setShowErrors }
                />
              </div>

            </div>

          </div>

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
