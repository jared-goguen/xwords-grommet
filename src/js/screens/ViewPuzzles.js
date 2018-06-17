import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Spinning from 'grommet/components/icons/Spinning';

import NavControl from '../components/NavControl';
import PuzzleList from '../components/PuzzleList';

import { pageLoaded } from './utils';

import { loadLatest, unloadLatest } from '../actions/puzzle';

class ViewPuzzles extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    pageLoaded('ViewPuzzles');
    this.props.dispatch(loadLatest(10));
  }

  componentWillUnmount() {
    this.props.dispatch(unloadRecent());
  }

  render() {
    let content;
    if (this.props.latest.length !== 0) {
      content = <PuzzleList latest={this.props.latest} />
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
      <Article primary={true}>
        <Header
          direction='row'
          justify='between'
          size='small'
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

            {content}

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
  latest: PropTypes.array
};

ViewPuzzles.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session,
  latest: state.puzzle.latest
});

export default connect(select)(ViewPuzzles);
