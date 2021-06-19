import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { Link } from 'react-router-dom';

import routes from '../../constants/routes.json';
import '../core/CoreLayout.less';

const FormItem = Form.Item;
const { Option } = Select;

class AddUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      role: null,
      titleDisabled: true,
    };
  }

  setTitleDisabled(flag) {
    this.setState({
      titleDisabled: flag,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };

    const { getFieldDecorator } = this.props.form;

    const { role } = this.state;

    return (
      <div className="add-user-container add-new-container details details-view">
        {/* <div className="add-new-title title">
          <h1>Enter Name</h1>
        </div> */}
        {/* <div className="profile-pic">
          <span>
            <Icon type="plus" />
            <p>Upload Avatar</p>
          </span>
        </div> */}
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem>
              {
                getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please enter the name of the user!' }],
                })(<Input className={`title-input ${this.state.titleDisabled ? 'disabled' : ''}`} onBlur={() => this.setTitleDisabled(true)} onClick={() => this.setTitleDisabled(false)} placeholder="Enter Name" />)
              }
            </FormItem>
            <FormItem label="Email" {...formItemLayout}>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please give the email address of the user!' }],
              })(<Input autoComplete="email" type="email" placeholder="Enter email" />)}
            </FormItem>
            <FormItem label="Phone number" {...formItemLayout}>
              {getFieldDecorator('contact', {
                rules: [{ required: true, message: 'Please give the contact info of the user!' }],
              })(<Input autoComplete="false" type="number" placeholder="Enter phone number" />)}
            </FormItem>
            <FormItem label="Select Role" {...formItemLayout}>
              {getFieldDecorator('role', {
                rules: [{ required: true, message: 'Please select the role of the user!' }],
              })(<Select onChange={val => this.setState({ role: val })} placeholder="Select role">
                <Option value="teacher">Teacher</Option>
                <Option value="superadmin">Admin</Option>
                <Option value="asq">ASQ</Option>
                 </Select>)}
            </FormItem>
            {
              role === 'teacher' ? (
                <FormItem label="Instruments" {...formItemLayout}>
                  {getFieldDecorator('instruments', {
                    rules: [{ required: true, message: 'Please select instruments for the teacher!' }],
                  })(<Select
                    mode="multiple"
                    placeholder="Select Instruments"
                  >
                    <Option key={1} value="guitar">Guitar</Option>
                    <Option key={2} value="piano">Piano</Option>
                    <Option key={3} value="tabla">Tabla</Option>
                     </Select>)}
                </FormItem>) : ''
            }
            <FormItem>
              <Link to={routes.users}><Button type="default">Cancel</Button></Link>
              <Button type="primary" htmlType="submit">Save</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddUser);
