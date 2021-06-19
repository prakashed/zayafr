import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Collapse, Anchor, Button, Icon } from 'antd';

import AttachmentList from '../misc/AttachmentList';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import ViewOptions from '../misc/ViewOptions';
import routes from '../../constants/routes.json';
import Lessons from './Lessons';
import './RecitalDetails.less';

import Can from '../permissions/Can';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity } = permissionConfig;
const { action: permissionAction } = permissionConfig;
const Panel = Collapse.Panel;
const Link = Anchor.Link;

function InstrumentLessons(props) {
  const {
    instrumentLessonsDetails,
    showAddEditLesson,
    showAddEditObjective
  } = props;

  if (_.isEmpty(instrumentLessonsDetails)) {
    return <p>No instruments added yet.</p>;
  }

  return instrumentLessonsDetails.map((instrument, index) => (
    <div key={instrument.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <h3>
          {index + 1}. {instrument.title}
        </h3>
        <div style={{ marginLeft: '10px', marginBottom: '8px' }}>
          <Can I={permissionAction.add} a={permissionEntity.curriculum}>
            <Button
              type="secondary"
              icon="plus-circle-o"
              size="small"
              onClick={() => showAddEditLesson(instrument)}
            >
              Add Lesson
            </Button>
          </Can>
        </div>
      </div>
      <Lessons
        lessonsDetails={instrument.lessonsDetails}
        showAddEditObjective={(lesson, objective) =>
          showAddEditObjective(lesson, objective)
        }
        showAddEditLesson={lesson => showAddEditLesson(instrument, lesson)}
      />
      <br />
    </div>
  ));
}
// InstrumentLessons.defaultProps
InstrumentLessons.defaultProps = {
  instrumentLessonsDetails: [],
  showAddEditLesson: () => {},
  showAddEditObjective: () => {}
};

export default function RecitalDetails(props) {
  const { curriculum, showAddEditLesson, showAddEditObjective } = props;

  if (_.isNull(curriculum)) {
    return <p>Not found</p>;
  }

  const { id: curriculumId, title } = curriculum;
  const {
    instrumentLessonsDetails,
    bars,
    url,
    createdByName,
    type,
    musicalGradeTitle
  } = curriculum.properties;

  const dataTable = [
    {
      title: 'Type',
      value: _.capitalize(type)
    },
    {
      title: 'Created By',
      value: createdByName
    },
    {
      title: 'Suggested Grade',
      value: musicalGradeTitle
    },
    {
      title: 'URL',
      value:
        url && url.length ? (
          <a href={url} target="_blank">
            {url}
          </a>
        ) : (
          'No Url Added'
        )
    },
    {
      title: 'Bars',
      value: bars || 'No Bars'
    },
    {
      title: 'Instrument lessons:',
      value: ''
    }
  ];

  const editUrl = `${routes.curriculums}/${curriculumId}${routes.edit_recital}`;

  return (
    <div className="recital-details-view details-view">
      <div className="recital-title title">
        <h1>{title}</h1>
        <ViewOptions
          entity="curriculum"
          editUrl={editUrl}
          deleteFunction={props.deleteCurriculum}
        />
      </div>
      <div className="activity-details details">
        <ViewDetailsTable dataTable={dataTable} />
      </div>

      <div>
        <InstrumentLessons
          instrumentLessonsDetails={instrumentLessonsDetails}
          showAddEditLesson={(instrument, lesson) =>
            showAddEditLesson(instrument, lesson)
          }
          showAddEditObjective={(lesson, objective) =>
            showAddEditObjective(lesson, objective)
          }
        />
      </div>
    </div>
  );
}

RecitalDetails.propTypes = {
  curriculum: PropTypes.shape({}),
  showAddEditLesson: PropTypes.func,
  showAddEditObjective: PropTypes.func,
  deleteCurriculum: PropTypes.func
};

RecitalDetails.defaultProps = {
  curriculum: null,
  showAddEditLesson: () => {},
  showAddEditObjective: () => {},
  deleteCurriculum: () => {}
};
