import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function Can(props) {
  const { permissions, I, a } = props;
  // eg. 'add_recital'
  let permissionGranted = false;

  if (I === null || a === null) {
    permissionGranted = true;
  } else {
    const permissionToCheck = `${I}_${a}`;
    permissionGranted = permissions.has(permissionToCheck);
  }

  if (permissionGranted) {
    return (<Fragment>{ props.children }</Fragment>);
  }
  return (null);
}

Can.propTypes = {
  permissions: PropTypes.objectOf(PropTypes.object).isRequired,
  children: PropTypes.element.isRequired,
  I: PropTypes.string,
  a: PropTypes.string,
};

Can.defaultProps = {
  I: null,
  a: null,
};

function mapStateToProps(state) {
  const { auth } = state;
  const permissions = auth.get('permissionsData');
  return {
    permissions,
  };
}

export default connect(mapStateToProps)(Can);
