import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon, Tree, Tooltip, Collapse, Button } from 'antd';

import ViewDetailsTable from '../misc/ViewDetailsTable';
import ViewOptions from '../misc/ViewOptions';
import routes from '../../constants/routes.json';
import AnnualPlans from './AnnualPlans';
import './School.less';

import Can from '../permissions/Can';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity } = permissionConfig;
const { action: permissionAction } = permissionConfig;
const Panel = Collapse.Panel;

export default function SchoolDetails(props) {
  const { school, showAddEditAnnualPlan } = props;

  if (_.isNull(school)) {
    return <p>Not found</p>;
  }

  const {
    name,
    establishedYear,
    teacherNames,
    annualPlanDetails,
    classroomDetails
  } = school;

  const dataTable = [
    {
      title: 'Name',
      value: _.capitalize(name)
    },
    {
      title: 'Established Year',
      value: establishedYear
    },
    {
      title: 'Total Teachers',
      value: teacherNames.length
    },
    {
      title: 'Teachers',
      value: teacherNames.length ? (
        <ul>
          {teacherNames.map((teacherName, index) => (
            <li key={index}>{teacherName}</li>
          ))}
        </ul>
      ) : (
        'No teachers assigned.'
      )
    },
    {
      title: 'Classes',
      value: classroomDetails.length ? (
        <ul>
          {classroomDetails.map(classroom => (
            <li key={classroom.id}>{classroom.title}</li>
          ))}
        </ul>
      ) : (
        'No classes added.'
      )
    },

    {
      title: 'Annual Plans',
      value: ''
    }
  ];

  return (
    <div className="school-details-view details-view">
      <div className="school-title title">
        <h1>{name}</h1>
      </div>
      <div className="school-details details">
        <ViewDetailsTable dataTable={dataTable} />
      </div>
      <Can I={permissionAction.add} a={permissionEntity.annualPlans}>
        <Button
          type="secondary"
          icon="plus-circle-o"
          size="small"
          onClick={() => showAddEditAnnualPlan()}
        >
          Add Annual Plan
        </Button>

        <br />
        <br />
      </Can>
      <AnnualPlans
        annualPlanDetails={annualPlanDetails}
        showAddEditAnnualPlan={annualPlan => showAddEditAnnualPlan(annualPlan)}
      />
    </div>
  );
}

SchoolDetails.propTypes = {
  school: PropTypes.shape({}),
  showAddEditAnnualPlan: PropTypes.func
};

SchoolDetails.defaultProps = {
  school: null,
  showAddEditAnnualPlan: () => {}
};
