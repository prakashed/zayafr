import React from 'react';
import PropTypes from 'prop-types';

const ClassroomsTitle = ({ classrooms }) => (
  <span>{ classrooms.map(c => `${c.grade} ${c.division}`).join(' | ') }</span>
);

ClassroomsTitle.propTypes = {
  classrooms: PropTypes.arrayOf(PropTypes.shape({
    grade: PropTypes.string,
    division: PropTypes.string,
  })),
};

ClassroomsTitle.defaultProps = {
  classrooms: [],
};

export default ClassroomsTitle;
