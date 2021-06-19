import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Route, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import routes from '../../constants/routes.json';

function AuthenticatedRoute({
  component: PrivateComponent,
  isLoggedIn,
  ...others
}) {
  return (
    <Route
      {...others}
      render={allProps =>
        isLoggedIn === true ? (
          <PrivateComponent {...allProps} />
        ) : (
          <Redirect
            to={{
              pathname: `${routes.login}`,
              state: { from: allProps.location }
            }}
          />
        )
      }
    />
  );
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  isLoggedIn: PropTypes.bool
};

AuthenticatedRoute.defaultProps = {
  isLoggedIn: false
};

function mapStateToProps(state) {
  return {
    isLoggedIn: _.isString(state.auth.get('token'))
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticatedRoute);
