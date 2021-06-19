import React from 'react';
import PropTypes from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddEditForm from '../core/AddEditForm';
import AddEditAnnualPlan from './AddEditAnnualPlan';
import { getCreateNewAction, getUpdateAction, getCustomRecitalDeletedAction, getCustomRecitalAddedAction } from '../../reducers/annual-plans';
import { getClassroomsListAction } from '../../reducers/classrooms';
import { DETAILS_STORE, LIST_STORE } from '../../helpers/stateUtils';
import { addTimeUnit, updateTimeUnit, removeTimeUnit, removeCustomRecital } from '../../apis/annual-lesson-plan-api';

class AddEditAnnualPlanContainer extends React.Component {
  static propTypes = {
    annualPlan: PropTypes.shape({}),
    school: PropTypes.string.isRequired,
    createNewAnnualPlan: PropTypes.func.isRequired,
    updateAnnualPlan: PropTypes.func.isRequired,
    getClassrooms: PropTypes.func.isRequired,
    classrooms: PropTypes.arrayOf(PropTypes.shape({})),
    removeCustomRecitalsFromStore: PropTypes.func.isRequired,
    addCustomRecitalsInStore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    annualPlan: null,
    classrooms: null,
  };

  // We are editing when there is some Annual Plan is passed as prop
  // Reset the form when there is no Annual Plan to edit,
  // present a blank form to create a new Annual Plan
  state = {
    editing: !!this.props.annualPlan,
    haveToResetForm: !this.props.annualPlan,
  }

  componentWillMount() {
    const {
      school, getClassrooms,
    } = this.props;
    getClassrooms({ school });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editing: !!nextProps.annualPlan,
      haveToResetForm: !nextProps.annualPlan,
    });
  }

  resetFormDone = () => {
    this.setState({
      haveToResetForm: false,
    });
  }

  formSubmitted = (data) => {
    const { editing } = this.state;
    const { school, createNewAnnualPlan, updateAnnualPlan } = this.props;
    const payload = { ...data, school };
    if (editing) {
      updateAnnualPlan(payload);
    } else {
      createNewAnnualPlan(payload);
    }
  }

  render() {
    const { haveToResetForm, editing } = this.state;
    const {
      annualPlan, classrooms, removeCustomRecitalsFromStore, addCustomRecitalsInStore,
    } = this.props;

    return (
      <AddEditForm
        component={AddEditAnnualPlan}
        editing={editing}
        entityToEdit={annualPlan}
        classrooms={classrooms}
        resetForm={haveToResetForm}
        onSubmit={this.formSubmitted}
        formResetted={this.resetFormDone}
        createQuarter={addTimeUnit}
        updateQuarter={updateTimeUnit}
        deleteQuarter={removeTimeUnit}
        deleteCustomRecital={removeCustomRecital}
        removeCustomRecitalsFromStore={removeCustomRecitalsFromStore}
        addCustomRecitalsInStore={addCustomRecitalsInStore}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    annualLessonPlans, auth, classrooms,
  } = state;
  const school = auth.get('school');
  const annualPlanDetails = annualLessonPlans.get(DETAILS_STORE);
  const classroomList = classrooms.get(LIST_STORE);

  const props = {
    school,
    classrooms: classroomList && classroomList.toIndexedSeq().toArray(),
  };

  const { id } = ownProps.match.params;
  if (id) {
    const annualPlan = annualPlanDetails && annualPlanDetails.get(id);

    return {
      ...props,
      annualPlan,
    };
  }

  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createNewAnnualPlan: getCreateNewAction,
    updateAnnualPlan: getUpdateAction,
    getClassrooms: getClassroomsListAction,
    removeCustomRecitalsFromStore: getCustomRecitalDeletedAction,
    addCustomRecitalsInStore: getCustomRecitalAddedAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditAnnualPlanContainer);
