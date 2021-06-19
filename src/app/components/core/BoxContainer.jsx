import React from 'react';
import PropTypes from 'prop-types';

export default function BoxContainer(props) {
  return (
    <div {...props}>
      {
        props.children
      }
    </div>
  );
}

BoxContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
