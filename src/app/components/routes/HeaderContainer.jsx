import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Popover, Avatar, Button, Breadcrumb, Icon } from 'antd';

import {
  requestLogout
  // resetSchoolAction,
} from '../../reducers/auth';
import routes from '../../constants/routes.json';
import './Header.less';
import { LIST_STORE, DETAILS_STORE } from '../../helpers/stateUtils';
import { toggleSidebarAction } from '../../reducers/general';

function getRouteName(route) {
  switch (route) {
    case routes.root:
      return 'Home';
    case routes.schools:
      return 'Schools';
    case routes.classrooms:
      return 'Classrooms';
    case routes.clusters:
      return 'Clusters';
    case routes.users:
      return 'Users';
    case routes.teachers:
      return 'Teachers';
    case routes.planning:
      return 'Planning';
    case routes.annual_plans:
      return 'Annual Plans';
    case routes.view_annual_plan:
      return 'Annual Plans';
    case routes.daily_plans:
      return 'Daily Plans';
    case routes.books:
      return 'Books';
    case routes.activities:
      return 'Activities and Fundamentals';
    case routes.recitals:
      return 'Recitals';
    case routes.curriculums:
      return 'Curriculums';
    case routes.dashboard:
      return 'Dashboard';
    case routes.session:
      return 'My Sessions';
    case routes.recitalReflectionAdd:
      return 'Add Recital Reflection';
    case routes.recitalReflectionView:
      return 'View Recital Reflection';
    case routes.theoryReflectionAdd:
      return 'Add Theory Reflection';
    case routes.theoryReflectionView:
      return 'View Theory Reflection';
    default:
      return '';
  }
}

function getUrlBreadcrumbs(url, title, includeTitleInBreadcrumb) {
  const urlTokens = url.split('/');
  const breadCrumbs = urlTokens.map(urlToken => {
    const route = `/${urlToken}`;
    const routeName = getRouteName(route);
    if (routeName) {
      return (
        <Breadcrumb.Item key={urlToken}>
          <Link to={route}>{routeName}</Link>
        </Breadcrumb.Item>
      );
    } else if (
      route === routes.new ||
      route === routes.new_recital ||
      route === routes.new_theory
    ) {
      return <Breadcrumb.Item key={urlToken}>New</Breadcrumb.Item>;
    } else if (route === routes.edit) {
      return <Breadcrumb.Item key={urlToken}>Edit</Breadcrumb.Item>;
    } else if (route === routes.view) {
      return <Breadcrumb.Item key={urlToken}>View</Breadcrumb.Item>;
    } else if (includeTitleInBreadcrumb) {
      return <Breadcrumb.Item key={title}>{`${title}`}</Breadcrumb.Item>;
    }

    return <Breadcrumb.Item key={urlToken} />;
  });

  return breadCrumbs;
}

function Header(props) {
  const {
    title,
    logout,
    userName,
    school,
    includeSchool,
    includeTitleInBreadcrumb,
    toggleSidebar
  } = props;

  const accountMenu = (
    <div className="account-menu">
      <div className="section">
        <div className="profile">
          <Avatar className="pic" size="large" icon="user" />
          <h2>{userName}</h2>
        </div>
        <Button
          type="secondary"
          className="logout"
          onClick={() => {
            logout();
          }}
        >
          Sign out
        </Button>
      </div>
      {/* <div className="section">
        <div className="school">
          <div style={{ fontSize: '16px' }}>
            Logged Into <span style={{ fontStyle: 'italic' }}>{ schoolName }</span>
          </div>
        </div>
        <Link to={routes.select_school}>
          <span style={{ whiteSpace: 'nowrap' }} role="presentation" onClick={() => resetSchool()}>
            Change School
          </span>
        </Link>
      </div> */}
    </div>
  );

  return (
    <div className="view-header">
      <div
        className="menu-btn"
        onClick={() => toggleSidebar()}
        role="presentation"
      >
        <Icon type="menu-unfold" />
      </div>
      <div className="title-container">
        <h1 className="title">
          {includeSchool && school ? `${school.title} - ` : ''}
          {title}
        </h1>
        <Breadcrumb>
          {getUrlBreadcrumbs(
            props.location.pathname,
            title,
            includeTitleInBreadcrumb
          )}
        </Breadcrumb>
      </div>
      <div className="account-popup">
        <Popover placement="bottomRight" content={accountMenu} trigger="click">
          <Avatar className="user" size="large" icon="user" />
          <div className="username">
            {userName} <Icon type="caret-down" />
          </div>
        </Popover>
      </div>
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  logout: PropTypes.func.isRequired,
  userName: PropTypes.string,
  school: PropTypes.shape({}),
  includeSchool: PropTypes.bool,
  includeTitleInBreadcrumb: PropTypes.bool,
  toggleSidebar: PropTypes.func.isRequired
};

Header.defaultProps = {
  userName: 'Default User',
  school: null,
  includeSchool: false,
  includeTitleInBreadcrumb: false
};

function mapStateToProps(state, ownProps) {
  function idIsValid(id) {
    return id && id.length && id !== 'new';
  }

  function getHeaderTitle({ title, id, entity }) {
    let headerTitle = `${title}`;

    if (idIsValid(id)) {
      switch (entity) {
        case 'School':
          {
            const { schools } = state;
            const schoolList = schools.get(DETAILS_STORE);
            const schoolDetails = schoolList && schoolList.get(id);
            if (schoolDetails) {
              headerTitle = schoolDetails.name;
            } else {
              headerTitle = '...';
            }
          }
          break;
        case 'Activity':
          {
            const { activities } = state;
            const activityList = activities.get(DETAILS_STORE);
            const activityDetails = activityList && activityList.get(id);
            if (activityDetails) {
              const { title: activityTitle } = activityDetails;
              headerTitle = activityTitle;
            } else {
              headerTitle = '...';
            }
          }
          break;
        case 'Curriculum':
          {
            const { curriculums } = state;
            const curriculumList = curriculums.get(DETAILS_STORE);
            const curriculumDetails = curriculumList && curriculumList.get(id);
            if (curriculumDetails) {
              const { title: curriculumTitle } = curriculumDetails;
              headerTitle = curriculumTitle;
            } else {
              headerTitle = 'Curriculum';
            }
          }
          break;
        case 'Dashboard': {
          headerTitle = 'Dashboard';
        }
        case 'My Sessions': {
          headerTitle = 'My Sessions';
        }
        default:
      }
    }

    return headerTitle;
  }

  const { auth, schools } = state;
  const currentSchoolId = auth.get('school');
  const userName = auth.get('userName');

  const schoolList = schools.get(LIST_STORE);
  const school =
    schoolList && currentSchoolId && schoolList.get(currentSchoolId);

  const { id } = ownProps.match.params;
  const { entity, title } = ownProps;

  const headerTitle = getHeaderTitle({ id, entity, title });

  return {
    school,
    userName,
    // override the title prop with value from state
    title: headerTitle,
    includeTitleInBreadcrumb: idIsValid(id)
  };

  // const { annualLessonPlans, auth } = state;
  // const annualLessonPlan = annualLessonPlanId && annualLessonPlans.get(annualLessonPlanId);
  // const schoolName = auth.get('schoolName');
  // const userName = auth.get('userName');

  // const title = annualLessonPlan ? annualLessonPlan.title : 'No Title';

  // return {
  //   title,
  //   schoolName,
  //   userName,
  // };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: requestLogout,
      // resetSchool: resetSchoolAction,
      toggleSidebar: toggleSidebarAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
