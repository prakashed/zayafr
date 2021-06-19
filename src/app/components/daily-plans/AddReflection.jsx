import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal, Switch, Select, Input, InputNumber, Icon, Button, Table } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LessonPlan from './LessonPlan';
import { getGlobalReasonsAction } from '../../reducers/general';
import './AddReflection.less';

const { Option } = Select;
const { TextArea } = Input;

const getInitialState = () => ({
  allLessonsChecked: false,
  todoStatus: null,
  comment: '',
  reason: null,
  customReason: false,
  recitalBarsStatus: null,
  recitalProgress: {},
  instrument: null,
  dailyPlan: null,
  assistantTeachersSelected: [],
});

// Take LessonPlans as input that have lessons (array of todos) in them
// Each todo has lesson and completion status attached to it
// Prepare a map where lesson id is the key and the
const makeToDoMapper = lessonPlans => lessonPlans.reduce((mapper, lessonPlan) => {
  const { lessons } = lessonPlan;
  const todoStatusForThisLessonPlan = {};

  lessons.forEach((todo) => {
    const { isComplete, id } = todo;
    todoStatusForThisLessonPlan[id] = isComplete;
  });

  return {
    ...mapper,
    ...todoStatusForThisLessonPlan,
  };
}, {});

const makeRecitalProgressMapper = lessonPlans => lessonPlans.reduce((mapper, lessonPlan) => {
  const { recital, recitalBars } = lessonPlan;

  const recitalBarMapper = {};
  recitalBarMapper[recital] = {
    bars: parseInt(recitalBars, 10),
    progress: [],
  };

  return {
    ...mapper,
    ...recitalBarMapper,
  };
}, {});

// const makeProgressObjectForRecital = (recital, lessonPlans) => {
//   const lessonPlan = lessonPlans.find(l => l.recital === recital);

//   const { recitalBars } = lessonPlan;

//   return {
//     bars: parseInt(recitalBars, 10),
//     progress: [],
//   };
// };

const valueShouldNotOverlap = ({ value, from, to }) => {
  const overlaps = (from <= value && to >= value);
  return !overlaps;
};

const rangeShouldNotOverlap = ({
  from, to, otherFrom, otherTo,
}) => {
  if (from < otherFrom) {
    return to < otherFrom && to < otherTo;
  }

  if (to > otherTo) {
    return from > otherFrom && from > otherTo;
  }

  return false;
};

const areBarValuesProper = ({
  to, from, otherFrom, otherTo,
}) => {
  if (!to) return valueShouldNotOverlap({ value: from, from: otherFrom, to: otherTo });

  if (!from) return valueShouldNotOverlap({ value: to, from: otherFrom, to: otherTo });

  // check for range overlap
  return rangeShouldNotOverlap({
    to, from, otherFrom, otherTo,
  });
};

const checkIfFromIsLessThanTo = ({ from, to }) => {
  if (!from || !to) return true;

  return from < to;
};

const isValueWithinBarRange = (value, bars) => {
  if (value === null) return true;

  return value > 0 && value <= bars;
};

const valueIsProperForRecitalProgress = ({
  bars, progress, from, to, progressId,
}) => {
  // check if value is less than bars
  // const valueIsLessThanBars = from <= bars || to <= bars;

  const valueWithinBarRange = isValueWithinBarRange(from, bars) && isValueWithinBarRange(to, bars);

  const fromIsLessThanTo = checkIfFromIsLessThanTo({ from, to });

  let valueOverlapsExistingProgress = false;

  for (let i = 0; i < progress.length; i += 1) {
    const progressItem = progress[i];
    const { from: otherFrom, to: otherTo } = progressItem;
    const notSameProgressItem = progressItem.id !== progressId;

    if (notSameProgressItem && !areBarValuesProper({
      from, to, otherFrom, otherTo,
    })) {
      valueOverlapsExistingProgress = true;
      break;
    }
  }

  return valueWithinBarRange && fromIsLessThanTo && !valueOverlapsExistingProgress;
};

const BarProgress = ({
  bars, fromUpdated, toUpdated, from, to,
}) => (
  <div className="bar-progress">
    <div className="progress">
      <span>From:</span>
      <InputNumber onChange={fromUpdated} value={from} />
    </div>
    <div className="progress">
      <span>To:</span>
      <InputNumber onChange={toUpdated} value={to} />
    </div>
  </div>
);

BarProgress.propTypes = {
  bars: PropTypes.number.isRequired,
  fromUpdated: PropTypes.func,
  toUpdated: PropTypes.func,
  from: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  to: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

BarProgress.defaultProps = {
  fromUpdated: () => {},
  toUpdated: () => {},
  from: 0,
  to: 0,
};

class AddReflection extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    lessonPlans: PropTypes.arrayOf(PropTypes.shape({})),
    getGlobalReasons: PropTypes.func.isRequired,
    globalReasons: PropTypes.arrayOf(PropTypes.shape({})),
    dailyPlan: PropTypes.string,
    instrument: PropTypes.number,
    assistantTeachers: PropTypes.arrayOf(PropTypes.shape({})),
  }

  static defaultProps = {
    visible: false,
    onOk: () => {},
    onCancel: () => {},
    lessonPlans: [],
    globalReasons: null,
    dailyPlan: null,
    instrument: null,
    assistantTeachers: null,
  }

  state = getInitialState()

  componentWillReceiveProps(nextProps) {
    const {
      lessonPlans, visible, dailyPlan, instrument,
    } = nextProps;
    // console.log('got lesson plans to give reflection --> ', lessonPlans);
    const todoStatus = makeToDoMapper(lessonPlans);
    this.updateTodoStatus(todoStatus);

    const recitalProgress = makeRecitalProgressMapper(lessonPlans);
    this.setState({ recitalProgress, dailyPlan, instrument });

    if (!this.props.visible && visible) {
      this.props.getGlobalReasons();
    }
  }

  getCustomReasonField = () => (
    <TextArea placeholder="Tell us what happened?" onChange={this.customReasonChanged} value={this.state.reason} />
  )

  getGlobalReasonField = () => {
    const { reason } = this.state;
    const { globalReasons } = this.props;
    return (
      <Select
        placeholder="Choose a reason for Incompletion"
        value={reason}
        onChange={this.globalReasonChosen}
      >
        {
          globalReasons.map(r => <Option key={r.id}>{ r.title }</Option>)
        }
      </Select>
    );
  }

  getFooter = () => {
    const disabledSubmit = !this.canSubmitReflection();
    return (
      <div>
        <Button onClick={this.hideReflectionModal}>Cancel</Button>
        <Button type="primary" onClick={this.submitReflection} disabled={disabledSubmit}>Submit</Button>
      </div>
    );
  }

  canSubmitReflection = () => {
    const { allLessonsChecked, reason } = this.state;

    // If no reason provided when all lessons are not done, then user can't submit a reflection
    if (!allLessonsChecked && !reason) {
      return false;
    }

    return true;
  }

  customReasonChanged = e => this.setState({ reason: e.target.value })

  globalReasonChosen = reason => this.setState({ reason })

  askForInCompletionReason = () => {
    const { customReason } = this.state;
    const reasonField = customReason ? this.getCustomReasonField() : this.getGlobalReasonField();
    return (
      <div className="reason-area">
        <div className="field-title">Reason for Incompletion</div>
        <div className="reason-field">
          { reasonField }
          <Switch
            checked={customReason}
            onChange={this.toggleCustomReason}
            unCheckedChildren="Something else?"
            checkedChildren="My Reason"
          />
        </div>
      </div>
    );
  }

  checkForAllLessonsCompleteness = () => {
    const { todoStatus } = this.state;
    const completeValues = _.values(todoStatus);
    let allLessonsChecked = true;

    for (let i = 0; i < completeValues.length; i += 1) {
      const isComplete = completeValues[i];
      if (!isComplete) {
        allLessonsChecked = false;
        break;
      }
    }

    this.setState({ allLessonsChecked });
  }

  formReflectionPayload = () => {
    const {
      todoStatus,
      dailyPlan,
      customReason,
      reason,
      allLessonsChecked,
      comment,
      assistantTeachersSelected,
    } = this.state;

    const payload = {
      daily_plan: dailyPlan,
      comment,
      assistant_teachers: assistantTeachersSelected,
    };

    const todoIds = _.keys(todoStatus);

    payload.toDos = todoIds.filter(todo => todoStatus[todo] === true);

    if (!allLessonsChecked) {
      if (customReason) {
        payload.custom_reason = reason;
      } else {
        payload.global_reason = reason;
      }
    }

    payload.recital_progresses = this.formRecitalProgressPayload();

    return payload;
  }

  formRecitalProgressPayload = () => {
    const { recitalProgress, instrument } = this.state;
    const recitals = _.keys(recitalProgress);
    const recitalProgressPayload = [];

    recitals.forEach((recital) => {
      const progressItem = recitalProgress[recital];
      const { progress } = progressItem;
      progress.forEach((p) => {
        const { from, to } = p;

        if (from && to) {
          const recitalProgressInstance = {
            recital,
            instrument,
            from_bar: from,
            to_bar: to,
          };

          recitalProgressPayload.push(recitalProgressInstance);
        }
      });
    });

    return recitalProgressPayload;
  }

  submitReflection = () => {
    const reflectionPayload = this.formReflectionPayload();
    this.props.onOk(reflectionPayload);
    this.resetState();
  }

  hideReflectionModal = () => {
    this.props.onCancel();
    this.resetState();
  }

  resetState = () => this.setState(getInitialState())

  checkIfToDoChecked = (todoId) => {
    const { todoStatus } = this.state;
    return todoStatus[todoId];
  }

  toggleToDoStatus = ({ toDoId }) => {
    const { todoStatus } = this.state;

    const oldCompletionStatus = todoStatus[toDoId];
    const newCompletionStatus = !oldCompletionStatus;
    const newTodoStatus = {};
    newTodoStatus[toDoId] = newCompletionStatus;

    const updatedTodoStatus = {
      ...todoStatus,
      ...newTodoStatus,
    };
    this.updateTodoStatus(updatedTodoStatus);
  }

  toggleCustomReason = () => {
    const { customReason } = this.state;
    this.setState({ customReason: !customReason, reason: null });
  }

  updateTodoStatus = (todoStatus) => {
    this.setState({ todoStatus }, () => {
      this.checkForAllLessonsCompleteness();
    });
  }

  updateReason = reason => this.setState({ reason })

  updateProgressFromValue = ({ recital, progressId, value }) => {
    // console.log('update the FROM value for progress --> ', recital, progressId, value);
    const { recitalProgress } = this.state;
    const progressForTheRecital = recitalProgress[recital];
    const { progress, bars } = progressForTheRecital;

    const pos = progress.findIndex(p => p.id === progressId);

    if (pos > -1) {
      const progressItem = progress[pos];

      const { to } = progressItem;

      // Check if value is within limits
      if (!valueIsProperForRecitalProgress({
        bars, progress, from: value, to, progressId,
      })) {
        // console.log('this value is not proper--> ', value);
        return;
      }

      const newProgressItem = {
        ...progressItem,
        from: value,
      };

      const newProgressItems = [
        ...progress.slice(0, pos),
        newProgressItem,
        ...progress.slice(pos + 1),
      ];

      this.updateProgressForRecital({ newProgressItems, recital });
    }
  }

  updateProgressToValue = ({ recital, progressId, value }) => {
    // console.log('update the TO value for progress --> ', recital, progressId, value);
    const { recitalProgress } = this.state;
    const progressForTheRecital = recitalProgress[recital];
    const { progress, bars } = progressForTheRecital;

    const pos = progress.findIndex(p => p.id === progressId);

    if (pos > -1) {
      const progressItem = progress[pos];

      const { from } = progressItem;
      // Check if value is within limits
      if (!valueIsProperForRecitalProgress({
        bars, progress, from, to: value, progressId,
      })) {
        // console.log('this value is not proper--> ', value);
        return;
      }

      const newProgressItem = {
        ...progressItem,
        to: value,
      };

      const newProgressItems = [
        ...progress.slice(0, pos),
        newProgressItem,
        ...progress.slice(pos + 1),
      ];

      this.updateProgressForRecital({ newProgressItems, recital });
    }
  }

  showCommentField = () => (
    <div className="comment">
      <div className="field-title">Add more information</div>
      <TextArea
        placeholder="Comments.."
        value={this.state.comment}
        onChange={e => this.setState({ comment: e.target.value })}
      />
    </div>
  )

  addProgressForRecital = (recital) => {
    const { recitalProgress } = this.state;
    // const progressForRecital = (recitalProgress && recitalProgress[recital]) ||
    //   makeProgressObjectForRecital(recital, this.props.lessonPlans);
    const progressForRecital = recitalProgress[recital];

    const { progress: oldProgress } = progressForRecital;

    const newProgressId = oldProgress.length;
    const newProgressItem = {
      id: newProgressId,
      from: null,
      to: null,
    };

    const newProgressItems = [
      ...oldProgress,
      newProgressItem,
    ];

    this.updateProgressForRecital({ newProgressItems, recital });
  }

  updateProgressForRecital = ({ newProgressItems, recital }) => {
    const { recitalProgress } = this.state;
    const oldRecitalProgress = recitalProgress[recital];

    const newRecitalProgress = {
      ...oldRecitalProgress,
      progress: newProgressItems,
    };

    const updatedRecitalProgress = {};
    updatedRecitalProgress[recital] = newRecitalProgress;

    this.setState({ recitalProgress: updatedRecitalProgress });
  }

  renderLessonPlanAndBars = (lessonPlan) => {
    const { recital, recitalName, recitalBars } = lessonPlan;
    return (
      <div key={lessonPlan.id}>
        <LessonPlan
          lessonPlan={lessonPlan}
          markAsDone
          toggleToDoStatus={this.toggleToDoStatus}
          isToDoChecked={this.checkIfToDoChecked}
        />
        {
          this.renderProgressBars(recital)
        }
        <div className="add-progress">
          <span onClick={() => this.addProgressForRecital(recital)} role="presentation">
            <Icon type="plus-circle-o" /> Add Progress
          </span>
          <span>Total bars for <em>{recitalName}</em>: <strong>{ recitalBars }</strong></span>
        </div>
      </div>
    );
  }

  renderProgressBars = (recital) => {
    const { recitalProgress } = this.state;
    if (!recitalProgress || !recitalProgress[recital]) return '';

    const barProgress = recitalProgress[recital];
    const { progress, bars } = barProgress;
    return (
      progress.map(p => (
        <BarProgress
          key={p.id}
          progress={p}
          bars={bars}
          from={p.from}
          fromUpdated={value =>
            this.updateProgressFromValue({ recital, progressId: p.id, value })}
          to={p.to}
          toUpdated={value =>
            this.updateProgressToValue({ recital, progressId: p.id, value })}
        />
      ))
    );
  }

  selectedAssistantTeacher = (ids) => {
    console.log('selected assistant teachers --> ', ids);
    this.setState({ assistantTeachersSelected: ids });
  }

  renderAssistantTeacherSelection = () => {
    const { assistantTeachers } = this.props;

    if (!assistantTeachers || !assistantTeachers.length) return '';

    const columns = [
      {
        title: 'Name',
        dataIndex: 'teacherName',
      },
      {
        title: 'Instrument',
        dataIndex: 'instrumentTitle',
      },
    ];

    // Put each row key as teacher id
    const dataSource = assistantTeachers.map(a => ({ ...a, key: a.teacher }));

    const rowSelection = {
      onChange: this.selectedAssistantTeacher,
    };

    return (
      <Fragment>
        <div className="field-title">
          Select the Assistant Teachers for the class
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Fragment>
    );
  }

  render() {
    const { allLessonsChecked } = this.state;
    const {
      visible, lessonPlans,
    } = this.props;
    return (
      <Modal
        title="Add Reflection"
        visible={visible}
        // onOk={this.submitReflection}
        onCancel={this.hideReflectionModal}
        footer={this.getFooter()}
        className="add-reflection"
      >
        <div className="field-title">Mark lessons that were completed</div>
        {
          lessonPlans.map(lessonPlan => this.renderLessonPlanAndBars(lessonPlan))
        }
        {
          !allLessonsChecked && this.askForInCompletionReason()
        }
        {
          this.renderAssistantTeacherSelection()
        }
        {
          this.showCommentField()
        }
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { general } = state;
  const globalReasons = general.get('globalReasons');
  return {
    globalReasons,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getGlobalReasons: getGlobalReasonsAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddReflection);
