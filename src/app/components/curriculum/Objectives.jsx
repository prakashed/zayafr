import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Button, Collapse, Card, Icon, Anchor } from 'antd';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';

import { deleteObjectiveAction } from '../../reducers/objectives';

import Activities from './Acivities';
import './CurriculumCommon.less';

import Can from '../permissions/Can';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity } = permissionConfig;
const { action: permissionAction } = permissionConfig;
const Panel = Collapse.Panel;

class Objectives extends Component {
  constructor(props) {
    super(props);
  }

  deleteObjective(objectiveId, recitalId) {
    this.props.deleteObjective({ id: objectiveId, recital: recitalId });
    // this.props.getCurriculumDetails(recitalId)
  }

  getExtra(objective) {
    return (
      <div>
        <Can I={permissionAction.add} a={permissionEntity.curriculum}>
          <Icon
            type="edit"
            onClick={event => {
              event.stopPropagation();
              this.props.showAddEditObjective(objective);
            }}
          />
          <Icon
            type="delete"
            onClick={event => {
              event.stopPropagation();
              this.deleteObjective(objective.id, objective.recital);
            }}
          />
        </Can>
      </div>
    );
  }

  render() {
    const { objectivesDetails } = this.props;

    if (_.isEmpty(objectivesDetails)) {
      return <span>No objectives added.</span>;
    }

    return (
      <Collapse accordion>
        {objectivesDetails.map(objective => (
          <Panel
            header={objective.title}
            key={objective.id}
            extra={this.getExtra(objective)}
          >
            {/* <div className="lesson-details">
              <b>Objective: </b> {objective.title}
            </div> */}
            <div className="lesson-details">
              <b>Class flow: </b> {objective.classFlow}
            </div>
            <div className="lesson-details">
              <b>Duration: </b> {objective.durationInMinutes} mins.
            </div>
            <div className="lesson-details">
              <b>Reference: </b> {objective.reference}
            </div>
            <div className="lesson-details">
              <b>Activities: </b>
              <Activities activitiesDetails={objective.activitiesDetails} />
            </div>
            <div className="lesson-details">
              <b>Videos: </b>
              {objective.objectiveVideosDetails.length ? (
                objective.objectiveVideosDetails.map(video => (
                  <div key={video.id}>
                    <ReactPlayer
                      pip
                      width="100%"
                      height="300px"
                      url={video.url}
                    />
                    <br />
                  </div>
                ))
              ) : (
                <span>No videos added.</span>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deleteObjective: deleteObjectiveAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Objectives);
