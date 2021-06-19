import React from 'react';
import PropTypes from 'prop-types';

import BoxContainer from './BoxContainer';

export default function ViewDetailsList(props) {
  return (
    <BoxContainer className={`view-details-list ${props.hide ? 'hide' : 'show'}`}>
      {
        props.children
      }
    </BoxContainer>
  );
}

ViewDetailsList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  hide: PropTypes.bool,
};

ViewDetailsList.defaultProps = {
  hide: false,
};
