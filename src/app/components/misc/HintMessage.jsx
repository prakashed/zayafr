import React from 'react';
import PropTypes from 'prop-types';

export default function HintMessage({ message }) {
  return (
    <span style={{ fontStyle: 'italic', color: 'lightgray' }}><sup>*</sup>{message}</span>
  );
}

HintMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
