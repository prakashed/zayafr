import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { debounce } from 'lodash';
import { Modal, Button, Form, Input, Select, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  createAnnualPlanAction
  // updateAnnualPlanAction,
} from '../../reducers/annual-plans';

import { searchTheories } from '../../apis/theories-api';
import AddCustomRecital from './AddCustomRecital';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select;

class AddEditAnnualPlan extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    onSubmit: PropTypes.func,
    annualPlanToEdit: PropTypes.shape({}),
    editingAnnualPlan: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    hideModal: PropTypes.func,
    addAnnualPlan: PropTypes.func,
    updateAnnualPlan: PropTypes.func,
    addCustomRecital: PropTypes.func,
    classrooms: PropTypes.arrayOf(PropTypes.shape({})),
    theories: PropTypes.arrayOf(PropTypes.shape({})),
    customRecitals: PropTypes.array
  };

  static defaultProps = {
    onSubmit: () => {},
    addAnnualPlan: () => {},
    updateAnnualPlan: () => {},
    addCustomRecital: () => {},
    annualPlanToEdit: null,
    editingAnnualPlan: false,
    resetForm: false,
    formResetted: () => {},
    hideModal: () => {},
    classrooms: null,
    theories: null,
    customRecitals: []
  };

  constructor(props) {
    super(props);

    this.searchForTheories = debounce(this.searchForTheories, 750);

    this.searchForTheories('');

    this.state = {
      submittingForm: false,
      titleDisabled: true,
      classrooms: [],
      theories: [],
      startValue: null,
      endValue: null
    };
  }

  disabledStartDate = startValue => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  hideAddEditAnnualPlanModal = () => {
    this.props.hideModal();
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      form,
      onSubmit,
      editingAnnualPlan,
      annualPlanToEdit,
      schoolId,
      customRecitals
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submittingForm: true
        });

        let newAnnualPlan = {};

        if (editingAnnualPlan) {
          newAnnualPlan = { ...annualPlanToEdit };
        }

        const { fromDate, toDate } = values;

        const updatedValues = {
          ...values,
          fromDate: fromDate.format('YYYY-MM-DD'),
          toDate: toDate.format('YYYY-MM-DD'),
          school: schoolId,
          customRecitals: customRecitals
        };

        if (editingAnnualPlan) {
          // const { id } = annualPlanToEdit;
          // const { title, learningOutcome, assessment } = { ...updatedValues };
          // this.props.updateAnnualPlan({
          //   id,
          //   title,
          //   learningOutcome,
          //   assessment,
          //   school: schoolId
          // });
        } else {
          this.props.addAnnualPlan({ ...updatedValues });
        }

        this.hideAddEditAnnualPlanModal();
        customRecitals = [];
        this.setState({
          submittingForm: false
        });
      }
    });
  };

  searchForTheories = value => {
    this.setState({
      theories: [],
      searchingTheories: true
    });

    searchTheories({ search: value }).then(response => {
      const { results } = response;
      this.setState({
        theories: results,
        searchingTheories: false
      });
    });
  };

  render() {
    const {
      schoolName,
      schoolId,
      annualPlanToEdit,
      editingAnnualPlan,
      classrooms,
      addCustomRecital,
      customRecitals
    } = this.props;

    var { theories, searchingTheories } = this.state;
    const { startValue, endValue } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };

    let annualPlanTitle;
    let annualPlanId;

    if (annualPlanToEdit) {
      // const {
      //   id,
      //   title,
      //   learningOutcome,
      //   assessment,
      //   classroomsDetails,
      //   annualPlanVideosDetails
      // } = annualPlanToEdit;
      // annualPlanTitle = title;
      // annualPlanVideos = annualPlanVideosDetails;
      // annualPlanId = id;
      // annualPlanLearningOutcome = learningOutcome;
      // annualPlanAssessment = assessment;
      // annualPlanTheories = classroomsDetails;
    }

    return (
      <Modal
        title={`${schoolName} - ${
          editingAnnualPlan ? 'Edit Annual Plan' : 'Add Annual Plan'
        }`}
        visible={this.props.showAddAnnualPlanModal}
        onCancel={this.hideAddEditAnnualPlanModal}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="add-new-annualPlan"
        width="60%"
      >
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="Title" {...formItemLayout}>
              {getFieldDecorator('title', {
                initialValue: annualPlanTitle || '',
                rules: [
                  {
                    required: true,
                    message: 'Please give a title for the AnnualPlan!'
                  }
                ]
              })(
                <Input
                  placeholder="Enter AnnualPlan title..."
                  autoComplete="off"
                />
              )}
            </FormItem>

            <FormItem label="Start Date" {...formItemLayout}>
              {getFieldDecorator('fromDate', {
                rules: [
                  {
                    required: true,
                    message: 'Please select a start date for Annual Plan!'
                  }
                ]
              })(
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  format="YYYY-MM-DD"
                  value={startValue}
                  placeholder="From Date"
                  onChange={this.onStartChange}
                />
              )}
            </FormItem>

            <FormItem label="End Date" {...formItemLayout}>
              {getFieldDecorator('toDate', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an end date for Annual Plan!'
                  }
                ]
              })(
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  format="YYYY-MM-DD"
                  value={endValue}
                  placeholder="To Date"
                  onChange={this.onEndChange}
                />
              )}
            </FormItem>

            <FormItem label="Classes" {...formItemLayout}>
              {getFieldDecorator('classrooms', {
                rules: [
                  {
                    required: true,
                    message: 'Please select the classes for the Annual Plan!'
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Add Classes"
                  style={{ width: '100%' }}
                >
                  {classrooms.map(classroom => (
                    <Option key={classroom.id} value={classroom.id}>
                      {classroom.title}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            {editingAnnualPlan ? null : (
              <FormItem label="Theories" {...formItemLayout}>
                {getFieldDecorator('theories', {
                  rules: [{ required: false, type: 'array' }]
                })(
                  <Select
                    mode="multiple"
                    placeholder="Add Theories"
                    notFoundContent={
                      searchingTheories ? 'Searching' : 'No Such Theory Found.'
                    }
                    filterOption={false}
                    onSearch={value => this.searchForTheories(value)}
                    style={{ width: '100%' }}
                  >
                    {theories.map(theory => (
                      <Option key={theory.id} value={theory.id}>
                        {theory.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}

            <AddCustomRecital
              addCustomRecital={customRecital =>
                addCustomRecital(customRecital)
              }
              customRecitals={customRecitals}
            />

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: 'right' }}
                disabled={this.state.submittingForm}
              >
                Save
              </Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addAnnualPlan: createAnnualPlanAction
      // updateAnnualPlan: updateAnnualPlanAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Form.create()(AddEditAnnualPlan));
// export default AddNewAnnualPlan
