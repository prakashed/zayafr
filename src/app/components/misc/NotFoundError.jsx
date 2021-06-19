import React from 'react';
import PropTypes from 'prop-types';

const NotFoundError = ({ message }) => (
  <h1>{ message }</h1>
);

NotFoundError.propTypes = {
  message: PropTypes.string,
};

NotFoundError.defaultProps = {
  message: '404 Not found',
};

export default NotFoundError;
