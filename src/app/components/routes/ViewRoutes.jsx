import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import SchoolContextRoute from './SchoolContextRoute';
import UserViewContainer from '../people/UserViewContainer';
import routes from '../../constants/routes.json';
import DynamicImport from '../core/DynamicImport';

const Loading = () => <h1>Loading..</h1>;

const CurriculumsContainer = props => (
  <DynamicImport load={() => import('../curriculum/CurriculumsContainer')}>
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

const ActivitiesContainer = props => (
  <DynamicImport load={() => import('../master/ActivitiesContainer')}>
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

const SchoolContainer = props => (
  <DynamicImport load={() => import('../schools/SchoolContainer')}>
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

const Dashboard = props => (
  <DynamicImport load={() => import('../dashboard/Dashboard')}>
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

const MySchedule = props => (
  <DynamicImport load={() => import('../my-schedule/MySchedule')}>
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

const SessionContainer = props => (
  <DynamicImport load={() => import('../my-schedule/SessionContainer')}>
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

const RecitalReflectionContainer = props => (
  <DynamicImport
    load={() => import('../my-schedule/RecitalReflectionContainer')}
  >
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

const TheoryReflectionContainer = props => (
  <DynamicImport
    load={() => import('../my-schedule/TheoryReflectionContainer')}
  >
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

export default function ViewRoutes() {
  return (
    <Switch>
      <Redirect exact from="/" to={routes.dashboard} />
      <PrivateRoute
        path={`${routes.curriculums}/:id?`}
        component={CurriculumsContainer}
      />
      <PrivateRoute
        path={`${routes.activities}/:id?`}
        component={ActivitiesContainer}
      />
      <PrivateRoute
        path={`${routes.schools}/:id?`}
        component={SchoolContainer}
      />
      <PrivateRoute path={`${routes.dashboard}`} component={Dashboard} />
      <PrivateRoute path={`${routes.mySchedule}`} component={MySchedule} />
      <PrivateRoute path={`${routes.session}`} component={SessionContainer} />
      <PrivateRoute
        path={`${routes.recitalReflectionAdd}/:id?`}
        component={RecitalReflectionContainer}
      />
      <PrivateRoute
        path={`${routes.recitalReflectionView}/:id?`}
        component={RecitalReflectionContainer}
      />

      <PrivateRoute
        path={`${routes.theoryReflectionAdd}/:id?`}
        component={TheoryReflectionContainer}
      />
      <PrivateRoute
        path={`${routes.theoryReflectionView}/:id?`}
        component={TheoryReflectionContainer}
      />
    </Switch>
  );
}
