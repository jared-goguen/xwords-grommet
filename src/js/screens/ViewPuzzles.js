import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';

import NavControl from '../components/NavControl';
import PuzzleList from '../components/PuzzleList';

import { pageLoaded } from './utils';

import { loadRecent, unloadRecent } from '../actions/puzzles';

class ViewPuzzles extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    pageLoaded('ViewPuzzles');
    this.props.dispatch(loadRecent(10));
  }

  componentWillUnmount() {
    this.props.dispatch(unloadRecent());
  }

  render() {
    const { recent } = this.props;

    return (
      <Article primary={true}>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
          <NavControl />
        </Header>

        <Box
          direction='column'
          justify='between'
        >

          <Header
            direction='row'
            align='center'
            justify='between'
            size='large'
            pad={{ horizontal: 'none', between: 'small' }}
          >

          <PuzzleList puzzles={this.props.recent} />

          </Header>

        </Box>

      </Article>
    );
  }
}

ViewPuzzles.defaultProps = {
  session: {
    error: undefined
  }
};

ViewPuzzles.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  }),
  recent: PropTypes.array
};

ViewPuzzles.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session,
  recent: state.puzzles.recent
});

export default connect(select)(ViewPuzzles);
