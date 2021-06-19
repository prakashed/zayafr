import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../routes/PrivateRoute';
import CoreLayout from '../core/CoreLayout';
import LoginContainer from '../login/LoginContainer';
import ConductClassContainer from '../conduct-class/ConductClassContainer';
import ConductTheoryClassContainer from '../conduct-class/ConductTheoryClassContainer';
import routes from '../../constants/routes.json';
import Register from '../login/Register';

export default function FullLayout() {
  return (
    <Switch>
      <Route path={routes.register} component={Register} />
      <Route path={routes.login} component={LoginContainer} />
      <PrivateRoute
        path={`${routes.conductRecitalClass}/:recitalProgressId`}
        component={ConductClassContainer}
      />
      <PrivateRoute
        path={`${routes.conductTheoryClass}/:theoryProgressId`}
        component={ConductTheoryClassContainer}
      />
      <PrivateRoute path="/" component={CoreLayout} />
    </Switch>
  );
}
