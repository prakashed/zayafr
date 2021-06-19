import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List } from 'antd';

import ClusterDetailsContainer from './ClusterDetailsContainer';
import routes from '../../constants/routes.json';
import AddEditClusterContainer from './AddEditClusterContainer';
import { getClusterListAction, getClustersSearchAction } from '../../reducers/clusters';
import LoadingMessage from '../misc/LoadingMessage';
import permissionConfig from '../../constants/permission-config.json';
import SearchBar from '../misc/SearchBar';
import BackButton from '../misc/BackButton';
import AddNewEntity from '../core/AddNewEntity';

const { entity: permissionEntity } = permissionConfig;

function ClusterItem({ cluster, setActive, activeItemId }) {
  const {
    id, title, clusterManagerDetails: manager,
  } = cluster;

  const {
    fullName, userDetails, profileDetails,
  } = manager;

  const { email } = userDetails;

  return (
    <List.Item className={`cluster-item view-list-item ${activeItemId === id ? 'active' : ''}`} onClick={() => setActive(id)}>
      <h2 className="cluster-name item-title">{ title }</h2>
      <div className="cluster-details item-details">
        <span>{ fullName }</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <span>{ profileDetails && profileDetails.contactNo }</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <span>{ email }</span>
      </div>
    </List.Item>
  );
}

ClusterItem.propTypes = {
  cluster: PropTypes.shape({
    title: PropTypes.string,
    manager: PropTypes.shape({}),
  }).isRequired,
  activeItemId: PropTypes.string,
  setActive: PropTypes.func,
};

ClusterItem.defaultProps = {
  activeItemId: null,
  setActive: () => {},
};

class ClusterViewContainer extends React.Component {
  static propTypes = {
    clusters: ImmutablePropTypes.map,
    getClusterList: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  static defaultProps = {
    clusters: null,
  }

  state = {
    activeItemId: null,
  }

  componentDidMount() {
    this.props.getClusterList();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;
    this.setState({
      activeItemId: id,
    });
  }

  setActive = (itemId) => {
    const url = `${routes.clusters}/${itemId}`;
    this.props.history.push(url);
  }

  searchForClusters = (searchText) => {
    if (!searchText || !searchText.length) {
      this.props.getClusterList();
    } else {
      this.props.searchClusters({ search: searchText });
    }
  }

  render() {
    const { clusters } = this.props;
    const { activeItemId } = this.state;

    const newItemLink = `${routes.clusters}${routes.new}`;

    if (_.isNull(clusters)) {
      return <LoadingMessage message="Fetching Clusters..." />;
    }

    return (
      <div className="view-container">
        <div className="action-buttons">
          <AddNewEntity
            entityType={permissionEntity.cluster}
            linkToAdd={newItemLink}
            hide={!!activeItemId}
          />
          <BackButton link={routes.clusters} hide={!activeItemId} />
        </div>
        <div className="view-details">
          <div className={`view-details-list ${activeItemId ? 'hide' : 'show'}`}>
            <div className="view-search">
              <SearchBar onSearch={this.searchForClusters} placeholder="Search Clusters.." />
            </div>
            <div className="view-list-container">
              {
                _.isNull(clusters) ?
                  <p>No Clusters - Get started by clicking on Add</p>
                : <List
                  itemLayout="horizontal"
                  dataSource={clusters.toIndexedSeq().toArray()}
                  renderItem={cluster => (<ClusterItem
                    cluster={cluster}
                    activeItemId={activeItemId}
                    setActive={this.setActive}
                  />)}
                />
              }
            </div>
          </div>

          <div className={`view-details-container ${activeItemId ? 'show' : 'hide'}`}>
            <Switch>
              <Route exact path={`${routes.clusters}${routes.new}`} component={AddEditClusterContainer} />
              <Route exact path={`${routes.clusters}/:clusterId${routes.edit}`} component={AddEditClusterContainer} />
              <Route path={`${routes.clusters}/:clusterId`} component={ClusterDetailsContainer} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

ClusterViewContainer.propTypes = {
  clusters: ImmutablePropTypes.map,
  getClusterList: PropTypes.func.isRequired,
  searchClusters: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
    }),
  }).isRequired,
};

ClusterViewContainer.defaultProps = {
  clusters: null,
};

function mapStateToProps(state) {
  const { clusters } = state;
  const clusterList = clusters.get('list');
  return {
    clusters: clusterList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getClusterList: getClusterListAction,
    searchClusters: getClustersSearchAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterViewContainer);
