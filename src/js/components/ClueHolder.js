import React from 'react';
import Clue from './Clue';
import { connect } from 'react-redux';

class ClueHolder extends React.Component {
  /*
  props
    title: String title
    clues: [ Clues clues, ... ]
  */
  render() {
    return (
      <div className='clue-holder'>
        <h3>{this.props.title}</h3>
        <ol>
          { this.props.clues.map(
            (clue, i) =>
            <Clue 
              key={ i } 
              focus={ 
                this.props.clueRow == clue.row &&
                this.props.clueColumn == clue.column &&
                this.props.activeDirection == clue.direction
              }
              { ...clue } 
            />
          ) }
        </ol>
      </div>
    );
  }
}

const select = (state) => ({
  clueRow: state.puzzle.clueRow,
  clueColumn: state.puzzle.clueColumn,
  activeDirection: state.puzzle.activeDirection,
});


export default connect(select)(ClueHolder);