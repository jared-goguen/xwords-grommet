import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Spinning from 'grommet/components/icons/Spinning';

import NavHeader from '../components/NavHeader';
import Puzzle from '../components/Puzzle';

import { pageLoaded } from './utils';

import { loadPuzzle, unloadPuzzle } from '../actions/puzzle';

class PuzzleHolder extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const { match: { params }, dispatch } = this.props;
    pageLoaded('PuzzleHolder');
    dispatch(loadPuzzle(params.path));
  }

  componentWillUnmount() {
    this.props.dispatch(unloadPuzzle());
  }

  render() {
    let content;
    if (this.props.puzzleLoaded) {
      content = <Puzzle />
    } else {
      content = (
        <Box
          direction='row'
          responsive={false}
          pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}
        >
          <Spinning /><span>Loading...</span>
        </Box>
      );
    }

    return (
      <Article primary={true} style={{height: '100%'}}>
        <NavHeader />
        {content}
      </Article>
    );
  }
}

PuzzleHolder.defaultProps = {};

PuzzleHolder.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  }),
  match: PropTypes.object.isRequired,
};

PuzzleHolder.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session,
  puzzleLoaded: state.puzzle.puzzleLoaded
});

export default connect(select)(PuzzleHolder);
