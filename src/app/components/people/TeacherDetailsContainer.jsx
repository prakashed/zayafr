import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TeacherDetails from './TeacherDetails';

function TeacherDetailsContainer(props) {
  const { teacher } = props;

  return (
    <TeacherDetails teacher={teacher} />
  );
}

TeacherDetailsContainer.propTypes = {
  teacher: PropTypes.shape({}),
};

TeacherDetailsContainer.defaultProps = {
  teacher: null,
};

function mapStateToProps(state, ownProps) {
  const { teacherId } = ownProps.match.params;
  const { users } = state;
  const teachers = users.get('teachers');
  const teacher = teachers.get(teacherId);

  return {
    teacher,
  };
}

export default connect(mapStateToProps)(TeacherDetailsContainer);
