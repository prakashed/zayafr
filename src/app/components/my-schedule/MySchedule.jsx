import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, Card, Avatar, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import history from '../../helpers/history';
import routes from '../../constants/routes.json';
import qs from 'query-string';

import Schedule from './Schedule';
import { fetchMySchools, fetchMyTodaysSession } from '../../apis/dashboard-api';

import satisfyLogo from '../../../assets/img/satisfy.png';

const { Meta } = Card;

class MySchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myTodaysSession: [],
      loading: false,
      sessionId: null
    };
  }

  sortData(data) {
    return _.sortBy(data, 'classDuration');
  }

  getMyTodaysSession() {
    this.setState({
      loading: true
    });
    fetchMyTodaysSession().then(res => {
      this.setState({
        loading: false
      });
      this.setState({
        myTodaysSession: this.sortData(res)
      });
    });
  }

  componentWillMount() {
    this.getMyTodaysSession();
    const qp = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    const sessionId = qp.sessionId;
    this.setState({ sessionId: sessionId });
  }

  render() {
    const { myTodaysSession, loading, sessionId } = this.state;

    return (
      <div style={{ marginTop: '20px' }}>
        <Row>
          <Col span={24}>
            <Schedule
              scheduleData={myTodaysSession}
              loading={loading}
              sessionId={sessionId}
            />
          </Col>
        </Row>
        <Link to={routes.session} className="my-sessions-link">
          <Tooltip title="Reflections">
            <img src={satisfyLogo} />
          </Tooltip>
        </Link>
      </div>
    );
  }
}

export default MySchedule;

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       createSession: createNewSession
//     },
//     dispatch
//   );
// }

// export default connect(
//   null,
//   mapDispatchToProps
// )(MySchedule);
