import React from 'react';
import PropTypes from 'prop-types';

import BoxContainer from './BoxContainer';

export default function ViewDetails(props) {
  return (
    <BoxContainer className="view-details">
      {
        props.children
      }
    </BoxContainer>
  );
}

ViewDetails.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
