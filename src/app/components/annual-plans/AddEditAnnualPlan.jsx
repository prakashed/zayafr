import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Select,
  Icon,
  Tag,
  notification,
  DatePicker
} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

import AddCustomRecital from './AddCustomRecital';
import routes from '../../constants/routes.json';
import {
  createNewQuarter,
  checkForQuarterPeriodOverlaps,
  sortQuartersInAscendingOrder,
  checkIfQuartersOverflowAnnualPlanTime,
  mergeCustomRecitals,
  extractErrorMessage,
  showNotification,
  DEFAULT_ERROR_MESSAGE
} from '../../helpers';
import './AddEditAnnualPlan.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

function AddQuarter({
  optionsVisible,
  toggleOptionsVisibility,
  handleQuarterTitleChange,
  handleQuarterDateChange,
  addQuarter,
  quarterToEdit,
  quarterPeriod,
  cancelAddQuarter,
  quarterTitle
}) {
  return (
    <div className="add-quarter add-data-section">
      {!optionsVisible ? (
        <div
          className="show-form-btn"
          role="presentation"
          onClick={() => toggleOptionsVisibility(true)}
        >
          <Icon type="plus-circle-o" />
          <span>Add new quarter</span>
        </div>
      ) : (
        <div className="selection-input">
          <Input
            placeholder="Quarter Title"
            value={quarterTitle}
            defaultValue={quarterToEdit ? quarterToEdit.title : ''}
            onChange={handleQuarterTitleChange}
          />
          <RangePicker
            value={quarterPeriod}
            defaultValue={quarterPeriod}
            onChange={handleQuarterDateChange}
          />
          <div className="add-close-btns">
            <Button
              size="small"
              disabled={!quarterTitle.length || !quarterPeriod}
              onClick={addQuarter}
              type="primary"
            >
              Add
            </Button>
            <Button
              size="small"
              onClick={() =>
                cancelAddQuarter() && toggleOptionsVisibility(false)
              }
            >
              Cancel
            </Button>
            {/* <Icon  type="check-circle-o" />
              <Icon  type="close-circle-o" /> */}
          </div>
        </div>
      )}
    </div>
  );
}

AddQuarter.propTypes = {
  optionsVisible: PropTypes.bool,
  toggleOptionsVisibility: PropTypes.func,
  handleQuarterTitleChange: PropTypes.func,
  handleQuarterDateChange: PropTypes.func,
  addQuarter: PropTypes.func,
  quarterToEdit: PropTypes.shape({}),
  quarterPeriod: PropTypes.arrayOf(PropTypes.shape({})),
  cancelAddQuarter: PropTypes.func,
  quarterTitle: PropTypes.string
};

AddQuarter.defaultProps = {
  optionsVisible: false,
  toggleOptionsVisibility: () => {},
  handleQuarterTitleChange: () => {},
  handleQuarterDateChange: () => {},
  addQuarter: () => {},
  quarterToEdit: null,
  quarterPeriod: [],
  cancelAddQuarter: null,
  quarterTitle: ''
};

export default class AddEditAnnualPlan extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    onSubmit: PropTypes.func,
    entityToEdit: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      timeUnitDetails: PropTypes.arrayOf(PropTypes.shape({})),
      customRecitalDetails: PropTypes.arrayOf(PropTypes.shape({}))
    }),
    editing: PropTypes.bool,
    setTitleDisabled: PropTypes.func,
    titleDisabled: PropTypes.bool,
    setSubmitFormStatus: PropTypes.func,
    getSubmitButtonText: PropTypes.func,
    submittingForm: PropTypes.bool,
    classrooms: PropTypes.arrayOf(PropTypes.shape({})),
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    createQuarter: PropTypes.func,
    updateQuarter: PropTypes.func,
    deleteQuarter: PropTypes.func,
    deleteCustomRecital: PropTypes.func,
    removeCustomRecitalsFromStore: PropTypes.func,
    addCustomRecitalsInStore: PropTypes.func
  };

  static defaultProps = {
    onSubmit: () => {},
    entityToEdit: null,
    editing: false,
    setTitleDisabled: () => {},
    titleDisabled: true,
    setSubmitFormStatus: () => {},
    getSubmitButtonText: () => {},
    submittingForm: false,
    classrooms: null,
    resetForm: false,
    formResetted: () => {},
    createQuarter: () => {},
    updateQuarter: () => {},
    deleteQuarter: () => {},
    deleteCustomRecital: () => {},
    removeCustomRecitalsFromStore: () => {},
    addCustomRecitalsInStore: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      recitalsAdded: [],
      quartersAdded: [],
      addingQuarter: false,
      quarterToEdit: null,
      quarterTitle: '',
      quarterPeriod: null
    };
  }

  componentDidMount() {
    const { editing, entityToEdit } = this.props;

    if (editing) {
      this.populateAddEditForm(entityToEdit);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { resetForm, entityToEdit } = nextProps;
    if (resetForm) {
      this.props.form.resetFields();
      this.props.formResetted();
    }

    // If we received annual plan to edit,
    // we created an annual plan and after success it went to edit mode to add recitals and quarters
    // now we need to reset the submit form status from submitting to not submitting
    if (!this.props.entityToEdit && entityToEdit) {
      this.props.setSubmitFormStatus(false);

      this.populateAddEditForm(entityToEdit);
    }
  }

  setAddingQuarterState = flag => this.setState({ addingQuarter: flag });

  populateAddEditForm = annualPlan => {
    const {
      title,
      fromDate,
      toDate,
      classroomDetails,
      timeUnitDetails,
      recitalDetails
    } = annualPlan;

    const classrooms = classroomDetails.map(c => c.id);

    const from = moment(fromDate);
    const to = moment(toDate);

    this.props.form.setFieldsValue({
      title,
      fromDate: from,
      toDate: to,
      classrooms
    });

    this.setState({
      quartersAdded: timeUnitDetails,
      recitalsAdded: recitalDetails
    });
  };

  cancelAddQuarter = () => {
    const { quarterToEdit, quartersAdded } = this.state;
    let quartersArr = [...quartersAdded];

    if (quarterToEdit) {
      // we closing the adding recital state
      // check whether we were editing any recital
      // if so put back the original recital back
      quartersArr = [...quartersArr, quarterToEdit];
    }
    this.setState({
      quarterTitle: '',
      quarterPeriod: null,
      quartersAdded: quartersArr,
      quarterToEdit: null,
      addingQuarter: false
    });
  };

  removeCustomRecital = customRecitalId => {
    const { recitalsAdded } = this.state;
    const {
      deleteCustomRecital,
      removeCustomRecitalsFromStore,
      entityToEdit
    } = this.props;
    const { id: annualPlanId } = entityToEdit;
    const recitalPos = recitalsAdded.findIndex(r => r.id === customRecitalId);
    showNotification({ text: 'Deleting Custom Recitals', type: 'loading' });

    if (recitalPos > -1) {
      const recital = recitalsAdded[recitalPos];
      const { customRecitalIds } = recital;
      const deleteRequests = customRecitalIds.map(id =>
        deleteCustomRecital(id)
      );
      Promise.all(deleteRequests)
        .then(() => {
          removeCustomRecitalsFromStore({ annualPlanId, customRecitalIds });
          const modifiedRecitals = [
            ...recitalsAdded.slice(0, recitalPos),
            ...recitalsAdded.slice(recitalPos + 1)
          ];
          this.setState({
            recitalsAdded: modifiedRecitals
          });

          showNotification({ text: 'Deleted', type: 'success' });
        })
        .catch(err => {
          const errorMessage = extractErrorMessage(err);
          showNotification({
            text: errorMessage || 'Error while deleting custom recitals',
            type: 'error'
          });
        });
    }
  };

  handleQuarterTitleChange = e =>
    this.setState({ quarterTitle: e.target.value });

  handleQuarterDateChange = dateRange =>
    this.setState({ quarterPeriod: dateRange });

  addQuarter = () => {
    // Check for basic property
    const {
      quarterTitle,
      quarterPeriod,
      quartersAdded,
      quarterToEdit
    } = this.state;

    if (!quarterTitle || !quarterTitle.length || !quarterPeriod) return;

    // Create a temp quarter object based on the properties passed
    const newQuarter = createNewQuarter({
      title: quarterTitle,
      period: quarterPeriod
    });

    // Check for time constraint for Annual Plan
    const {
      entityToEdit: annualPlan,
      createQuarter,
      updateQuarter
    } = this.props;
    const { fromDate: from, toDate: to, id: annualPlanId } = annualPlan;
    const annualFromDate = moment(from).startOf('day');
    const annualToDate = moment(to).endOf('day');
    const quarterNotWithinAnnualPlanTime = checkIfQuartersOverflowAnnualPlanTime(
      {
        fromDate: annualFromDate,
        toDate: annualToDate,
        quarter: newQuarter
      }
    );

    if (quarterNotWithinAnnualPlanTime) {
      notification.error({
        message: `${
          newQuarter.title
        }'s time period not within Annual Plan's Start and End Date`,
        description:
          'All the quarters should come within the specified time for Annual Plan',
        duration: 0
      });
      return;
    }

    // Check for time constraint with already created quarters
    const newQuarterPeriodOverlaps = checkForQuarterPeriodOverlaps({
      newQuarter,
      quartersAdded
    });

    if (newQuarterPeriodOverlaps) {
      notification.error({
        message: 'Quarter dates should not overlap!',
        description: 'Please assign appropriate dates for the quarter.'
      });
      return;
    }

    // Call the API
    // Edit API if we are editing quarter or Create API if we adding new one
    if (quarterToEdit) {
      const quarterApiPayload = {
        ...quarterToEdit,
        ...newQuarter
      };

      showNotification({ text: 'Updating quarter', type: 'loading' });
      updateQuarter(quarterApiPayload)
        .then(quarterUpdated => {
          showNotification({ text: 'Updated', type: 'success' });
          // Now create a final obj from all the available properties for the UI
          const finalQuarterObj = { ...newQuarter, ...quarterUpdated };
          this.addQuarterToState(finalQuarterObj);
        })
        .catch(() =>
          showNotification({ text: DEFAULT_ERROR_MESSAGE, type: 'error' })
        );
    } else {
      // Finally form a payload for the API
      const quarterApiPayload = {
        ...newQuarter,
        annualPlan: annualPlanId
      };

      showNotification({ text: 'Adding quarter', type: 'loading' });
      createQuarter(quarterApiPayload)
        .then(quarterCreated => {
          showNotification({ text: 'Added', type: 'success' });
          // Now create a final obj from all the available properties for the UI
          const finalQuarterObj = { ...newQuarter, ...quarterCreated };
          this.addQuarterToState(finalQuarterObj);
        })
        .catch(() =>
          showNotification({ text: DEFAULT_ERROR_MESSAGE, type: 'error' })
        );
    }
  };

  addQuarterToState = quarter => {
    const { quartersAdded } = this.state;

    // No overlapping, add the new quarter
    this.setState({
      quarterTitle: '',
      quarterPeriod: null,
      addingQuarter: false,
      quartersAdded: sortQuartersInAscendingOrder([...quartersAdded, quarter]),
      quarterToEdit: null
    });
  };

  removeQuarter = id => {
    const { deleteQuarter } = this.props;
    showNotification({ text: 'Deleting quarter', type: 'loading' });

    deleteQuarter(id)
      .then(() => {
        const { quartersAdded } = this.state;
        const pos = quartersAdded.findIndex(q => q.id === id);
        if (pos > -1) {
          const modifiedQuarters = [
            ...quartersAdded.slice(0, pos),
            ...quartersAdded.slice(pos + 1)
          ];
          this.setState({
            quartersAdded: modifiedQuarters
          });

          showNotification({ text: 'Deleted quarter!', type: 'success' });
        }
      })
      .catch(() =>
        showNotification({ text: 'Something went wrong', type: 'error' })
      );
  };

  editQuarter = quarter => {
    // Remove this quarter from quartersAdded array and put it as quarterToEdit
    const { quartersAdded, addingQuarter } = this.state;
    // We can't add or edit multiple quarters at same time
    if (addingQuarter) return;

    let quartersArr = [...quartersAdded];
    const quarterPos = quartersArr.findIndex(q => q.id === quarter.id);
    if (quarterPos > -1) {
      quartersArr = [
        ...quartersAdded.slice(0, quarterPos),
        ...quartersAdded.slice(quarterPos + 1)
      ];
    }
    this.setState({
      quarterTitle: quarter.title,
      quarterPeriod: [moment(quarter.fromDate), moment(quarter.toDate)],
      addingQuarter: true,
      quarterToEdit: quarter,
      quartersAdded: quartersArr
    });
  };

  addedCustomRecital = newCustomRecitals => {
    const { addCustomRecitalsInStore, entityToEdit: annualPlan } = this.props;
    const { customRecitalDetails, id: annualPlanId } = annualPlan;
    addCustomRecitalsInStore({ annualPlanId, newCustomRecitals });
    const parsedCustomRecitals = mergeCustomRecitals([
      ...customRecitalDetails,
      ...newCustomRecitals
    ]);

    this.setState({
      recitalsAdded: parsedCustomRecitals
    });
  };

  filterClassroomList = (text, option) => {
    const classTitle = option.props.children;
    const grade = classTitle[0];
    const division = classTitle[classTitle.length - 1];
    const classroom = `${grade} ${division}`.toLowerCase();
    const searchText = text.toLowerCase().trim();
    return classroom.toLowerCase().indexOf(searchText) > -1;
  };

  handleSubmit = e => {
    e.preventDefault();

    const { form, onSubmit, setSubmitFormStatus, entityToEdit } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const { fromDate, toDate } = values;

        setSubmitFormStatus(true);

        const annualPlanData = {
          ...entityToEdit,
          ...values,
          fromDate: fromDate.format('YYYY-MM-DD'),
          toDate: toDate.format('YYYY-MM-DD'),
          description: ''
        };

        onSubmit(annualPlanData);
      }
    });
  };

  renderCustomRecitalList() {
    const { recitalsAdded } = this.state;

    return recitalsAdded.map(recital => (
      <li key={recital.id} className="list-item recital-instrument-item">
        <span>{recital.title}</span>
        {recital.instrumentDetails.map(i => (
          <Tag key={i.id} color={i.color}>
            {i.title}
          </Tag>
        ))}
        <Icon
          title="Remove"
          onClick={() => this.removeCustomRecital(recital.id)}
          type="close-circle-o"
        />
      </li>
    ));
  }

  renderQuarterList() {
    const { quartersAdded: quarters } = this.state;

    return quarters.map(quarter => (
      <li key={quarter.id} className="list-item quarter-item">
        <span className="title">{quarter.title}</span>
        <span className="dates">
          {quarter.fromDate} - {quarter.toDate}
        </span>
        <Icon
          title="Edit"
          onClick={() => this.editQuarter(quarter)}
          type="edit"
        />
        <Icon
          title="Remove"
          onClick={() => this.removeQuarter(quarter.id)}
          type="close-circle-o"
        />
      </li>
    ));
  }

  renderClassrooms = () => {
    const { classrooms } = this.props;
    return (
      classrooms &&
      classrooms.map(c => (
        <Option key={c.id} value={c.id}>
          {c.gradeDetails.title} {c.divisionDetails.title}
        </Option>
      ))
    );
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };

    const { getFieldDecorator } = this.props.form;

    const {
      setTitleDisabled,
      titleDisabled,
      editing,
      entityToEdit,
      getSubmitButtonText,
      submittingForm
    } = this.props;

    const {
      addingQuarter,
      quarterToEdit,
      quarterPeriod,
      quarterTitle
    } = this.state;

    const cancelRedirectUrl = editing
      ? `${routes.annual_plans}/${entityToEdit.id}`
      : `${routes.annual_plans}`;

    return (
      <div className="add-annual-plan-container add-new-container details details-view">
        <div className="add-new-form">
          <Form
            layout="horizontal"
            hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            <FormItem>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please give a title for Annual Plan!'
                  }
                ]
              })(
                <Input
                  className={`title-input ${titleDisabled ? 'disabled' : ''}`}
                  onBlur={() => setTitleDisabled(true)}
                  onClick={() => setTitleDisabled(false)}
                  placeholder="Enter Annual Plan Title..."
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
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="End Date" {...formItemLayout}>
              {getFieldDecorator('toDate', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an end date for Annual Plan!'
                  }
                ]
              })(<DatePicker />)}
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
                  filterOption={this.filterClassroomList}
                >
                  {this.renderClassrooms()}
                </Select>
              )}
            </FormItem>
            {editing && (
              <Fragment>
                <FormItem
                  required
                  className="recital-instrument-section"
                  label="Recitals"
                  {...formItemLayout}
                >
                  <ul>
                    {this.renderCustomRecitalList()}
                    <li>
                      <AddCustomRecital
                        annualPlanId={entityToEdit.id}
                        addedCustomRecital={this.addedCustomRecital}
                      />
                    </li>
                  </ul>
                </FormItem>
                <FormItem
                  required
                  className="quarter-section"
                  label="Quarters"
                  {...formItemLayout}
                >
                  <ul>
                    {this.renderQuarterList()}
                    <li>
                      <AddQuarter
                        optionsVisible={addingQuarter}
                        toggleOptionsVisibility={this.setAddingQuarterState}
                        handleQuarterTitleChange={this.handleQuarterTitleChange}
                        handleQuarterDateChange={this.handleQuarterDateChange}
                        addQuarter={this.addQuarter}
                        quarterToEdit={quarterToEdit}
                        quarterPeriod={quarterPeriod}
                        cancelAddQuarter={this.cancelAddQuarter}
                        quarterTitle={quarterTitle}
                      />
                    </li>
                  </ul>
                </FormItem>
              </Fragment>
            )}

            <FormItem>
              <Link to={cancelRedirectUrl}>
                <Button type="default">Cancel</Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                disabled={submittingForm}
              >
                {getSubmitButtonText()}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
