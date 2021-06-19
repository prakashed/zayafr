import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

import routes from '../../constants/routes.json';
import '../core/CoreLayout.less';

const FormItem = Form.Item;

export default function AddTeacher() {
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  return (
    <div className="add-teacher-container add-new-container details details-view">
      <div className="add-new-title title">
        <h1>Enter Teacher Name</h1>
      </div>
      <div className="profile-pic">
        <span>
          <Icon type="plus" />
          <p>Upload Avatar</p>
        </span>
      </div>
      <div className="add-new-form">
        <Form layout="horizontal">
          <FormItem label="Email" {...formItemLayout}>
            <Input placeholder="Enter teacher's email" />
          </FormItem>
          <FormItem label="Phone number" {...formItemLayout}>
            <Input placeholder="Enter phone number" />
          </FormItem>
          <FormItem label="Schools" {...formItemLayout}>
            <Input placeholder="Enter schools" />
          </FormItem>
          <FormItem label="Instruments" {...formItemLayout}>
            <Input placeholder="Enter instruments" />
          </FormItem>
          <FormItem>
            <Link to={`${routes.teachers}`}><Button type="default">Cancel</Button></Link>
            <Button type="primary" htmlType="submit">Save</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}
