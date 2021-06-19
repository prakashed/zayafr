import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, Card, Avatar, Badge } from 'antd';
import { createSessionAction } from '../../reducers/sessions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import history from '../../helpers/history';
import routes from '../../constants/routes.json';
import moment from 'moment';
import qs from 'query-string';

import playLogo from '../../../assets/img/play.png';
import './Schedule.less';

const { Meta } = Card;

class Schedule extends React.Component {
  constructor(props) {
    super(props);
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
    this.props.createSession(payload);
    let arr = Object.keys(queryParams).map(k => `${k}=${queryParams[k]}`);
    history.push(url + '?' + arr.join('&'));
  }

  render() {
    const { scheduleData, loading, sessionId } = this.props;

    if (loading) {
      return <Card className="shadow">Loading...</Card>;
    }

    if (!scheduleData.length) {
      return <Card className="shadow">No next class lined up for today.</Card>;
    }

    return (
      <div>
        {scheduleData.map((data, index) => (
          <Card
            className={
              'shadow ' +
              (data.sessionId == sessionId ? ' higlight-schedule' : '')
            }
            key={index}
            style={{ marginTop: '15px' }}
          >
            <div className="schedule-container">
              <div className="schedule-item">
                <div className="schedule-title">School Name</div>
                <div className="schedule-description">{data.schoolName}</div>
              </div>
              <div className="schedule-item">
                <div className="schedule-title">Class</div>
                <div className="schedule-description">{data.classroomName}</div>
              </div>
              <div className="schedule-item">
                <div className="schedule-title">Time</div>
                <div className="schedule-description">{data.classDuration}</div>
              </div>
              <div className="schedule-item">
                <div className="schedule-title">Type</div>
                <div className="schedule-description">
                  Recital - {data.instrumentName}
                </div>
                <div className="schedule-description">Theory</div>
              </div>
              <div className="schedule-item">
                <div className="schedule-title">Current curriculum</div>
                {data.recitalData && data.recitalData.id ? (
                  <div className="schedule-description">
                    {data.recitalData.recitalName}
                  </div>
                ) : (
                  <div className="schedule-description">N/A</div>
                )}
                {data.theoryData && data.theoryData.id ? (
                  <div className="schedule-description">
                    {data.theoryData.theoryName}
                  </div>
                ) : (
                  <div className="schedule-description">N/A</div>
                )}
              </div>

              <div className="schedule-item">
                <div className="schedule-title">Curriculum Progress</div>
                {data.recitalData && data.recitalData.id ? (
                  <div className="schedule-description">
                    {data.recitalData.progress} %
                  </div>
                ) : (
                  <div className="schedule-description">N/A</div>
                )}
                {data.theoryData && data.theoryData.id ? (
                  <div className="schedule-description">
                    {data.theoryData.progress} %
                  </div>
                ) : (
                  <div className="schedule-description">N/A</div>
                )}
              </div>
              <div className="schedule-item center">
                <div className="schedule-title">&nbsp;</div>

                <div className="schedule-description ">
                  {data.recitalData &&
                  (data.recitalData.progress == null ||
                    data.recitalData.progress === 100) ? (
                    <span>No curriculum assigned</span>
                  ) : (
                    <span className="ant-avatar ant-avatar-square ant-avatar-image pointer">
                      <img
                        style={{
                          width: '80%',
                          height: '80%'
                        }}
                        src={playLogo}
                        onClick={e => this.startSession('recital', data)}
                      />
                    </span>
                  )}
                </div>

                <div className="schedule-description ">
                  {data.theoryData &&
                  (data.theoryData.progress == null ||
                    data.theoryData.progress === 100) ? (
                    <span>No curriculum assigned</span>
                  ) : (
                    <span className="ant-avatar ant-avatar-square ant-avatar-image pointer">
                      <img
                        style={{
                          width: '80%',
                          height: '80%'
                        }}
                        src={playLogo}
                        onClick={e => this.startSession('theory', data)}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
}

Schedule.propTypes = {
  scheduleData: PropTypes.array.isRequired,
  createSession: PropTypes.func.isRequired
};

Schedule.defaultProps = {
  scheduleData: null,
  createSession: () => {}
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createSession: createSessionAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Schedule);
