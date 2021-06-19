import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserDetails from './UserDetails';

function UserDetailsContainer(props) {
  const { user } = props;

  return (
    <UserDetails user={user} />
  );
}

UserDetailsContainer.propTypes = {
  user: PropTypes.shape({}),
};

UserDetailsContainer.defaultProps = {
  user: null,
};

function mapStateToProps(state, ownProps) {
  const { userId } = ownProps.match.params;
  const { users } = state;
  const otherUsers = users.get('others');
  const user = otherUsers.find(u => u.id === parseInt(userId, 10));

  return {
    user,
  };
}

export default connect(mapStateToProps)(UserDetailsContainer);
