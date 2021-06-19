import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddEditForm from '../core/AddEditForm';
import AddEditDailyPlan from './AddEditDailyPlan';
import { DETAILS_STORE, LIST_STORE } from '../../helpers/stateUtils';
import { getClassroomsListAction } from '../../reducers/classrooms';
import { getInstrumentsListAction } from '../../reducers/general';
import { getCreateNewAction, getUpdateAction, getDetailsAction, getDeleteToDoAction, getCreateNewToDoAction } from '../../reducers/daily-plans';
import { checkIfUserIsTeacher } from '../../helpers';

class AddEditDailyPlanContainer extends Component {
  static propTypes = {
    dailyPlan: PropTypes.shape({}),
    school: PropTypes.string.isRequired,
    createNewDailyPlan: PropTypes.func.isRequired,
    updateDailyPlan: PropTypes.func.isRequired,
    getClassrooms: PropTypes.func.isRequired,
    classrooms: PropTypes.arrayOf(PropTypes.shape({})),
    getInstruments: PropTypes.func.isRequired,
    instruments: ImmutablePropTypes.list,
    getDailyPlanDetails: PropTypes.func.isRequired,
    removeTodo: PropTypes.func.isRequired,
    createNewTodos: PropTypes.func.isRequired,
    userGroups: PropTypes.arrayOf(PropTypes.string).isRequired,
    username: PropTypes.string.isRequired,
    // removeCustomRecitalsFromStore: PropTypes.func.isRequired,
    // addCustomRecitalsInStore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dailyPlan: null,
    classrooms: null,
    instruments: null,
  };

  // We are editing when there is some Daily Plan is passed as prop
  // Reset the form when there is no Daily Plan to edit,
  // present a blank form to create a new Daily Plan
  state = {
    editing: !!this.props.dailyPlan,
    haveToResetForm: !this.props.dailyPlan,
    formResetCompleted: false,
  }

  componentWillMount() {
    const {
      school, getClassrooms, getInstruments, userGroups, username,
    } = this.props;
    const userIsTeacher = checkIfUserIsTeacher(userGroups);

    if (userIsTeacher) {
      getClassrooms({ school, teachers__user__username: username });
      getInstruments({ teachers__user__username: username });
    } else {
      getClassrooms({ school });
      getInstruments();
    }

    // getClassrooms({ school });
    // getInstruments();
  }

  componentWillReceiveProps(nextProps) {
    const { dailyPlan } = nextProps;

    if (dailyPlan && !dailyPlan.toDosDetails) {
      this.props.getDailyPlanDetails(dailyPlan.id);
    }

    if (!this.state.formResetCompleted) {
      this.setState({
        editing: !!dailyPlan,
        haveToResetForm: !dailyPlan,
      });
    }
  }

  resetFormDone = () => {
    this.setState({
      haveToResetForm: false,
      formResetCompleted: true,
    });
  }

  formSubmitted = (data) => {
    const { editing } = this.state;
    const {
      school, createNewDailyPlan, updateDailyPlan, createNewTodos,
    } = this.props;
    const payload = { ...data, school };
    if (editing) {
      updateDailyPlan(payload);

      const { toDos } = payload;
      const toDosPayload = toDos.map(todo => ({ ...todo, daily_plan: payload.id }));

      if (toDosPayload.length) {
        createNewTodos(toDosPayload);
      }
    } else {
      createNewDailyPlan(payload);
    }
  }

  render() {
    const { haveToResetForm, editing } = this.state;
    const {
      dailyPlan, classrooms, instruments,
    } = this.props;

    return (
      <AddEditForm
        component={AddEditDailyPlan}
        editing={editing}
        entityToEdit={dailyPlan}
        classrooms={classrooms}
        instruments={instruments}
        resetForm={haveToResetForm}
        onSubmit={this.formSubmitted}
        formResetted={this.resetFormDone}
        removeTodo={this.props.removeTodo}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    dailyPlans, auth, classrooms, general,
  } = state;
  const school = auth.get('school');
  const dailyPlanDetails = dailyPlans.get(DETAILS_STORE);
  const classroomList = classrooms.get(LIST_STORE);
  const instruments = general.get('instruments');
  const userGroups = auth.get('role');
  const username = auth.get('userName');

  const props = {
    school,
    classrooms: classroomList && classroomList.toIndexedSeq().toArray(),
    instruments,
    userGroups,
    username,
  };

  const { id } = ownProps.match.params;
  if (id) {
    const dailyPlan = dailyPlanDetails && dailyPlanDetails.get(id);

    return {
      ...props,
      dailyPlan,
    };
  }

  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createNewDailyPlan: getCreateNewAction,
    updateDailyPlan: getUpdateAction,
    getClassrooms: getClassroomsListAction,
    getInstruments: getInstrumentsListAction,
    getDailyPlanDetails: getDetailsAction,
    removeTodo: getDeleteToDoAction,
    createNewTodos: getCreateNewToDoAction,
    // removeCustomRecitalsFromStore: getCustomRecitalDeletedAction,
    // addCustomRecitalsInStore: getCustomRecitalAddedAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditDailyPlanContainer);
