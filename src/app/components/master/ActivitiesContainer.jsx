import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route } from 'react-router-dom';
import { List } from 'antd';

import routes from '../../constants/routes.json';
import ActivityDetailsContainer from './ActivityDetailsContainer';
import AddEditActivityContainer from './AddEditActivityContainer';
import {
  getActivitiesAction,
  getSearchActivitiesAction
} from '../../reducers/activities';
import LoadingMessage from '../misc/LoadingMessage';
import permissionConfig from '../../constants/permission-config.json';
import SearchBar from '../misc/SearchBar';

import './Activities.less';
import BackButton from '../misc/BackButton';
import AddNewEntity from '../core/AddNewEntity';

const { entity: permissionEntity } = permissionConfig;

function Activity({ activity, setActive, activeItemId }) {
  const { id, title, description } = activity;

  return (
    <List.Item
      className={`activity-item view-list-item ${
        activeItemId === `${id}` ? 'active' : ''
      }`}
      onClick={() => setActive(id)}
    >
      <span className="activity-name item-title">{title}</span>
      {/* <div className="activity-details item-details">
        <div className="description">{ description }</div>
      </div> */}
    </List.Item>
  );
}

Activity.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string
  }).isRequired,
  activeItemId: PropTypes.string,
  setActive: PropTypes.func
};

Activity.defaultProps = {
  activeItemId: null,
  setActive: () => {}
};

class ActivitiesContainer extends Component {
  state = {
    activeItemId: null
  };

  componentWillMount() {
    this.props.getActivities();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;
    this.setState({
      activeItemId: id
    });
  }

  setActive = itemId => {
    const url = `${routes.activities}/${itemId}`;
    this.props.history.push(url);
    // this.setState({
    //   activeItemId: itemId,
    // });
  };

  search = text => {
    if (!text || !text.length) {
      this.props.getActivities();
    } else {
      this.props.searchActivities({ search: text });
    }
  };

  render() {
    const newItemLink = `${routes.activities}${routes.new}`;
    const { activities } = this.props;
    const { activeItemId } = this.state;

    return (
      <div className="view-container">
        <div className="action-buttons">
          <AddNewEntity
            entityType={permissionEntity.activity}
            linkToAdd={newItemLink}
            hide={!!activeItemId}
          />
          <BackButton link={routes.activities} hide={!activeItemId} />
        </div>
        <div className="view-search-filters">
          <div className="view-search">
            <SearchBar
              onSearch={this.search}
              placeholder="Search Activities.."
            />
          </div>
        </div>
        <div className="view-details">
          <div
            className={`view-details-list ${activeItemId ? 'hide' : 'show'}`}
          >
            <div className="view-list-container activities-list-container">
              {_.isNull(activities) ? (
                <LoadingMessage message="Fetching Activities..." />
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={activities.toIndexedSeq().toArray()}
                  renderItem={activity => (
                    <Activity
                      activity={activity}
                      activeItemId={activeItemId}
                      setActive={this.setActive}
                    />
                  )}
                />
              )}
            </div>
          </div>
          <div
            className={`view-details-container ${
              activeItemId ? 'show' : 'hide'
            }`}
          >
            <Switch>
              <Route
                exact
                path={`${routes.activities}${routes.new}`}
                component={AddEditActivityContainer}
              />
              <Route
                exact
                path={`${routes.activities}/:id${routes.edit}`}
                component={AddEditActivityContainer}
              />
              <Route
                path={`${routes.activities}/:id`}
                component={ActivityDetailsContainer}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

ActivitiesContainer.propTypes = {
  activities: ImmutablePropTypes.map,
  getActivities: PropTypes.func.isRequired,
  searchActivities: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({})
  }).isRequired
};

ActivitiesContainer.defaultProps = {
  activities: null
};

function mapStateToProps(state) {
  const { activities } = state;
  const activitiesList = activities.get('list');
  return {
    activities: activitiesList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getActivities: getActivitiesAction,
      searchActivities: getSearchActivitiesAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivitiesContainer);
