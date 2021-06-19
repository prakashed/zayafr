import React from 'react';
import PropTypes from 'prop-types';

export default function LoadingMessage({ message, ...other }) {
  return (<div style={{ fontSize: '24px', fontWeight: 'bold' }} className="loading-message" {...other}>{ message }</div>);
}

LoadingMessage.propTypes = {
  message: PropTypes.string,
};

LoadingMessage.defaultProps = {
  message: 'Loading...',
};
