import React from 'react';
import PropTypes from 'prop-types';

import BoxContainer from './BoxContainer';

export default function ViewContainer(props) {
  return (
    <BoxContainer className={`view-container ${props.className}`}>
      {
        props.children
      }
    </BoxContainer>
  );
}

ViewContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
};

ViewContainer.defaultProps = {
  className: '',
};
