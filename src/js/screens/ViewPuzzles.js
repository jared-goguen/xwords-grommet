import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';

import NavControl from '../components/NavControl';

import { pageLoaded } from './utils';


class ViewPuzzles extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    pageLoaded('ViewPuzzles');
  }

  componentWillUnmount() {
  }

  render() {
    const { } = this.props;

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
          align='bottom'
          justify='between'
        >

          <Header />
          <Header />

          <Header
            direction='row'
            align='center'
            justify='between'
            size='large'
            pad={{ horizontal: 'none', between: 'small' }}
          >

            <span />

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
  })
};

ViewPuzzles.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default connect(select)(ViewPuzzles);
