import React from 'react';
import PropTypes from 'prop-types';

import BoxContainer from './BoxContainer';

export default function ViewDetailsContainer(props) {
  return (
    <BoxContainer className={`view-details-container ${props.hide ? 'hide' : 'show'}`}>
      {
        props.children
      }
    </BoxContainer>
  );
}

ViewDetailsContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  hide: PropTypes.bool,
};

ViewDetailsContainer.defaultProps = {
  hide: false,
};
