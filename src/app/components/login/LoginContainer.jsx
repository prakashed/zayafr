import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { notification } from 'antd';

import { requestLogin } from '../../reducers/auth';
// import routes from '../../constants/routes.json';
import Login from './Login';

class LoginContainer extends Component {
  static propTypes = {
    requestLogin: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    hasLoginError: PropTypes.bool.isRequired,
  };

  static defaultProps = {};

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasLoginError) {
      notification.error({
        message: 'Invalid username or password!',
        description: 'Please check your login credentials.',
      });
    }
  }

  onOutput = (val) => {
    const { username, password, remember } = val;
    this.props.requestLogin(username, password, remember);
  }

  render() {
    if (this.props.isLoggedIn) {
      return <Redirect to="/" />;
    }
    return <Login onOutput={this.onOutput} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: _.isString(state.auth.get('token')),
    hasLoginError: state.auth.get('error'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    requestLogin,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
