import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Checkbox } from 'antd';

import routes from '../../constants/routes.json';
import logo from '../../../assets/img/logo.png';

const FormItem = Form.Item;

class Login extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func
    }).isRequired,
    onOutput: PropTypes.func,
    onError: PropTypes.func
  };

  static defaultProps = {
    onOutput: () => {},
    onError: () => {}
  };

  constructor() {
    super();
    this.state = {
      loadingLogin: false
      // loadingGoogleLogin: false,
    };
  }

  onClickForgot = () => {
    // console.log('clicked on forgot', this);
  };

  // onClickGoogleLogin = () => {
  //   this.setState({ loadingGoogleLogin: true });
  //   setTimeout(() => {
  //     this.setState({ loadingGoogleLogin: false });
  //   }, 2000);
  // }

  onSubmit = event => {
    event.preventDefault();
    const { form, onOutput, onError } = this.props;
    const { validateFields } = form;
    this.setState({ loadingLogin: true });
    validateFields((err, values) => {
      if (!err) {
        onOutput(values);
      } else {
        onError(err);
      }
      this.setState({ loadingLogin: false });
    });
  };

  renderUsernameInput() {
    const fieldDecorator = this.props.form.getFieldDecorator('username', {
      rules: [{ required: true, message: 'Username is required' }]
    });
    return fieldDecorator(<Input placeholder="Username" />);
  }

  renderPasswordInput() {
    const fieldDecorator = this.props.form.getFieldDecorator('password', {
      rules: [{ required: true, message: 'Password is required' }]
    });
    return fieldDecorator(
      <Input
        type="password"
        placeholder="Password"
        // addonAfter={this.renderForgotButton()}
      />
    );
  }

  renderForgotButton() {
    return (
      <Button
        type="primary"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          height: 28
        }}
        onClick={this.onClickForgot}
        ghost
      >
        Forgot?
      </Button>
    );
  }

  renderRememberMe() {
    const fieldDecorator = this.props.form.getFieldDecorator('remember', {
      valuePropName: 'checked',
      initialValue: true
    });
    return fieldDecorator(<Checkbox>Stay Logged In</Checkbox>);
  }

  renderButtons() {
    return (
      <Fragment>
        <Button
          type="primary"
          htmlType="submit"
          loading={this.state.loadingLogin}
        >
          Log In with OCM
        </Button>
        {/* <Button
          style={{ marginLeft: 10 }}
          type="default"
          onClick={this.onClickGoogleLogin}
          loading={this.state.loadingGoogleLogin}
        >
          Log in with Google
        </Button> */}
      </Fragment>
    );
  }

  render() {
    return (
      <Row
        style={{ minHeight: '100%' }}
        type="flex"
        justify="center"
        align="middle"
      >
        <Col span={5} md={5} sm={10} xs={22}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '24px',
              height: '200px'
            }}
          >
            <img height="100%" src={logo} alt="" />
          </div>
          <h3>Log in with OCM</h3>
          {/* <p>Need an O3 account? Sign up here</p> */}
          <Form
            layout="vertical"
            onSubmit={this.onSubmit}
            className="login-form"
            hideRequiredMark
          >
            <FormItem style={{ marginBottom: 15 }} label="Username">
              {this.renderUsernameInput()}
            </FormItem>
            <FormItem style={{ marginBottom: 0 }} label="Password">
              {this.renderPasswordInput()}
            </FormItem>
            <FormItem style={{ marginBottom: 10 }}>
              {this.renderRememberMe()}
            </FormItem>
            {/* <Link to={routes.register}><p>Don't have an account. Create a demo account.</p></Link>*/}
            {this.renderButtons()}
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Form.create()(Login);
