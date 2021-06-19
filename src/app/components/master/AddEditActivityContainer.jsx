import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddEditActivity from './AddEditActivity';
import { createActivityAction, updateActivityAction } from '../../reducers/activities';
import { DETAILS_STORE } from '../../helpers/stateUtils';
import AddEditForm from '../core/AddEditForm';

class AddEditActivityContainer extends React.Component {
  static propTypes = {
    createActivity: PropTypes.func.isRequired,
    updateActivity: PropTypes.func.isRequired,
    activity: PropTypes.shape({}),
  };

  static defaultProps = {
    activity: null,
  };

  // We are editing when there is some activity is passed as prop
  // Reset the form when there is no activity to edit,
  // present a blank form to create a new activity
  state = {
    editing: !!this.props.activity,
    haveToResetForm: !this.props.activity,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editing: !!nextProps.activity,
      haveToResetForm: !nextProps.activity,
    });
  }

  resetFormDone = () => {
    this.setState({
      haveToResetForm: false,
    });
  }

  formSubmitted = (activity) => {
    const { createActivity, updateActivity } = this.props;

    if (this.state.editing) {
      updateActivity(activity);
    } else {
      createActivity(activity);
    }
  }

  render() {
    const {
      activity: activityToEdit,
    } = this.props;

    const { haveToResetForm, editing } = this.state;

    return (
      <AddEditForm
        component={AddEditActivity}
        editing={editing}
        entityToEdit={activityToEdit}
        resetForm={haveToResetForm}
        onSubmit={this.formSubmitted}
        formResetted={this.resetFormDone}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { activities } = state;

  const { id } = ownProps.match.params;
  const activityList = activities.get(DETAILS_STORE);
  const activity = activityList && activityList.get(id);
  return {
    activity,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createActivity: createActivityAction,
    updateActivity: updateActivityAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditActivityContainer);
