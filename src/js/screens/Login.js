import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';

import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';
import NavControl from '../components/NavControl';

import { login } from '../actions/session';
import { pageLoaded } from './utils';


class Login extends Component {
  constructor() {
    super();
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    pageLoaded('Login');
  }

  componentWillUnmount() {
  }

  _onSubmit(fields) {
    const { dispatch } = this.props;
    const { router } = this.context;
    dispatch(login(fields.username, fields.password, () => (
      router.history.push('/puzzles')
    )));
  }

  render() {
    const { session: { error } } = this.props;

    return (
      <Article primary={true}>

        <Box
          direction='column'
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
            <LoginForm
              logo={<Logo />}
              onSubmit={this._onSubmit}
              onRegister={() => {}}
              errors={[error]}
              usernameType='text'
            />
            <span />

          </Header>

        </Box>

      </Article>
    );
  }
}

Login.defaultProps = {
  session: {
    error: undefined
  }
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

Login.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default connect(select)(Login);
