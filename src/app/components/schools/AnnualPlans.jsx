import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon, Tree, Tooltip, Collapse, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { deleteAnnualPlanAction } from '../../reducers/annual-plans';
// import { getCurriculumsDetailsAction } from '../../reducers/curriculums';

import Can from '../permissions/Can';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity } = permissionConfig;
const { action: permissionAction } = permissionConfig;
const Panel = Collapse.Panel;
const { confirm } = Modal;

function listItems(array, emptyMessage = ' Not found') {
  console.log(array);
  return !array.length ? (
    emptyMessage
  ) : (
    <ul>
      {array.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

class AnnualPlans extends Component {
  constructor(props) {
    super(props);
  }

  deleteAnnualPlan(annualPlanId, schoolId) {
    this.props.deleteAnnualPlan({ id: annualPlanId, school: schoolId });
  }

  showConfirm(self, annualPlanId, annualPlanSchool) {
    confirm({
      title: 'Are you sure you want to delete?',
      content:
        'All related sessions, progresses and reflections will be deleted.',
      onOk() {
        self.deleteAnnualPlan(annualPlanId, annualPlanSchool);
      },
      onCancel() {}
    });
  }

  getExtra(annualPlan) {
    return (
      <div>
        <Can I={permissionAction.add} a={permissionEntity.annualPlans}>
          <Icon
            type="delete"
            onClick={event => {
              event.stopPropagation();
              this.showConfirm(this, annualPlan.id, annualPlan.school);
            }}
          />
        </Can>
      </div>
    );
  }

  render() {
    const { annualPlanDetails } = this.props;

    if (_.isEmpty(annualPlanDetails)) {
      return <p>No annual plans added yet.</p>;
    }

    return (
      <Collapse accordion>
        {annualPlanDetails.map(annualPlan => (
          <Panel
            key={annualPlan.id}
            header={annualPlan.title}
            extra={this.getExtra(annualPlan)}
          >
            <div className="theory-details">
              <b>Title:</b> {annualPlan.title}
            </div>
            <div className="theory-details">
              <b>From Date:</b>{' '}
              {moment(annualPlan.fromDate).format('DD-MM-YYYY')}
            </div>
            <div className="theory-details">
              <b>To Date:</b> {moment(annualPlan.toDate).format('DD-MM-YYYY')}
            </div>
            <br />

            <div className="theory-details">
              <b>Classes:</b>
              {listItems(annualPlan.classroomTitles)}
            </div>
            <div className="theory-details">
              <b>Recital-Instrument:</b>
              {listItems(annualPlan.customRecitalTitles)}
            </div>
            <div className="theory-details">
              <b>Theories</b>:{listItems(annualPlan.theoryTitles)}
            </div>
          </Panel>
        ))}
      </Collapse>
    );
  }
}

AnnualPlans.defaultProps = {
  annualPlanDetails: null
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deleteAnnualPlan: deleteAnnualPlanAction
      // getCurriculumDetails: getCurriculumsDetailsAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(AnnualPlans);
