import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Row from './Row';


class Grid extends React.Component {
  render() {
    return (
      <table>
        <tbody className='grid-body'>
          { this.props.answers.map(
            (row, i) => 
            <Row 
              key={ i } 
              index={ i } 
              clueMarkers={ this.props.clueMarkers[i] } 
              answers={ row } 
              activeCells={ this.props.activeCells[i] }
              entries={ this.props.entries[i] }
            />
          ) }
        </tbody>
      </table>
    );
  }
}

Grid.defaultProps = {};

Grid.propTypes = {};

Grid.contextTypes = {};

const select = state => ({
  clueMarkers: state.puzzle.current.clueMarkers,
  activeCells: state.puzzle.activeCells,
  answers: state.puzzle.current.answers,
  entries: state.puzzle.entries
});

export default connect(select)(Grid);