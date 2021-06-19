import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Tag } from 'antd';

import ViewOptions from '../misc/ViewOptions';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import { getClassroomNames } from '../../helpers';
import routes from '../../constants/routes.json';
import HintMessage from '../misc/HintMessage';
import './AnnualPlanDetails.less';

export default function AnnualPlanDetails(props) {
  const { annualPlan } = props;

  if (_.isNull(annualPlan)) {
    return <p>Annual Plan Not Found</p>;
  }

  const {
    id,
    title,
    classroomDetails,
    recitalDetails,
    timeUnitDetails
  } = annualPlan;

  const editUrl = `${routes.annual_plans}/${id}${routes.edit}`;

  const canViewAnnualPlan =
    recitalDetails &&
    recitalDetails.length &&
    timeUnitDetails &&
    timeUnitDetails.length;

  const recitalData =
    recitalDetails && recitalDetails.length ? (
      <ul>
        {recitalDetails.map(r => (
          <li key={r.id} style={{ marginBottom: '6px' }}>
            <span className="data-title">{r.title}</span>
            {r.instrumentDetails.map(i => (
              <Tag key={i.id} color={i.color}>
                {i.title}
              </Tag>
            ))}
          </li>
        ))}
      </ul>
    ) : (
      <p>No Recitals Added</p>
    );

  const timeUnitData =
    timeUnitDetails && timeUnitDetails.length ? (
      <ul>
        {timeUnitDetails.map(q => (
          <li key={q.id} style={{ marginBottom: '6px' }}>
            <span className="data-title">{q.title}</span>
            <span style={{ fontStyle: 'italic' }}>
              {q.fromDate}&nbsp;-&nbsp;
            </span>
            <span style={{ fontStyle: 'italic' }}>{q.toDate}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p>No Quarters added</p>
    );

  const dataTable = [
    {
      title: 'Class',
      value: getClassroomNames(classroomDetails)
    },
    {
      title: 'Recitals',
      value: recitalData
    },
    {
      title: 'Quarters',
      value: timeUnitData
    }
  ];

  return (
    <div className="annual-plan-details-view details-view">
      <div className="annual-plan-title title">
        <h1>{title}</h1>
        <ViewOptions
          entity="annualPlans"
          editUrl={editUrl}
          deleteFunction={props.deleteAnnualPlan}
        />
      </div>
      <div className="annual-plan-details details">
        <ViewDetailsTable dataTable={dataTable} />
        {canViewAnnualPlan ? (
          <Link to={`${routes.view_annual_plan}/${id}`}>
            <Button style={{ width: '100%' }} type="primary">
              View Annual Plan
            </Button>
          </Link>
        ) : (
          <HintMessage message="Add recitals and quarters to view the Annual Plan; Click on the dropdown to Edit the annual plan" />
        )}
      </div>
    </div>
  );
}

AnnualPlanDetails.propTypes = {
  annualPlan: PropTypes.shape({
    title: PropTypes.string
  }),
  deleteAnnualPlan: PropTypes.func
};

AnnualPlanDetails.defaultProps = {
  annualPlan: null,
  deleteAnnualPlan: () => {}
};
