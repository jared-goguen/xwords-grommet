import React from 'react';
import ClueHolder from './ClueHolder';
import { connect } from 'react-redux';

class Clues extends React.Component {
  constructor(props) {
    super(props);
    this.acrossClues = [];
    this.downClues = [];
    for (let clue of this.props.clues) {
      if (clue.direction === 'Across') {
        this.acrossClues.push(clue);
      } else {
        this.downClues.push(clue);
      }
    }
  }

  render() {
    return (
      <div>
        <ClueHolder 
          className='across-clues' 
          title='Across'
          clues={ this.acrossClues }
        />
        <ClueHolder 
          className='down-clues' 
          title='Down' 
          clues={ this.downClues }
        />
      </div>
    );
  }
}

const select = (state) => ({
  clues: state.puzzle.current.clues,
  clueRow: state.puzzle.clueRow,
  clueColumn: state.puzzle.clueColumn,
  clueDirection: state.puzzle.clueDirection,
});

export default connect(select)(Clues);