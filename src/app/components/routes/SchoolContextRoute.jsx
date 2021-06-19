import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { notification } from 'antd';

import PrivateRoute from './PrivateRoute';
import routes from '../../constants/routes.json';
import { LIST_STORE } from '../../helpers/stateUtils';
import { getSchoolListAction } from '../../reducers/schools';

function SchoolContextRoute(props) {
  const { currentSelectedSchoolId, school, getSchools } = props;

  if (_.isNull(currentSelectedSchoolId)) {
    notification.warning({
      message: 'Set Current School!',
      description: 'Please choose a school from the list as your current school first.',
    });

    return <Redirect to={{ pathname: `${routes.schools}` }} />;
  }

  if (_.isNull(school)) {
    getSchools();
  }

  const allProps = {
    ...props,
    school,
  };
  return <PrivateRoute {...allProps} />;
}

SchoolContextRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  currentSelectedSchoolId: PropTypes.string,
  school: PropTypes.shape({}),
  getSchools: PropTypes.func.isRequired,
};

SchoolContextRoute.defaultProps = {
  currentSelectedSchoolId: null,
  school: null,
};

function mapStateToProps(state) {
  const { auth, schools } = state;
  const schoolList = schools.get(LIST_STORE);
  const currentSelectedSchoolId = auth.get('school');
  const school = currentSelectedSchoolId
     && schoolList && schoolList.get(currentSelectedSchoolId);

  return {
    currentSelectedSchoolId,
    school,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getSchools: getSchoolListAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SchoolContextRoute);
