import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import TableHeader from 'grommet/components/TableHeader';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';

class PuzzleList extends Component {
  constructor() {
    super();
    this.state = {
      sortAscending: false
    };
    this._onSort = this._onSort.bind(this);
  }

  _onSort(index, ascending) {
    console.log(index, ascending);
    this.setState({sortAscending: ascending})
  }

  render() {
    let { puzzles } = this.props;

    if (this.state.sortAscending) {
      puzzles.reverse();
    }

    let rows = puzzles.map((puzzle, i) => {
      let href = `/puzzle/${puzzle.id}`;
      return(
          <TableRow key={i}>
              <td>
                <Anchor href={href} label={puzzle.date} />   
              </td>     
              <td>
                <Anchor href={href} label={puzzle.title} />
              </td>       
          </TableRow>
      );
    });

    return (
      <Table>
        <TableHeader labels={['Date', 'Title']}
          sortIndex={0}
          sortAscending={this.state.sortAscending}
          onSort={this._onSort} />
        <tbody>
          {rows}
        </tbody>
      </Table>
    );
  }
}

PuzzleList.defaultProps = {};

PuzzleList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  puzzles: PropTypes.array,
};

const select = state => ({
  session: state.session
});

export default connect(select)(PuzzleList);
