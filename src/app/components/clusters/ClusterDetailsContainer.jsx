import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import ClusterDetails from './ClusterDetails';
import { getClusterDetailsAction, deleteClusterAction } from '../../reducers/clusters';
import routes from '../../constants/routes.json';
import LoadingMessage from '../misc/LoadingMessage';
import { ERROR_STORE } from '../../helpers/stateUtils';
import NotFoundError from '../misc/NotFoundError';
import { is404Error } from '../../helpers';

class ClusterDetailsContainer extends Component {
  static propTypes = {
    cluster: PropTypes.shape({
      id: PropTypes.string,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        clusterId: PropTypes.string.isRequired,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    getClusterDetails: PropTypes.func.isRequired,
    deleteCluster: PropTypes.func.isRequired,
    clusterNotFound: PropTypes.bool,
  }

  static defaultProps = {
    cluster: null,
    clusterNotFound: false,
  }

  state = {
    showDeleteModal: false,
  }

  componentDidMount() {
    const { clusterId } = this.props.match.params;
    if (clusterId) {
      this.props.getClusterDetails(clusterId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { cluster } = nextProps;
    const { clusterId } = nextProps.match.params;
    if ((!cluster && clusterId)) {
      this.props.getClusterDetails(clusterId);
    }
  }

  deleteCluster() {
    this.hideConfirmDeleteModal();
    this.props.deleteCluster(this.props.cluster.id);

    const listingUrl = `${routes.clusters}`;
    this.props.history.push(listingUrl);
  }

  showConfirmDeleteModal() {
    this.setState({
      showDeleteModal: true,
    });
  }

  hideConfirmDeleteModal() {
    this.setState({
      showDeleteModal: false,
    });
  }

  render() {
    const { cluster, clusterNotFound } = this.props;

    if (clusterNotFound) return <NotFoundError message="Cluster not found" />;

    if (!cluster) {
      return (<LoadingMessage message="Fetching Cluster.." />);
    }

    return (
      <Fragment>
        <ClusterDetails
          cluster={cluster}
          deleteCluster={() => this.showConfirmDeleteModal()}
        />
        <Modal
          title={`Delete ${cluster.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteCluster()}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>
            Do you want to delete this cluster?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { clusterId } = ownProps.match.params;
  const { clusters } = state;
  // const { clusterMap } = clusters;
  const clusterDetails = clusters.get('details');

  const cluster = clusterDetails && clusterDetails.get(clusterId);
  const clusterNotFound = clusterDetails && !cluster;

  return {
    cluster,
    clusterNotFound,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getClusterDetails: getClusterDetailsAction,
    deleteCluster: deleteClusterAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetailsContainer);
