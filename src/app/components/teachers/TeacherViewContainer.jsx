import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Avatar, List, Tag, Input } from 'antd';

import TeacherDetailsContainer from './TeacherDetailsContainer';
import AddTeacher from './AddTeacher';
import routes from '../../constants/routes.json';
import './Teacher.less';

const { Search } = Input;

function Teacher({ teacher }) {
  const {
    name, schools, instruments,
  } = teacher;

  return (
    <List.Item className="teacher-item view-list-item">
      <List.Item.Meta
        className="teacher-meta"
        avatar={<Avatar className="user" size="large" icon="user" />}
      />
      <Link key={teacher.id} to={`${routes.teachers}/${teacher.id}`}>
        <h2 className="teacher-name">{ name }</h2>
      </Link>
      <p>{schools}</p>
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
};

function TeacherViewContainer(props) {
  const { teachers } = props;

  return (
    <div className="view-container">
      <div className="action-buttons">
        {/* <Link to={`${routes.teachers}${routes.new}`}><Button type="primary">Add</Button></Link> */}
        <Button disabled type="primary">Add</Button>
        <Button disabled type="primary">Add teachers in bulk</Button>
      </div>
      <div className="view-details">
        <div className="view-details-list">
          <div className="view-search">
            <Search placeholder="Search" />
          </div>
          <div className="view-list-container">
            {
            _.isNull(teachers) ?
              <p>No Teachers added - Get started by clicking on Add</p>
            : <List
              itemLayout="horizontal"
              dataSource={teachers.toIndexedSeq().toArray()}
              renderItem={teacher => <Teacher teacher={teacher} />}
            />
          }
          </div>
        </div>
        <div className="view-details-container">
          <Switch>
            <Route exact path={`${routes.teachers}${routes.new}`} component={AddTeacher} />
            <Route path={`${routes.teachers}/:teacherId`} component={TeacherDetailsContainer} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

TeacherViewContainer.propTypes = {
  teachers: ImmutablePropTypes.map,
};

TeacherViewContainer.defaultProps = {
  teachers: null,
};

function mapStateToProps(state) {
  return {
    teachers: state.teachers,
  };
}

export default connect(mapStateToProps)(TeacherViewContainer);
