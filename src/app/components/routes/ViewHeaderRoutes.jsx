import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import Header from './HeaderContainer';
import routes from '../../constants/routes.json';
import './ViewHeaderRoutes.less';

function HeaderRoute({ component: HeaderComponent, title, ...others }) {
  return (
    <Route
      {...others}
      render={allProps => {
        const componentProps = { ...allProps, ...others };
        return <HeaderComponent title={title} {...componentProps} />;
      }}
    />
  );
}

HeaderRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  title: PropTypes.string
};

HeaderRoute.defaultProps = {
  title: null
};

export default function ViewHeaderRoutes() {
  return (
    <Switch>
      <HeaderRoute
        path={`${routes.schools}/:id?`}
        component={Header}
        title="Schools"
        entity="School"
      />
      <HeaderRoute
        path={`${routes.activities}/:id?`}
        component={Header}
        entity="Activity"
        title="Activities and Fundamentals"
      />

      <HeaderRoute
        path={`${routes.curriculums}/:id?`}
        component={Header}
        entity="Curriculum"
        title="Curriculums"
      />
      <HeaderRoute
        path={`${routes.dashboard}/`}
        component={Header}
        entity="Dashboard"
        title="Dashboard"
      />
      <HeaderRoute
        path={`${routes.mySchedule}/`}
        component={Header}
        entity="My Schedule"
        title="My Schedule"
      />
      <HeaderRoute
        path={`${routes.session}/`}
        component={Header}
        entity="My Sessions"
        title="My Sessions"
      />
      <HeaderRoute
        path={`${routes.recitalReflectionAdd}/:id`}
        component={Header}
        entity="Add Recital Reflection"
        title="Add Recital Reflection"
      />
      <HeaderRoute
        path={`${routes.recitalReflectionView}/:id`}
        component={Header}
        entity="View Recital Reflection"
        title="View Recital Reflection"
      />
      <HeaderRoute
        path={`${routes.theoryReflectionAdd}/:id`}
        component={Header}
        entity="Add Theory Reflection"
        title="Add Theory Reflection"
      />

      <HeaderRoute
        path={`${routes.theoryReflectionView}/:id`}
        component={Header}
        entity="View Theory Reflection"
        title="View Theory Reflection"
      />
    </Switch>
  );
}
