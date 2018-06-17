import React from 'react';

import Cell from './Cell';

class Row extends React.Component {
  /*
  props
    index: Number row number
    clueMarkers: [ ClueMarkers clueMarker, ... ]
    answers: [ Character answer, ... ]
    activeCells: [ Boolean active, ... ]
    entries: [ Character entry, ... ]
    
  */
  render() {
    return (
      <tr>
        { this.props.answers.map(
          (answers, i) => 
          <Cell 
            key={ i } 
            row={ this.props.index } 
            column={ i } 
            number={ this.props.clueMarkers[i] } 
            answer={ answers }
            active={ this.props.activeCells[i] }
            entry={ this.props.entries[i] }
          />
        ) }
      </tr>
    );
  }
}

export default Row;