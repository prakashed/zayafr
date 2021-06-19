import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ViewOptions from '../misc/ViewOptions';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import routes from '../../constants/routes.json';

export default function ClusterDetails(props) {
  const { cluster } = props;

  if (_.isNull(cluster)) {
    return <p>Cluster Not Found</p>;
  }

  const {
    id,
    title,
    clusterManagerDetails: manager,
    schoolDetails,
  } = cluster;

  const {
    fullName, profileDetails, username, userDetails,
  } = manager;

  const { email } = userDetails;

  const dataTable = [
    {
      title: 'Cluster Manager',
      value: `${fullName} [${username}]`,
    },
    {
      title: 'Email',
      value: email || 'No Email Details',
    },
    {
      title: 'Phone',
      value: profileDetails ? profileDetails.contactNo : 'No Contact Details',
    },
    {
      title: 'Schools',
      value: (
        schoolDetails && schoolDetails.length ? <ul>{ schoolDetails.map((s, i) => <li key={i}>{s}</li>) }</ul> : 'No Schools'
      ),
    },
  ];

  const editUrl = `${routes.clusters}/${id}${routes.edit}`;

  return (
    <div className="cluster-details-view details-view">
      <div className="cluster-title title">
        <h1>{ title }</h1>
        <ViewOptions entity="cluster" editUrl={editUrl} deleteFunction={props.deleteCluster} />
      </div>
      <div className="cluster-details details">
        <ViewDetailsTable dataTable={dataTable} />
      </div>
    </div>
  );
}

ClusterDetails.propTypes = {
  cluster: PropTypes.shape({
    title: PropTypes.string,
    manager: PropTypes.shape({}),
  }),
  deleteCluster: PropTypes.func,
};

ClusterDetails.defaultProps = {
  cluster: null,
  deleteCluster: () => {},
};
