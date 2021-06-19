import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import { DETAILS_STORE, ERROR_STORE } from '../../helpers/stateUtils';
import ClassroomDetails from './ClassroomDetails';
import { getClassroomDetailsAction, deleteClassroomAction } from '../../reducers/classrooms';
import routes from '../../constants/routes.json';
import LoadingMessage from '../misc/LoadingMessage';
import { is404Error } from '../../helpers';
import NotFoundError from '../misc/NotFoundError';

class ClassroomDetailsContainer extends Component {
  static propTypes = {
    classroom: PropTypes.shape({
      id: PropTypes.string,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    getClassroomDetails: PropTypes.func.isRequired,
    deleteClassroom: PropTypes.func.isRequired,
    errorInStore: PropTypes.shape({}),
  }

  static defaultProps = {
    classroom: null,
    errorInStore: null,
  }

  state = {
    showDeleteModal: false,
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { errorInStore } = this.props;
    if (!errorInStore && id) {
      this.props.getClassroomDetails(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { classroom } = nextProps;
    const { id: classroomId } = nextProps.match.params;
    const { id: oldId } = this.props.match.params;
    if (!classroom && oldId !== classroomId) {
      this.props.getClassroomDetails(classroomId);
    }
  }

  deleteClassroom() {
    this.hideConfirmDeleteModal();
    this.props.deleteClassroom(this.props.classroom.id);

    const listingUrl = `${routes.classrooms}`;
    this.props.history.push(listingUrl);
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

  render() {
    const { classroom, errorInStore } = this.props;

    if (!classroom && is404Error(errorInStore)) return <NotFoundError message="Classroom not found" />;

    if (!classroom) {
      return (<LoadingMessage message="Fetching Classroom.." />);
    }

    return (
      <Fragment>
        <ClassroomDetails
          classroom={classroom}
          deleteClassroom={() => this.showConfirmDeleteModal()}
        />
        <Modal
          title={`Delete ${classroom.gradeDetails.title} - ${classroom.divisionDetails.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteClassroom()}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>
            Do you want to delete this classroom?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { id: classroomId } = ownProps.match.params;
  const { classrooms } = state;
  const classroomDetails = classrooms.get(DETAILS_STORE);
  const errorInStore = classrooms.get(ERROR_STORE);

  const classroom = classroomDetails && classroomDetails.get(classroomId);

  return {
    classroom,
    errorInStore,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getClassroomDetails: getClassroomDetailsAction,
    deleteClassroom: deleteClassroomAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassroomDetailsContainer);
