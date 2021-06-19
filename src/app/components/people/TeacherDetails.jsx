import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon } from 'antd';

export default function TeacherDetails(props) {
  const { teacher } = props;

  if (_.isNull(teacher)) {
    return <p>Teacher Not Found</p>;
  }

  const {
    name, email, contact, schools, instruments,
  } = teacher;

  const dataTable = [
    {
      title: 'Email',
      value: email,
    },
    {
      title: 'Username',
      value: 'Some User Name',
    },
    {
      title: 'Phone Number',
      value: contact,
    },
    {
      title: 'Schools',
      value: schools.join(', '),
    },
    {
      title: 'Instruments',
      value: instruments.join(', '),
    },
  ];

  return (
    <div className="teacher-details-view details-view">
      <div className="teacher-title title">
        <h1>{ name }</h1>
        <Icon type="edit" />
      </div>
      {/* <div className="profile-pic" /> */}
      <div className="teacher-details details">
        {
          dataTable.map(data => (
            <div key={data.title} className="detail-row">
              <div className="title">{ data.title }</div>
              <div className="data">{ data.value }</div>
            </div>
          ))
        }
        {/* <div className="title">
          <h3>Email</h3>
          <h3>Phone number</h3>
          <h3>Schools</h3>
          <h3>Instruments</h3>
        </div>
        <div className="data">
          <div>{ email }</div>
          <div>{ contact }</div>
          <div>{ schools.join(', ') }</div>
          <div>{ instruments.join(', ') }</div>
        </div> */}
      </div>
    </div>
  );
}

TeacherDetails.propTypes = {
  teacher: PropTypes.shape({
    name: PropTypes.string,
  }),
};

TeacherDetails.defaultProps = {
  teacher: null,
};
