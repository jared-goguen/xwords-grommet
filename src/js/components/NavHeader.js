import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Header from 'grommet/components/Header';
import NavControl from '../components/NavControl';


class NavHeader extends React.Component {
  render() {
    let content;
    if (!this.props.show) {
      console.log('here')
      content = (
        <Header
          direction='row'
          justify='between'
          size='small'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
          <NavControl />
        </Header>
      );
    } else {
      content = null;
    }
    return content;
  }
}


const select = state => ({show: state.nav.active});

export default connect(select)(NavHeader);