import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { Form, Input, Button, Select, Icon, DatePicker, Switch, notification } from 'antd';
import { Link } from 'react-router-dom';

import routes from '../../constants/routes.json';
import RecitalLessonSelection from './RecitalLessonSelection';
import LessonPlan from './LessonPlan';

import './AddEditDailyPlan.less';
import { DAILY_PLAN_DATE_FORMAT, DATE_FORMAT } from '../../constants/config';
import { parseToDosToLessonPlans, mergeLessonArraysWithoutAnyDuplicate, todoIsAlreadyCreated } from '../../helpers';
import InstrumentTag from '../misc/InstrumentTag';
import ClassroomsTitle from '../misc/ClassroomsTitle';

const FormItem = Form.Item;
const { Option } = Select;

const getInitialState = () => {
  const initialState = {
    recitalModalVisible: false,
    annualPlan: null,
    addedLessonPlans: [],
  };
  return initialState;
};

export default class AddEditDailyPlan extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      getFieldValue: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func,
    }).isRequired,
    onSubmit: PropTypes.func,
    entityToEdit: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
    editing: PropTypes.bool,
    setSubmitFormStatus: PropTypes.func,
    getSubmitButtonText: PropTypes.func,
    submittingForm: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    classrooms: PropTypes.arrayOf(PropTypes.shape({})),
    instruments: ImmutablePropTypes.list,
    removeTodo: PropTypes.func,
  };

  static defaultProps = {
    onSubmit: () => {},
    entityToEdit: null,
    editing: false,
    setSubmitFormStatus: () => {},
    getSubmitButtonText: () => {},
    submittingForm: false,
    resetForm: false,
    formResetted: () => {},
    classrooms: null,
    instruments: null,
    removeTodo: () => {},
  };

  state = getInitialState()

  componentDidMount() {
    const {
      editing, entityToEdit,
    } = this.props;

    if (editing) {
      this.populateAddEditForm(entityToEdit);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { resetForm, entityToEdit } = nextProps;
    if (resetForm && !this.props.resetForm) {
      this.props.form.resetFields();
      this.props.formResetted();
      this.setState(getInitialState());
    }

    // If we received daily plan to edit,
    // we created an daily plan and after success it went to edit mode
    // now we need to reset the submit form status from submitting to not submitting
    if (!this.props.entityToEdit && entityToEdit) {
      this.props.setSubmitFormStatus(false);

      this.populateAddEditForm(entityToEdit);
    }

    // Special Check, see if we have toDosDetails fetched
    // If So, then set the state of lesson plans after parsing them
    if (entityToEdit && entityToEdit.toDosDetails) {
      const { toDosDetails } = entityToEdit;
      const lessonPlans = toDosDetails ? parseToDosToLessonPlans(toDosDetails) : [];
      console.log('already added lesson plans --> ', lessonPlans);
      this.setState({ addedLessonPlans: lessonPlans });
    }

    // Set Annual Plan context if we are editing and we already have some primary class selected
    if (entityToEdit && nextProps.classrooms) {
      const primaryClass = this.props.form.getFieldValue('primaryClass');
      this.setAnnualPlanContext({ classroomId: primaryClass, classrooms: nextProps.classrooms });
    }
  }

  setAnnualPlanContext = ({ classroomId, classrooms }) => {
    const primaryClass = classrooms.find(c => c.id === classroomId);
    const { annualPlans } = primaryClass;
    const annualPlanId = annualPlans && annualPlans[0];
    this.setState({
      annualPlan: annualPlanId,
    });
  }

  getSelectedInstrument = () => {
    const { instruments, entityToEdit } = this.props;
    const { instrument } = entityToEdit;
    const instrumentDetails = instruments.find(i => i.id === instrument);
    return instrumentDetails;
  }

  getAdditionalClasses = () => {
    const { getFieldValue } = this.props.form;
    const { classrooms } = this.props;
    const { annualPlan } = this.state;

    const selectedPrimaryClass = getFieldValue('primaryClass');
    const filteredClassrooms = classrooms && classrooms.filter((c) => {
      const isNotPrimaryClass = c.id !== selectedPrimaryClass;

      const hasSameAnnualPlanAsPrimaryClass = c.annualPlans[0] === annualPlan;

      return isNotPrimaryClass && hasSameAnnualPlanAsPrimaryClass;
    });

    return filteredClassrooms;
  }

  getLessonAddedToDailyPlan = () => {
    const { addedLessonPlans } = this.state;

    const lessonIds = addedLessonPlans.reduce((arr, lessonPlan) => {
      const { lessons } = lessonPlan;

      const lessonIdsHere = lessons.map(lessonObj => lessonObj.lesson.id);

      return [...arr, ...lessonIdsHere];
    }, []);

    return lessonIds;
  }

  getTodoFromLessonPlans = ({ lessonPlanId, toDoId }) => {
    const { addedLessonPlans } = this.state;
    const pos = addedLessonPlans.findIndex(l => l.id === lessonPlanId);

    if (pos > -1) {
      const lessonPlan = addedLessonPlans[pos];
      const { lessons } = lessonPlan;
      const lessonPos = lessons.findIndex(l => l.id === toDoId);

      if (lessonPos > -1) {
        return lessons[lessonPos];
      }
    }

    return null;
  }

  formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  }

  populateAddEditForm = (dailyPlan) => {
    const {
      date,
      instrument,
      classroomsDetails,
    } = dailyPlan;

    const classIds = classroomsDetails.map(c => c.id);
    // Let the first classroom id be called as primaryClass
    // Need to come up with better check
    const [primaryClass] = classIds;

    this.props.form.setFieldsValue({
      title: date,
      date: moment(date),
      instrument,
      primaryClass,
    });
  }

  showRecitalModal = () => {
    this.setState({ recitalModalVisible: true });
  }

  hideRecitalModal = () => this.setState({ recitalModalVisible: false })

  handlePrimaryClassChange = (classroomId) => {
    const { classrooms } = this.props;
    this.setAnnualPlanContext({ classroomId, classrooms });
    this.props.form.setFieldsValue({
      additionalClasses: [],
    });
  }

  recitalLessonSelectionSubmitted = (data) => {
    this.addNewLessonPlan(data);
    this.hideRecitalModal();
  }

  addNewLessonPlan = (lessonPlan) => {
    const { recital } = lessonPlan;
    const { addedLessonPlans } = this.state;
    const pos = addedLessonPlans.findIndex(l => l.recital === recital);
    let newLessonPlans = [];
    if (pos === -1) {
      // Adding new lesson plan with different recital
      newLessonPlans = [...addedLessonPlans, lessonPlan];
    } else {
      const oldLessonPlan = addedLessonPlans[pos];
      const { lessons } = lessonPlan;
      const { lessons: alreadyAddedLessons } = oldLessonPlan;
      // Create a single array of non-duplicate lessons from lessons and alreadyAddedLessons
      // Some lesson may have already have been checked
      // BOUNDARY CASE:
      // This function in case of duplicate, will consider the first instance
      const mergedLessonsWithoutDuplicate =
        mergeLessonArraysWithoutAnyDuplicate(alreadyAddedLessons, lessons);
      const newLessonPlan = { ...oldLessonPlan, lessons: mergedLessonsWithoutDuplicate };
      newLessonPlans = [
        ...addedLessonPlans.slice(0, pos),
        newLessonPlan,
        ...addedLessonPlans.slice(pos + 1),
      ];
    }

    this.setState({ addedLessonPlans: newLessonPlans });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {
      form, onSubmit,
      setSubmitFormStatus, entityToEdit,
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const addedToDos = this.checkIfAddedSomeToDos();

        if (!addedToDos) {
          notification.error({
            message: 'No ToDos added!',
            description: 'Please add some todos for this daily plan!',
          });
          return;
        }

        const {
          date,
          instrument,
          primaryClass,
          additionalClasses,
        } = values;

        const classesId = additionalClasses ? [primaryClass, ...additionalClasses] : [primaryClass];

        setSubmitFormStatus(true);

        const annualPlanData = {
          ...entityToEdit,
          date: date.format(DATE_FORMAT),
          instrument,
          classrooms: classesId,
          toDos: this.formToDoDataList(),
        };

        onSubmit(annualPlanData);
      }
    });
  }

  checkIfAddedSomeToDos = () => {
    const { addedLessonPlans } = this.state;
    return addedLessonPlans.length > 0;
  }

  formToDoDataList = () => {
    const { addedLessonPlans } = this.state;

    const todos = addedLessonPlans.reduce((intermediateToDos, lessonPlan) => {
      const { portion, lessons } = lessonPlan;

      const todosForThisLessonPlan = lessons.reduce((intermediate, todo) => {
        if (todoIsAlreadyCreated(todo)) return intermediate;

        const { lesson, assessment, activity } = todo;

        const todoPayload = {
          portion,
          lesson: lesson.id,
          assessment,
          activity: activity && activity.id,
        };
        intermediate.push(todoPayload);
        return intermediate;
      }, []);

      return [...intermediateToDos, ...todosForThisLessonPlan];
    }, []);

    return todos;
  }

  showAddRecitalOption = () => {
    const { getFieldValue } = this.props.form;
    const classroom = getFieldValue('primaryClass');
    const instrumentSelected = getFieldValue('instrument');

    const canShowAddRecitalOption = classroom && instrumentSelected;

    const addRecitalOption = (
      <div style={{ cursor: 'pointer', marginTop: '24px' }} onClick={this.showRecitalModal} role="presentation">
        <Icon type="plus-circle-o" /> Add Daily Plan To Do
      </div>
    );

    const renderValue = canShowAddRecitalOption ? addRecitalOption : '';
    return renderValue;
  }

  removeToDo = (args) => {
    const todo = this.getTodoFromLessonPlans(args);
    if (todo && todoIsAlreadyCreated(todo)) {
      this.removeCreatedToDo(args);
    }

    this.removeToDoFromState(args);
  }

  removeCreatedToDo = ({ toDoId }) => {
    const { entityToEdit } = this.props;
    const { id: dailyPlan } = entityToEdit;
    this.props.removeTodo({ toDoId, dailyPlan });
  }

  removeToDoFromState = ({ lessonPlanId, toDoId }) => {
    const { addedLessonPlans } = this.state;
    const pos = addedLessonPlans.findIndex(l => l.id === lessonPlanId);

    if (pos > -1) {
      const lessonPlan = addedLessonPlans[pos];
      const { lessons } = lessonPlan;
      const lessonPos = lessons.findIndex(l => l.id === toDoId);
      if (lessonPos > -1) {
        const newLessons = [...lessons.slice(0, lessonPos), ...lessons.slice(lessonPos + 1)];

        let newAddedLessonPlans = [...addedLessonPlans];

        // if there are todos left, then update the lesson plan
        if (newLessons.length > 0) {
          const newLessonPlan = {
            ...lessonPlan,
            lessons: newLessons,
          };

          newAddedLessonPlans = [
            ...addedLessonPlans.slice(0, pos),
            newLessonPlan,
            ...addedLessonPlans.slice(pos + 1),
          ];
        } else {
          // or remove the lesson plan
          newAddedLessonPlans = [
            ...addedLessonPlans.slice(0, pos),
            ...addedLessonPlans.slice(pos + 1),
          ];
        }

        this.setState({ addedLessonPlans: newAddedLessonPlans });
      }
    }
  }

  renderInstruments = () => {
    const { instruments } = this.props;

    return (
      <Select placeholder="Select Instrument">
        {
          instruments && instruments.map(instrument => (
            <Option key={instrument.id} value={instrument.id}>
              {instrument.title}
            </Option>
          ))
        }
      </Select>
    );
  }

  renderClassroomOptions = classrooms => (
    classrooms && classrooms.map(classroom => (
      <Option key={classroom.id} value={classroom.id}>
        {classroom.gradeDetails.title} {classroom.divisionDetails.title}
      </Option>
    ))
  )

  renderClassrooms = () => {
    const { classrooms } = this.props;
    const classroomsWithAnnualPlans = classrooms &&
      classrooms.filter(c => c.annualPlans && c.annualPlans.length);

    if (classroomsWithAnnualPlans) {
      return (
        <Select placeholder="Select Classrooms" onChange={this.handlePrimaryClassChange}>
          { this.renderClassroomOptions(classroomsWithAnnualPlans) }
        </Select>
      );
    }

    return '';
  }

  renderAdditionalClassrooms = filteredClassrooms => (
    <Select placeholder="Select Classrooms" mode="multiple">
      { this.renderClassroomOptions(filteredClassrooms) }
    </Select>
  )

  renderAddedLessonPlans = () => {
    const { addedLessonPlans } = this.state;
    if (!addedLessonPlans.length) return '';
    return (
      <div className="lesson-plan-container">
        <div className="title">ToDos</div>
        {
          addedLessonPlans.map(lessonPlan =>
            (<LessonPlan
              key={lessonPlan.id}
              lessonPlan={lessonPlan}
              canRemoveLesson
              removeToDo={this.removeToDo}
            />))
        }
      </div>
    );
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };

    const { recitalModalVisible, annualPlan } = this.state;

    const {
      editing,
      entityToEdit,
      getSubmitButtonText,
      submittingForm,
    } = this.props;

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const dateSelected = getFieldValue('date');
    const primaryClass = getFieldValue('primaryClass');
    const additionalClasses = getFieldValue('additionalClasses');
    const instrumentSelected = getFieldValue('instrument');

    const dailyPlanTitle = dateSelected ? moment(dateSelected).format(DAILY_PLAN_DATE_FORMAT) : '';

    const cancelRedirectUrl = editing ? `${routes.daily_plans}/${entityToEdit.id}` : `${routes.daily_plans}`;

    const selectedInstrumentForDailyPlan = entityToEdit &&
     this.getSelectedInstrument(entityToEdit.instrument);

    const classroomDetails = entityToEdit && entityToEdit.classroomsDetails;

    const filteredAdditionalClasses = this.getAdditionalClasses();

    const lessonIdsAddedToDailyPlan = this.getLessonAddedToDailyPlan();

    return (
      <div className="add-daily-plan-container add-new-container details details-view">
        <div className="add-new-form">
          <Form layout="horizontal" hideRequiredMark onSubmit={this.handleSubmit}>
            <FormItem>
              <Input
                disabled
                className="title-input"
                placeholder="Select a date for the daily plan."
                autoComplete="off"
                value={dailyPlanTitle}
                style={{ background: 'transparent', border: 'none' }}
              />
            </FormItem>
            <FormItem label="Date" {...formItemLayout}>
              {
                getFieldDecorator('date', {
                rules: [{ required: true, message: 'Please select a date for Daily Plan!' }],
                })(<DatePicker />)
              }
            </FormItem>
            <FormItem label="Instrument" {...formItemLayout}>
              {
                /**
                 * If we are not editing, then show instrument selection dropdown
                 * else, show the selected instrument for the daily plan
                 */
              }
              {
                !editing && getFieldDecorator('instrument', {
                  rules: [{ required: true, message: 'Please select an instrument!' }],
                })(this.renderInstruments())
              }
              {
                selectedInstrumentForDailyPlan
                && <InstrumentTag instrument={selectedInstrumentForDailyPlan} />
              }
            </FormItem>
            <FormItem label="Class" {...formItemLayout}>
              {
                /**
                 * If we are not editing, then show instrument selection dropdown
                 * else, show the selected instrument for the daily plan
                 */
              }
              {
                !editing && getFieldDecorator('primaryClass', {
                  rules: [{ required: true, message: 'Please select a class!' }],
                })(this.renderClassrooms())
              }
              {
                classroomDetails && <ClassroomsTitle classrooms={classroomDetails} />
              }
            </FormItem>
            {/**
                Show option to select multiple classrooms
            */}
            {
              !entityToEdit && primaryClass && filteredAdditionalClasses.length ? (
                <FormItem label="Add more classes" {...this.formItemLayout}>
                  {
                  getFieldDecorator('additionalClasses', {
                    rules: [{ required: false, message: 'Please select a class!' }],
                  })(this.renderAdditionalClassrooms(filteredAdditionalClasses))
                }
                </FormItem>) : ''
            }
            {
              /**
               * Show a toggle option to specify
               * if same daily plan has to be used across all classes or not
               */
            }
            {
              additionalClasses && additionalClasses.length ? (
                <FormItem label="Prepare same plan for all classes" {...formItemLayout}>
                  {
                    getFieldDecorator('samePlan')(<Switch />)
                  }
                </FormItem>
              ) : ('')
            }
            {
              this.showAddRecitalOption()
            }
            {
              this.renderAddedLessonPlans()
            }
            <FormItem>
              <Link to={cancelRedirectUrl}><Button type="default">Cancel</Button></Link>
              <Button type="primary" htmlType="submit" disabled={submittingForm}>
                { getSubmitButtonText() }
              </Button>
            </FormItem>
          </Form>
        </div>
        <RecitalLessonSelection
          visible={recitalModalVisible}
          onOk={this.recitalLessonSelectionSubmitted}
          onCancel={this.hideRecitalModal}
          annualPlan={annualPlan}
          instrumentId={instrumentSelected}
          addedLessonIds={lessonIdsAddedToDailyPlan}
        />
      </div>
    );
  }
}
