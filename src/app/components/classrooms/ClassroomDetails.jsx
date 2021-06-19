import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ViewOptions from '../misc/ViewOptions';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import routes from '../../constants/routes.json';
import { TEACHER_TYPES } from '../../constants/config';
import AssignedTeachersTable from './AssignedTeachersTable';

export default function ClassroomDetails(props) {
  const { classroom } = props;

  if (_.isNull(classroom)) {
    return <p>Classroom Not Found</p>;
  }

  const {
    id,
    gradeDetails,
    divisionDetails,
    classroomTeachers,
    classStrength,
  } = classroom;

  const { title: gradeTitle } = gradeDetails;
  const { title: divisionTitle } = divisionDetails;

  const teachersAssigned = classroomTeachers.map((teacherObj) => {
    const {
      id: key, teacherName, instrumentTitle, type,
    } = teacherObj;
    const typeObj = TEACHER_TYPES.find(t => t.id === type);
    const { title: typeTitle } = typeObj;
    return {
      key,
      teacherName,
      instrumentName: instrumentTitle || 'None',
      type: typeTitle,
    };
  });

  const columns = [{
    title: 'Name',
    dataIndex: 'teacherName',
  }, {
    title: 'Type',
    dataIndex: 'type',
  }, {
    title: 'Instrument',
    dataIndex: 'instrumentName',
  }];

  const dataTable = [
    {
      title: 'Class Strength',
      value: classStrength,
    },
  ];

  const editUrl = `${routes.classrooms}/${id}${routes.edit}`;

  return (
    <div className="classroom-details-view details-view">
      <div className="classroom-title title">
        <h1>{ gradeTitle } - { divisionTitle }</h1>
        <ViewOptions entity="classroom" editUrl={editUrl} deleteFunction={props.deleteClassroom} />
      </div>
      <div className="classroom-details details">
        <ViewDetailsTable dataTable={dataTable} />
        { teachersAssigned.length ? <AssignedTeachersTable
          teachers={teachersAssigned}
          columns={columns}
        /> : <i>No Teachers Assigned</i>}
      </div>
    </div>
  );
}

ClassroomDetails.propTypes = {
  classroom: PropTypes.shape({
    gradeDetails: PropTypes.shape({}),
    divisionDetails: PropTypes.shape({}),
    teacherDetails: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  deleteClassroom: PropTypes.func,
};

ClassroomDetails.defaultProps = {
  classroom: null,
  deleteClassroom: () => {},
};
