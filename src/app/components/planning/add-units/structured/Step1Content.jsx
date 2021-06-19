import React from 'react';
import PropTypes from 'prop-types';
import { Select, Form } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

class Step1Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      books, form, bookSelected,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout="vertical" className="step-content step-1">
        <FormItem label="Book">
          {getFieldDecorator('book', {
              rules: [{ required: true, message: 'Please select a book!' }],
            })(<Select onChange={bookId => bookSelected(bookId)} className="book-picker" placeholder="Select a book">{
                    books &&
                    books.map(book =>
                      <Option key={book.id} value={book.id}>{ book.title }</Option>)
                  }
               </Select>)}
        </FormItem>
      </Form>
    );
  }
}

Step1Content.propTypes = {
  bookSelected: PropTypes.func.isRequired,
  books: PropTypes.arrayOf(PropTypes.shape({})),
  form: PropTypes.shape({}),
};

Step1Content.defaultProps = {
  books: null,
  form: null,
};

export default Form.create()(Step1Content);
