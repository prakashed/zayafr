import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Select, Input, Form } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

class Step1Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      categories, form,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout="vertical" className="step-content step-1">
        <FormItem label="Name your brand new unit">
          {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input the name of the unit!' }],
            })(<Input className="unit-title" placeholder="Unit name" />)}
        </FormItem>
        <FormItem label="Select a category">
          {getFieldDecorator('category', {
              rules: [{ required: true, message: 'Please select a category!' }],
            })(<Select className="category-picker" placeholder="Please select a category">{
                    categories &&
                    categories.map(category =>
                      <Option key={category.id} value={category.id}>{ category.title }</Option>)
                  }
               </Select>)}
        </FormItem>
      </Form>
    );
  }
}

Step1Content.propTypes = {
  categories: ImmutablePropTypes.list,
  form: PropTypes.shape({}),
};

Step1Content.defaultProps = {
  categories: null,
  form: null,
};

export default Form.create()(Step1Content);
