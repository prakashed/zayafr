import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import ActivityDetails from './ActivityDetails';
import { deleteActivityAction } from '../../reducers/activities';
import routes from '../../constants/routes.json';
import { DETAILS_STORE } from '../../helpers/stateUtils';
import NotFoundError from '../misc/NotFoundError';

class ActivityDetailsContainer extends Component {
  static propTypes = {
    activity: PropTypes.shape({}),
    activityNotFound: PropTypes.bool,
    deleteActivity: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  static defaultProps = {
    activity: null,
    activityNotFound: false,
  }

  state = {
    showDeleteModal: false,
  }

  showConfirmDeleteModal() {
    this.setState({
      showDeleteModal: true,
    });
  }

  hideConfirmDeleteModal() {
    this.setState({
      showDeleteModal: false,
    });
  }

  deleteTheActivity(id) {
    this.props.history.push(routes.activities);
    this.props.deleteActivity(id);
  }

  render() {
    const { activity, activityNotFound } = this.props;

    if (activityNotFound) return <NotFoundError message="Activity Not Found" />;

    if (_.isNull(activity)) {
      return <p>Activity not found</p>;
    }

    return (
      <Fragment>
        <ActivityDetails activity={activity} deleteActivity={() => this.showConfirmDeleteModal()} />
        <Modal
          title={`Delete ${activity.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteTheActivity(activity.id)}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>
            Do you want to delete this activity?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { id } = ownProps.match.params;
  const { activities } = state;

  const activityList = activities.get(DETAILS_STORE);
  const activity = activityList && activityList.get(id);
  const activityNotFound = activityList && !activity;

  return {
    activity,
    activityNotFound,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteActivity: deleteActivityAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetailsContainer);
