import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

class AddEditForm extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func,
    }).isRequired,
    onSubmit: PropTypes.func,
    onSuccess: PropTypes.func,
    entityToEdit: PropTypes.shape({}),
    editing: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]).isRequired,
  };

  static defaultProps = {
    onSubmit: () => {},
    onSuccess: () => {},
    entityToEdit: null,
    editing: false,
    resetForm: false,
    formResetted: () => {},
  };

  constructor(props) {
    super(props);

    const { resetForm, formResetted } = this.props;

    if (resetForm) {
      this.props.form.resetFields();
      formResetted();
    }
  }

  state = {
    submittingForm: false,
    titleDisabled: true,
  }

  componentWillUnmount() {
    if (this.submitBtnReset) {
      clearTimeout(this.submitBtnReset);
    }
  }

  setTitleDisabled = (flag) => {
    this.setState({
      titleDisabled: flag,
    });
  }

  setSubmitFormStatus = (flag) => {
    this.setState({
      submittingForm: flag,
    }, () => {
      // Automatically enable the submit button after 3s
      // HACK
      // TODO: Need to check the API status whether it has completed or not
      // But that is not being tracked as of now anywhere, so ...
      if (this.submitBtnReset) {
        clearTimeout(this.submitBtnReset);
      }

      if (flag) {
        this.submitBtnReset = setTimeout(() => {
          this.setSubmitFormStatus(false);
        }, 3000);
      }
    });
  }

  getSubmitButtonText = () => {
    const { submittingForm } = this.state;
    const { editing } = this.props;

    if (submittingForm && editing) {
      return 'Updating...';
    }

    if (submittingForm && !editing) {
      return 'Saving...';
    }

    if (editing) {
      return 'Update';
    }

    return 'Save';
  }

  render() {
    const { titleDisabled, submittingForm } = this.state;
    const { component: WrappedComponent } = this.props;

    return (
      <WrappedComponent
        titleDisabled={titleDisabled}
        setTitleDisabled={this.setTitleDisabled}
        submittingForm={submittingForm}
        setSubmitFormStatus={this.setSubmitFormStatus}
        getSubmitButtonText={this.getSubmitButtonText}
        {...this.props}
      />
    );
  }
}

export default Form.create()(AddEditForm);
