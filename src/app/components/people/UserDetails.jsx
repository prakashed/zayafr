import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon } from 'antd';

import ViewDetailsTable from '../misc/ViewDetailsTable';

export default function UserDetails(props) {
  const { user } = props;

  if (_.isNull(user)) {
    return <p>User Not Found</p>;
  }

  const {
    name, email, contact, username,
  } = user;

  const dataTable = [
    {
      title: 'Email',
      value: email,
    },
    {
      title: 'Username',
      value: username,
    },
    {
      title: 'Phone Number',
      value: contact,
    },
  ];

  return (
    <div className="user-details-view details-view">
      <div className="user-title title">
        <h1>{ name }</h1>
        <Icon type="edit" />
      </div>
      {/* <div className="profile-pic" /> */}
      <div className="user-details details">
        <ViewDetailsTable dataTable={dataTable} />
      </div>
    </div>
  );
}

UserDetails.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

UserDetails.defaultProps = {
  user: null,
};
