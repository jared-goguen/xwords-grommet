import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Header from 'grommet/components/Header';
import Box from 'grommet/components/Box';

import LoginForm from '../components/LoginForm';
import NavControl from '../components/NavControl';
import Logo from '../components/Logo';

import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
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
      router.history.push('/dashboard')
    )));
  }

  render() {
    const { session: { error } } = this.props;

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
