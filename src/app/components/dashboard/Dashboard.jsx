import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, Card, Avatar, Anchor } from 'antd';
import moment from 'moment';

import routes from '../../constants/routes.json';
import './Dashboard.less';
import history from '../../helpers/history';
import schoolLogo from '../../../assets/img/school.png';
import scheduleLogo from '../../../assets/img/schedule.png';
import playLogo from '../../../assets/img/play.png';
import {
  fetchMySchools,
  fetchMyTodaysSession,
  createProgress
} from '../../apis/dashboard-api';
import ClassroomStatus from './ClassroomStatus';
import { Link } from 'react-router-dom';

const { Meta } = Card;

function LogoTitle({ logo, title }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        paddingTop: '10px'
      }}
      className="ant-card-head"
    >
      <div>
        <span className="ant-avatar ant-avatar-square ant-avatar-image">
          <img src={logo} />
        </span>
      </div>
      <div style={{ padding: '7px' }}>{title}</div>
    </div>
  );
}

function Next({ nextUp, showClassroomStatus, startSession }) {
  if (!nextUp) {
    return <Card className="shadow">No next class lined up for today.</Card>;
  }

  return (
    <Card className="shadow">
      <div className="schedule-container">
        <div className="schedule-item">
          <div className="schedule-title">School Name</div>
          <div className="schedule-description">{nextUp.schoolName}</div>
        </div>
        <div className="schedule-item">
          <div className="schedule-title">Class</div>
          <div className="schedule-description">{nextUp.classroomName}</div>
        </div>
        <div className="schedule-item">
          <div className="schedule-title">Time</div>
          <div className="schedule-description">{nextUp.classDuration}</div>
        </div>
        <div className="schedule-item">
          <div className="schedule-title">Type</div>
          <div className="schedule-description">
            Recital - {nextUp.instrumentName}
          </div>
          <div className="schedule-description">Theory</div>
        </div>
        <div className="schedule-item">
          <div className="schedule-title">Current curriculum</div>
          {nextUp.recitalData && nextUp.recitalData.id ? (
            <div className="schedule-description">
              {nextUp.recitalData.recitalName}
            </div>
          ) : (
            <div className="schedule-description">N/A</div>
          )}
          {nextUp.theoryData && nextUp.theoryData.id ? (
            <div className="schedule-description">
              {nextUp.theoryData.theoryName}
            </div>
          ) : (
            <div className="schedule-description">N/A</div>
          )}
        </div>

        <div className="schedule-item">
          <div className="schedule-title">Curriculum Progress</div>
          {nextUp.recitalData && nextUp.recitalData.id ? (
            <div className="schedule-description">
              {nextUp.recitalData.progress} %
            </div>
          ) : (
            <div className="schedule-description">N/A</div>
          )}
          {nextUp.theoryData && nextUp.theoryData.id ? (
            <div className="schedule-description">
              {nextUp.theoryData.progress} %
            </div>
          ) : (
            <div className="schedule-description">N/A</div>
          )}
        </div>
        <div className="schedule-item center">
          <div className="schedule-title">&nbsp;</div>

          <div className="schedule-description">
            {nextUp.recitalData &&
            (nextUp.recitalData.progress == null ||
              nextUp.recitalData.progress === 100) ? (
              <span
                onClick={(classroomData, currentClassroom) =>
                  showClassroomStatus(
                    [
                      {
                        classroomId: nextUp.classroomId,
                        classroomName: nextUp.classroomName
                      }
                    ],
                    nextUp.classroomId
                  )
                }
                className="pointer curriculum-assignment"
              >
                Assign Curriculum
              </span>
            ) : (
              <span className="ant-avatar ant-avatar-square ant-avatar-image pointer">
                <img
                  style={{
                    width: '80%',
                    height: '80%'
                  }}
                  src={playLogo}
                  onClick={(recital, data) => startSession('recital', nextUp)}
                />
              </span>
            )}
          </div>

          <div className="schedule-description">
            {nextUp.theoryData &&
            (nextUp.theoryData.progress == null ||
              nextUp.theoryData.progress === 100) ? (
              <span
                onClick={(classroomData, currentClassroom) =>
                  showClassroomStatus(
                    [
                      {
                        classroomId: nextUp.classroomId,
                        classroomName: nextUp.classroomName
                      }
                    ],
                    nextUp.classroomId
                  )
                }
                className="pointer curriculum-assignment"
              >
                Assign Curriculum
              </span>
            ) : (
              <span className="ant-avatar ant-avatar-square ant-avatar-image pointer">
                <img
                  style={{
                    width: '80%',
                    height: '80%'
                  }}
                  src={playLogo}
                  onClick={(recital, data) => startSession('theory', nextUp)}
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

Next.propTypes = {
  name: PropTypes.string
};

Next.defaultProps = {
  name: null
};

function MySchool({ mySchools, showClassroomStatus }) {
  return (
    <div className="ant-card shadow ant-card-bordered">
      <LogoTitle logo={schoolLogo} title="My School" />
      <div className="dashboard-view-list-container">
        {mySchools.length ? (
          mySchools.map((school, index) => (
            <div className="item-card" key={index}>
              <div className="item-title curriculum-assignment-container">
                <span>{school.name}</span>
                <span
                  onClick={classroomData =>
                    showClassroomStatus(school.classroomData)
                  }
                  className="pointer curriculum-assignment"
                >
                  Assign Curriculum
                </span>
              </div>

              <div className="item-description">
                {school.classroomData.length
                  ? school.classroomData.map((classroom, index) => (
                      <span key={index}> {classroom.classroomName}, </span>
                    ))
                  : 'No class assigned'}
              </div>
            </div>
          ))
        ) : (
          <p>No school assigned.</p>
        )}
      </div>
    </div>
  );
}

function MySchdule({ myTodaysSession }) {
  return (
    <div className="ant-card shadow ant-card-bordered">
      <LogoTitle logo={scheduleLogo} title="My Schedule" />
      <div className="dashboard-view-list-container">
        {myTodaysSession.length ? (
          myTodaysSession.map((data, index) => (
            <div className="item-card" key={index}>
              <div className="item-title">
                <Link to={routes.mySchedule + '?sessionId=' + data.sessionId}>
                  {data.classOcmDuration}
                </Link>
              </div>
              <div className="item-description">
                {data.schoolName} | {data.classroomName} | {data.instrumentName}
              </div>
            </div>
          ))
        ) : (
          <p>No session found for today.</p>
        )}
      </div>
    </div>
  );
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mySchools: [],
      myTodaysSession: [],
      showClassroomStatusModal: false,
      currentClassroom: null,
      classrooms: [],
      myClassroomsInstrument: []
    };
  }

  showClassroomStatus(classrooms, currentClassroom = null) {
    this.setState({
      showClassroomStatusModal: true,
      currentClassroom: currentClassroom,
      classrooms: classrooms
    });
  }

  hideModal() {
    // debugger;
    this.setState({
      showClassroomStatusModal: false,
      currentClassroom: null,
      classrooms: []
    });
  }

  getMySchools() {
    let mySchools = [];
    fetchMySchools().then(res => {
      this.setState({
        mySchools: res
      });
    });
  }

  getMyClassroomsInstrument(data) {
    let mapping = [];
    data.map(d => {
      mapping.push({
        classroomId: d.classroomId,
        instrumentOcmId: d.instrumentOcmId
      });
    });
    return mapping;
  }

  sortData(data) {
    return _.sortBy(data, 'classDuration');
  }

  getMyTodaysSession() {
    fetchMyTodaysSession().then(res => {
      this.setState({
        myTodaysSession: this.sortData(res),
        myClassroomsInstrument: this.getMyClassroomsInstrument(res)
      });
    });
  }

  getNextUp(myTodaysSession) {
    if (myTodaysSession && myTodaysSession.length) {
      const currentTime = moment().format('HH.mm');

      // temp testing hack
      // return myTodaysSession[1];

      for (var i in myTodaysSession) {
        const currentTimeInt = parseFloat(currentTime);
        const duration = myTodaysSession[i].classDuration;
        const startTimeInt = parseFloat(
          duration.split('-')[0].replace(':', '.')
        );
        const endTimeInt = parseFloat(duration.split('-')[1].replace(':', '.'));

        if (currentTimeInt <= endTimeInt && currentTimeInt >= startTimeInt) {
          return myTodaysSession[i];
        }

        if (startTimeInt > currentTimeInt) {
          return myTodaysSession[i];
        }
      }
    }
    return null;
  }

  componentWillMount() {
    this.getMySchools();
    this.getMyTodaysSession();
  }

  startCurriculum(id, type, classroomId) {
    let api;
    let data = {};
    if (type == 'recital') {
      api = 'recital-progress';
      data['custom_recital'] = id;
    } else {
      api = 'theory-progress';
      data['theory'] = id;
    }

    data['classroom'] = classroomId;
    data['progress'] = 0;

    createProgress(api, data).then(res => {
      this.getMyTodaysSession();

      this.hideModal();
    });
  }

  startSession(type, data) {
    let url;

    let queryParams = {
      school_ocm_id: data.schoolId,
      class_ocm_id: data.classOcmId,
      class_ocm_name: data.classOcmName,
      class_ocm_date: data.classDate,
      class_ocm_duration: data.classDuration,
      session_ocm_id: data.sessionId,
      instrument_ocm_id: data.instrumentOcmId,
      session_from_time: moment().format('HH:mm'),
      session_date: moment().format('YYYY-MM-DD')
    };

    if (type === 'recital') {
      const recitalProgressId = data.recitalData.id;
      url = `${routes.conductRecitalClass}/${recitalProgressId}`;
      queryParams['classroom'] = data.recitalData.classroom;
      queryParams['custom_recital'] = data.recitalData.customRecital;
      queryParams['recital_id'] = data.recitalData.recitalId;
    } else {
      const theoryProgressId = data.theoryData.id;
      url = `${routes.conductTheoryClass}/${theoryProgressId}`;
      queryParams['classroom'] = data.theoryData.classroom;
      queryParams['theory'] = data.theoryData.theory;
    }
    const payload = data;
    // this.props.createSession(payload);
    let arr = Object.keys(queryParams).map(k => `${k}=${queryParams[k]}`);
    history.push(url + '?' + arr.join('&'));
  }

  render() {
    const {
      mySchools,
      myTodaysSession,
      classrooms,
      currentClassroom,
      showClassroomStatusModal,
      myClassroomsInstrument
    } = this.state;

    return (
      <div className="view-container">
        <Row>
          <Col span={24}>
            <span className="dark-title">
              <u>Next Up:</u>
            </span>
            <Next
              nextUp={this.getNextUp(myTodaysSession)}
              showClassroomStatus={(classrooms, currentClassroom) =>
                this.showClassroomStatus(classrooms, currentClassroom)
              }
              startSession={(type, data) => this.startSession(type, data)}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={11}>
            <MySchool
              mySchools={mySchools}
              showClassroomStatus={classrooms =>
                this.showClassroomStatus(classrooms)
              }
            />
          </Col>
          <Col span={2} />
          <Col span={11}>
            <MySchdule myTodaysSession={myTodaysSession} />
          </Col>
        </Row>
        <ClassroomStatus
          classrooms={classrooms}
          currentClassroom={currentClassroom}
          showClassroomStatusModal={showClassroomStatusModal}
          hideModal={() => this.hideModal()}
          startCurriculum={(id, type, classroomId) =>
            this.startCurriculum(id, type, classroomId)
          }
          myClassroomsInstrument={myClassroomsInstrument}
        />
      </div>
    );
  }
}
export default Dashboard;
