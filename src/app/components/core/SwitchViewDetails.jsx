import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import routes from '../../constants/routes.json';

export default function SwitchViewDetails({ routeSubdomain, AddEditComponent, DetailsComponent }) {
  return (
    <Switch>
      <Route exact path={`${routeSubdomain}${routes.new}`} component={AddEditComponent} />
      <Route exact path={`${routeSubdomain}/:id${routes.edit}`} component={AddEditComponent} />
      <Route path={`${routeSubdomain}/:id`} component={DetailsComponent} />
    </Switch>
  );
}

SwitchViewDetails.propTypes = {
  routeSubdomain: PropTypes.string.isRequired,
  AddEditComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  DetailsComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
};
