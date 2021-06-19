import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Route, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import routes from '../../constants/routes.json';

function PrivateRoute({
  component: PrivateComponent,
  isLoggedIn,
  // schoolSelected,
  ...others
}) {
  return (
    <Route
      {...others}
      render={(allProps) => {
          // Select School Flow
          // if (isLoggedIn && schoolSelected) {
          //   return <PrivateComponent {...allProps} />;
          // } else if (isLoggedIn) {
          //   return <Redirect to={{
          //   pathname: `${routes.select_school}`, state: { from: allProps.location } }} />;
          // }

          // return <Redirect to={{
          //  pathname: `${routes.login}`, state: { from: allProps.location } }} />;
          const componentProps = { ...allProps, ...others };
          if (isLoggedIn) {
            return <PrivateComponent {...componentProps} />;
          }

          return <Redirect to={{ pathname: `${routes.login}`, state: { from: allProps.location } }} />;

          // (isLoggedIn === true
          // ? <PrivateComponent {...allProps} />
          // : <Redirect to={{
          //   pathname: `${routes.login}`, state: { from: allProps.location } }} />);
        }}
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  isLoggedIn: PropTypes.bool,
  // schoolSelected: PropTypes.bool,
};

PrivateRoute.defaultProps = {
  isLoggedIn: false,
  // schoolSelected: false,
};


function mapStateToProps(state) {
  return {
    isLoggedIn: _.isString(state.auth.get('token')),
    // schoolSelected: _.isString(state.auth.get('school')),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
