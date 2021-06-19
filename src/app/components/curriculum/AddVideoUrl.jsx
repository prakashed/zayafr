import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Button, Icon, Input, Form } from 'antd';

let id = 0;

class AddVideoUrl extends Component {
  constructor(props) {
    super(props);
    const { form } = props;
  }

  componentDidMount() {
    // this.props.add();
  }

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    // debugger;
    // const form = ;
    const { form } = this.props;
    // debugger;
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => names[key]));
      }
    });
  };

  deleteUrlButton(keys, remove, k) {
    return keys.length > 1 ? (
      <Icon
        className="dynamic-delete-button"
        type="minus-circle-o"
        onClick={() => remove(k)}
      />
    ) : (
      ''
    );
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayout}
        label={`Url ${parseInt(index + 1)}`}
        required={false}
        key={k}
      >
        {getFieldDecorator(`urls[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: false,
              whitespace: false,
              message: 'Please add a link/url to embed.',
              pattern:
                '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
            }
          ]
        })(
          <Input
            placeholder="URL"
            addonAfter={this.deleteUrlButton(keys, this.remove, k)}
          />
        )}
      </Form.Item>
    ));

    return (
      <Fragment>
        {formItems}

        <Form.Item {...formItemLayout} style={{ textAlign: 'right' }}>
          <Button type="dashed" onClick={this.add}>
            <Icon type="plus" /> Add Link/URL
          </Button>
        </Form.Item>
      </Fragment>
    );
  }
}

export default AddVideoUrl;
