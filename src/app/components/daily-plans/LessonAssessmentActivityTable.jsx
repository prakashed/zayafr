import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './LessonAssessmentActivityTable.less';
import { getActivitiesAction } from '../../reducers/activities';
import { LIST_STORE } from '../../helpers/stateUtils';

const { Option, OptGroup } = Select;
const { TextArea } = Input;

export const Columns = [
  {
    id: 1,
    title: 'Lessons',
    width: 33.3,
  },
  {
    id: 2,
    title: 'Activity',
    width: 33.3,
  },
  {
    id: 3,
    title: 'Assessment',
    width: 33.3,
  },
];

export const MarkDoneColumns = [
  ...Columns.map(c => ({ ...c, width: 30 })),
  {
    id: 4,
    title: <Icon type="check" />,
    width: 10,
  },
];

export const RemoveOptionColumns = [
  ...Columns.map(c => ({ ...c, width: 30 })),
  {
    id: 4,
    title: <Icon type="delete" />,
    width: 10,
  },
];

export const TableHeader = ({ columns }) => (
  <div className="table-header">
    {
      columns.map(column =>
        (
          <div className="column-header" key={column.id} style={{ width: `${column.width}%` }}>
            { column.title }
          </div>
        ))
    }
  </div>
);

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export const TableBody = ({ children }) => (
  <div className="table-body">
    { children }
  </div>
);

TableBody.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

TableBody.defaultProps = {
  children: null,
};

class LessonAssessmentActivityTable extends Component {
  componentWillMount() {
    if (!this.props.activities) {
      this.props.getActivities();
    }

    const { lessons } = this.props;
    const lessonData = lessons.reduce((mapper, lesson) => {
      const lessonIdMapper = {};
      lessonIdMapper[lesson.id] = {
        lesson,
        assessment: '',
        activity: null,
      };

      return {
        ...mapper,
        ...lessonIdMapper,
      };
    }, {});

    this.setLessonData(lessonData);
  }

  setLessonData = (lessonData) => {
    this.props.lessonDataUpdated(lessonData);
  }

  saveAssessment = ({ lessonId, text }) => {
    const { lessonData } = this.props;

    const oldLesson = lessonData[lessonId];
    const newLesson = {
      ...oldLesson,
      assessment: text.trim(),
    };

    this.updateLessonData(newLesson);
  }

  saveActivity = ({ lessonId, activityId }) => {
    let selectedActivity = null;
    const { lessonData, activities } = this.props;
    selectedActivity = activities.find(a => a.id === activityId);

    const oldLesson = lessonData[lessonId];

    if (!selectedActivity) {
      const { lesson } = oldLesson;
      const { activitiesDetail } = lesson;
      selectedActivity = activitiesDetail.find(a => a.id === activityId);
    }

    const newLesson = {
      ...oldLesson,
      activity: selectedActivity,
    };

    this.updateLessonData(newLesson);
  }

  updateLessonData = (newLesson) => {
    if (!newLesson || !newLesson.lesson) return;

    const { lessonData } = this.props;

    const newLessonData = {};
    newLessonData[newLesson.lesson.id] = newLesson;

    this.setLessonData({
      ...lessonData,
      ...newLessonData,
    });
  }

  render() {
    const { lessons, activities } = this.props;
    return (
      <div className="lesson-assessment-activity-table">
        <TableHeader columns={Columns} />
        <TableBody>
          {
            lessons.map((l) => {
              const { activitiesDetail: lessonActivities } = l;

              return (
                <div className="row" key={l.id}>
                  <div className="column" style={{ width: `${Columns[0].width}%` }}>{ l.title }</div>
                  <div className="column" style={{ width: `${Columns[1].width}%` }}>
                    <Select placeholder="Select Activity" style={{ width: '100%' }} onChange={activityId => this.saveActivity({ lessonId: l.id, activityId })}>
                      {
                        lessonActivities && (
                          <OptGroup label="Lesson Activities">
                            {
                              lessonActivities.map(activity =>
                                (
                                  <Option
                                    key={activity.id}
                                    value={activity.id}
                                  >
                                    {activity.title}
                                  </Option>
                                ))
                            }
                          </OptGroup>
                        )
                      }
                      {
                        activities && (
                          <OptGroup label="Global Activities">
                            {
                              activities.map(activity =>
                                (
                                  <Option
                                    key={activity.id}
                                    value={activity.id}
                                  >
                                    {activity.title}
                                  </Option>
                                ))
                            }
                          </OptGroup>
                        )
                      }
                    </Select>
                  </div>
                  <div className="column" style={{ width: `${Columns[2].width}%` }}>
                    <TextArea rows={2} placeholder="Enter Assessment" onChange={e => this.saveAssessment({ lessonId: l.id, text: e.target.value })} />
                  </div>
                </div>
              );
            })
          }
        </TableBody>
      </div>
    );
  }
}

LessonAssessmentActivityTable.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.shape({})),
  activities: PropTypes.arrayOf(PropTypes.shape({})),
  getActivities: PropTypes.func.isRequired,
  lessonDataUpdated: PropTypes.func,
  lessonData: PropTypes.shape({}),
};

LessonAssessmentActivityTable.defaultProps = {
  lessons: null,
  activities: [],
  lessonDataUpdated: () => {},
  lessonData: null,
};

function mapStateToProps(state) {
  const { activities } = state;
  const activityList = activities.get(LIST_STORE);
  const activitiesArr = activityList && activityList.toIndexedSeq().toArray();
  return {
    activities: activitiesArr,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getActivities: getActivitiesAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonAssessmentActivityTable);
