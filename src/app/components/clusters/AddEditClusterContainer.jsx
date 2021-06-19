import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddEditCluster from './AddEditCluster';
import { createClusterAction, updateClusterAction } from '../../reducers/clusters';
// import { getUserListAction } from '../../reducers/people';

class AddEditClusterContainer extends Component {
  static propTypes = {
    createCluster: PropTypes.func.isRequired,
    updateCluster: PropTypes.func.isRequired,
    cluster: PropTypes.shape({}),
    // getUserList: PropTypes.func.isRequired,
    // users: ImmutablePropTypes.map,
  };

  static defaultProps = {
    cluster: null,
    // users: null,
  };

  // We are editing when there is some cluster is passed as prop
  // Reset the form when there is no cluster to edit,
  // present a blank form to create a new cluster
  state = {
    editing: !!this.props.cluster,
    haveToResetForm: !this.props.cluster,
  }

  // componentWillMount() {
  //   this.props.getUserList();
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editing: !!nextProps.cluster,
      haveToResetForm: !nextProps.cluster,
    });
  }

  resetFormDone() {
    this.setState({
      haveToResetForm: false,
    });
  }

  clusterFormSubmitted(cluster) {
    const { createCluster, updateCluster } = this.props;

    if (this.state.editing) {
      updateCluster(cluster);
    } else {
      createCluster(cluster);
    }
  }

  render() {
    const {
      cluster: clusterToEdit,
    } = this.props;

    const { haveToResetForm } = this.state;

    return (<AddEditCluster
      onSubmit={clusterSubmitted => this.clusterFormSubmitted(clusterSubmitted)}
      clusterToEdit={clusterToEdit}
      editingCluster={!!clusterToEdit}
      resetForm={haveToResetForm}
      formResetted={() => this.resetFormDone()}
      // users={users}
    />);
  }
}

function mapStateToProps(state, ownProps) {
  const { clusters } = state;
  // const { clusterMap } = clusters;
  const clusterDetails = clusters.get('details');
  const { clusterId } = ownProps.match.params;
  // const { users } = people;

  const props = {
    // users,
  };

  if (clusterId) {
    const cluster = clusterDetails && clusterDetails.get(clusterId);

    return {
      ...props,
      cluster,
    };
  }

  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createCluster: createClusterAction,
    updateCluster: updateClusterAction,
    // getUserList: getUserListAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditClusterContainer);
