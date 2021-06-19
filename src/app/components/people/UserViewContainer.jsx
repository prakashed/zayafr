import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Avatar, List, Tag, Input, Select } from 'antd';

import AddNewItem from '../misc/AddNewItem';
import TeacherDetailsContainer from './TeacherDetailsContainer';
import UserDetailsContainer from './UserDetailsContainer';
import AddUser from './AddUser';
import routes from '../../constants/routes.json';
import './User.less';

const { Search } = Input;
const { Option } = Select;

function Teacher({ teacher, setActive, activeItemId }) {
  const {
    id, name, schools, instruments,
  } = teacher;

  return (
    <List.Item className={`user-item view-list-item teacher ${activeItemId === id ? 'active' : ''}`} onClick={() => setActive(id)}>
      <List.Item.Meta
        className="user-meta"
        avatar={<Avatar className="user" size="large" icon="user" />}
      />
      <h2 className="user-name item-title">{ name }</h2>
      <p className="item-details">{schools}</p>
      <div>{instruments.map(instrument => <Tag key={instrument} color="lime">{ instrument }</Tag>)}</div>
    </List.Item>
  );
}

Teacher.propTypes = {
  teacher: PropTypes.shape({
    name: PropTypes.string,
    schools: PropTypes.array,
    instruments: PropTypes.array,
  }).isRequired,
  activeItemId: PropTypes.number,
  setActive: PropTypes.func,
};

Teacher.defaultProps = {
  activeItemId: null,
  setActive: () => {},
};

function User({ user, setActive, activeItemId }) {
  const {
    id, name, email, contact,
  } = user;

  return (
    <List.Item className={`user-item view-list-item user ${activeItemId === id ? 'active' : ''}`} onClick={() => setActive(id)}>
      <List.Item.Meta
        className="user-meta"
        avatar={<Avatar className="user" size="large" icon="user" />}
      />
      <h2 className="user-name item-title">{ name }</h2>
      <p className="item-details">{email}</p>
      <span>{contact}</span>
    </List.Item>
  );
}

User.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    contact: PropTypes.string,
  }).isRequired,
  activeItemId: PropTypes.number,
  setActive: PropTypes.func,
};

User.defaultProps = {
  activeItemId: null,
  setActive: () => {},
};

class UserViewContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'teachers',
      activeItemId: null,
    };
  }

  setActive = (itemId) => {
    const { activeFilter } = this.state;

    const url = `${routes.users}/${activeFilter === 'teachers' ? 'teacher' : 'user'}/${itemId}`;
    this.props.history.push(url);
    this.setState({
      activeItemId: itemId,
    });
  }

  getTeacherList() {
    const { teachers } = this.props;
    const { activeItemId } = this.state;

    const teacherList = _.isNull(teachers) ?
      <p>No Teachers added - Get started by clicking on Add</p>
      : (<List
        itemLayout="horizontal"
        dataSource={teachers.toIndexedSeq().toArray()}
        renderItem={teacher =>
          (<Teacher
            teacher={teacher}
            activeItemId={activeItemId}
            setActive={this.setActive}
          />)}
      />);

    return teacherList;
  }

  getSuperAdminList() {
    const { users } = this.props;

    const superadmins = users.filter(user => user.role === 'superadmin');

    const superAdminList = _.isNull(superadmins) ?
      <p>No Superadmins added - Get started by clicking on Add</p>
      : this.formUserList(superadmins);

    return superAdminList;
  }

  getAsqList() {
    const { users } = this.props;

    const asqUsers = users.filter(user => user.role === 'asq');

    const asqList = _.isNull(asqUsers) ?
      <p>No Superadmins added - Get started by clicking on Add</p>
      : this.formUserList(asqUsers);

    return asqList;
  }

  getRenderList() {
    const { activeFilter } = this.state;

    switch (activeFilter) {
      case 'teachers':
        return this.getTeacherList();

      case 'superadmins':
        return this.getSuperAdminList();

      case 'asq':
        return this.getAsqList();

      default:
        return this.getTeacherList();
    }
  }

  formUserList(users) {
    const { activeItemId } = this.state;

    return (
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={user =>
          (<User
            user={user}
            activeItemId={activeItemId}
            setActive={this.setActive}
          />)}
      />
    );
  }

  render() {
    const { activeFilter } = this.state;
    const newItemLink = `${routes.users}${routes.new}`;

    return (
      <div className="view-container">
        <div className="action-buttons">
          <AddNewItem link={newItemLink} />
        </div>
        <div className="view-details">
          <div className="view-details-list">
            <div className="view-search-filters">
              <div className="view-search">
                <Search placeholder="Search" />
              </div>
              <div className="view-filters">
                <Select
                  defaultValue={activeFilter}
                  onChange={value => this.setState({ activeFilter: value })}
                >
                  <Option value="teachers">Teachers</Option>
                  <Option value="superadmins">Admins</Option>
                  <Option value="asq">ASQ</Option>
                </Select>
              </div>
            </div>
            <div className="view-list-container">
              {
                this.getRenderList()
              }
            </div>
          </div>
          <div className="view-details-container">
            <Switch>
              <Route exact path={`${routes.users}${routes.new}`} component={AddUser} />
              <Route path={`${routes.users}/teacher/:teacherId`} component={TeacherDetailsContainer} />
              <Route path={`${routes.users}/user/:userId`} component={UserDetailsContainer} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

UserViewContainer.propTypes = {
  users: ImmutablePropTypes.map,
  teachers: ImmutablePropTypes.map,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

UserViewContainer.defaultProps = {
  users: null,
  teachers: null,
};

function mapStateToProps(state) {
  const { people } = state;
  const { users, teachers } = people;

  return {
    users,
    teachers,
  };
}

export default connect(mapStateToProps)(UserViewContainer);
