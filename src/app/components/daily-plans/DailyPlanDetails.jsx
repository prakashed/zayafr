import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'antd';

import ViewOptions from '../misc/ViewOptions';
import routes from '../../constants/routes.json';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import InstrumentTag from '../misc/InstrumentTag';
import ClassroomsTitle from '../misc/ClassroomsTitle';
import LessonPlan from './LessonPlan';
import { parseToDosToLessonPlans } from '../../helpers';
import LoadingMessage from '../misc/LoadingMessage';
import AddReflection from './AddReflection';
import { fetchClassroomDetails } from '../../apis/classroom-api';
import { ASSISTANT_TEACHER_TYPE } from '../../constants/config';
import './DailyPlanDetails.less';

class DailyPlanDetails extends Component {
  state = {
    showReflection: false,
    assistantTeachers: null,
  }

  addReflection = () => {
    this.fetchClassroomTeachers();
    this.setState({ showReflection: true });
  }

  fetchClassroomTeachers = () => {
    const { dailyPlan } = this.props;
    const { classroomsDetails, instrument } = dailyPlan;

    const apiRequests = classroomsDetails.map(c => fetchClassroomDetails(c.id));
    Promise.all(apiRequests)
      .then((response) => {
        // console.log('fetched classroom details --> ', response);
        const assistantTeachers = response.reduce((arr, classroom) => {
          const { classroomTeachers } = classroom;
          const assistantTeachersInClass = classroomTeachers
            .filter(cT => cT.type === ASSISTANT_TEACHER_TYPE && cT.instrument === instrument);

          return [...arr, ...assistantTeachersInClass];
        }, []);

        this.setState({ assistantTeachers });
      })
      .catch((err) => {
        console.error('error --> ', err);
      });
  }

  checkIfCanAddReflection = () => {
    const { dailyPlan } = this.props;
    const { reflection } = dailyPlan;
    return !reflection;
  }

  hideReflection = () => this.setState({ showReflection: false })

  reflectionSubmitted = (reflectionPayload) => {
    this.props.createReflection(reflectionPayload);
    this.hideReflection();
  }

  todoMarkedAsDone = (todoId) => {
    const { toDosDetails } = this.props.dailyPlan;
    const todo = toDosDetails.find(t => t.id === todoId);
    return todo.isComplete;
  }

  renderReflection = () => {
    const { reflection } = this.props.dailyPlan;
    const { comment, reason, assistantTeacherNames } = reflection;
    return (
      <div className="reflection">
        { assistantTeacherNames && assistantTeacherNames.length ? (
          <div className="assistant-teachers section">
            <div className="section-title">Assistant Teachers</div>
            <ul>
              {
                assistantTeacherNames.map(n => <li>{ n }</li>)
              }
            </ul>
          </div>
        ) : '' }
        <div className="comment section">
          <div className="section-title">Comment</div>
          <div className="section-details">{ comment || <em>No Comments</em> }</div>
        </div>
        { reason ? (
          <div className="reason section">
            <div className="section-title">Reason for Incompletion</div>
            <div className="section-details">{ reason }</div>
          </div>
        ) : '' }
      </div>
    );
  }

  render() {
    const { showReflection, assistantTeachers } = this.state;
    const { dailyPlan } = this.props;

    if (_.isNull(dailyPlan)) {
      return <p>Daily Plan Not Found</p>;
    }

    const {
      id,
      title,
      instrument,
      instrumentDetails,
      classroomsDetails,
      toDosDetails,
    } = dailyPlan;

    const lessonPlans = toDosDetails ? parseToDosToLessonPlans(toDosDetails) : [];

    const editUrl = `${routes.daily_plans}/${id}${routes.edit}`;

    const dataTable = [
      {
        title: 'Instrument',
        value: <InstrumentTag instrument={instrumentDetails} />,
      },
      {
        title: 'Classes',
        value: <ClassroomsTitle classrooms={classroomsDetails} />,
      },
    ];

    const dailyPlanDetailsFetched = !!toDosDetails;

    const canAddReflection = this.checkIfCanAddReflection();

    return (
      <div className="daily-plan-details-view details-view">
        <div className="daily-plan-title title">
          <h1>{ title }</h1>
          <ViewOptions
            entity="dailyPlans"
            editUrl={canAddReflection && editUrl}
            deleteFunction={this.props.deleteDailyPlan}
          />
        </div>
        <div className="daily-plan-details details">
          <ViewDetailsTable dataTable={dataTable} />
          {
            dailyPlanDetailsFetched ? (
              <Fragment>
                {
                  lessonPlans.map(lessonPlan =>
                    (<LessonPlan
                      key={lessonPlan.id}
                      lessonPlan={lessonPlan}
                      markAsDone={!canAddReflection}
                      isToDoChecked={this.todoMarkedAsDone}
                    />))
                }
                {
                  canAddReflection &&
                  <Button
                    onClick={this.addReflection}
                    style={{ width: '100%', marginTop: '24px' }}
                    type="primary"
                  >
                    Add Reflection
                  </Button>
                }
                { canAddReflection &&
                  <AddReflection
                    visible={showReflection}
                    onOk={this.reflectionSubmitted}
                    onCancel={this.hideReflection}
                    lessonPlans={lessonPlans}
                    dailyPlan={id}
                    instrument={instrument}
                    assistantTeachers={assistantTeachers}
                  />
                }
                {
                  !canAddReflection && this.renderReflection()
                }
              </Fragment>
            ) : (<LoadingMessage message="Fetching To Do list..." />)
          }
        </div>
      </div>
    );
  }
}

DailyPlanDetails.propTypes = {
  dailyPlan: PropTypes.shape({
    title: PropTypes.string,
    reflection: PropTypes.shape({}),
    toDosDetails: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  deleteDailyPlan: PropTypes.func,
  createReflection: PropTypes.func.isRequired,
};

DailyPlanDetails.defaultProps = {
  dailyPlan: null,
  deleteDailyPlan: () => {},
};

export default DailyPlanDetails;
