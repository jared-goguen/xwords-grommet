import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TableHeader from 'grommet/components/TableHeader';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';

class PuzzleList extends Component {
  constructor() {
    super();
  }

  render() {
    let puzzles = [];
    for(let i in this.props.puzzles) {
      puzzles.push(this.props.puzzles[i]);
    }
    let rows = puzzles.map((puzzle, i) => {
      return(
        <TableRow key={i}>
          <td>
            {puzzle.date}
          </td>
          <td>
            {puzzle.title}
          </td>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHeader labels={['Date', 'Title']}
          sortIndex={0}
          sortAscending={false}
          onSort={() => {}} />
        <tbody>
          {rows}
        </tbody>
      </Table>
    );
  }
}

PuzzleList.defaultProps = {};

/*
PuzzleList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  puzzles: PropTypes.array.isRequired,

};
*/
const select = state => ({
  session: state.session
});

export default connect(select)(PuzzleList);
