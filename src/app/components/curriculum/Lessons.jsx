import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Button, Collapse, Card, Icon, Anchor } from 'antd';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';

import { deleteLessonAction } from '../../reducers/lessons';
import { getCurriculumsDetailsAction } from '../../reducers/curriculums';

import Activities from './Acivities';
import Objectives from './Objectives';

import './CurriculumCommon.less';

import Can from '../permissions/Can';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity } = permissionConfig;
const { action: permissionAction } = permissionConfig;
const Panel = Collapse.Panel;
class Lessons extends Component {
  constructor(props) {
    super(props);
  }

  deleteLesson(lessonId, recitalId) {
    this.props.deleteLesson({ id: lessonId, recital: recitalId });
    // this.props.getCurriculumDetails(recitalId)
  }

  getExtra(lesson) {
    return (
      <div>
        <Can I={permissionAction.add} a={permissionEntity.curriculum}>
          <Icon
            type="edit"
            onClick={event => {
              event.stopPropagation();
              this.props.showAddEditLesson(lesson);
            }}
          />
          <Icon
            type="delete"
            onClick={event => {
              event.stopPropagation();
              this.deleteLesson(lesson.id, lesson.recital);
            }}
          />
        </Can>
      </div>
    );
  }

  render() {
    const { lessonsDetails, showAddEditObjective } = this.props;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    if (_.isEmpty(lessonsDetails)) {
      return <p>No lessons added yet.</p>;
    }

    return (
      <Collapse>
        {lessonsDetails.map(lesson => (
          <Panel
            header={lesson.title}
            key={lesson.id}
            extra={this.getExtra(lesson)}
          >
            <div className="lesson-details">
              <b>Lesson Videos: </b>
              {lesson.lessonVideosDetails.length ? (
                lesson.lessonVideosDetails.map(video => (
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
            <div className="lesson-details">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <b>Objectives: </b>
                <div style={{ marginLeft: '10px' }}>
                  <Can I={permissionAction.add} a={permissionEntity.curriculum}>
                    <Button
                      type="secondary"
                      icon="plus-circle-o"
                      size="small"
                      onClick={() => showAddEditObjective(lesson)}
                    >
                      Add Objective
                    </Button>
                  </Can>
                </div>
              </div>
              <br />
              <Objectives
                objectivesDetails={lesson.objectivesDetails}
                showAddEditObjective={objective =>
                  showAddEditObjective(lesson, objective)
                }
              />
            </div>
          </Panel>
        ))}
      </Collapse>
    );
  }
}

Lessons.defaultProps = {
  lessonDetails: null,
  showAddEditObjective: () => {}
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deleteLesson: deleteLessonAction,
      getCurriculumDetails: getCurriculumsDetailsAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Lessons);
