import React, { Component } from 'react';
import _ from 'lodash';
import {
  Row,
  Col,
  Card,
  Avatar,
  Layout,
  Icon,
  Drawer,
  Tooltip,
  Button
} from 'antd';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import qs from 'query-string';
import moment from 'moment';

import history from '../../helpers/history';
import routes from '../../constants/routes.json';
import './ConductClass.less';
import teacherLogo from '../../../assets/img/teacher.png';
import activityLogo from '../../../assets/img/activity.png';
import classFlowLogo from '../../../assets/img/class-flow.png';
import completedLogo from '../../../assets/img/completed.png';
import nextClassLogo from '../../../assets/img/next-class-2.png';
import notNeededLogo from '../../../assets/img/not-needed.png';
import videoNotFoundLogo from '../../../assets/img/drawkit-notebook-man-colour.png';

import {
  fetchTheoryProgress,
  createTheoryProgress
} from '../../apis/conduct-theory-class-api';

const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;

class ConductTheoryClassContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theory: {
        categoryDetails: []
      },
      currentCategory: {
        categoryVideosDetails: [],
        activitiesDetails: []
      },
      currentVideo: null,
      visible: false
    };
  }

  getTheory(id) {
    fetchTheoryProgress(id).then(res => {
      const theory = this.processResponse(res);
      this.setState({
        theory: theory
      });

      if (theory && theory.categoryDetails && theory.categoryDetails.length) {
        console.log(theory.categoryDetails);
        this.setCurrentCategory(theory.categoryDetails[0]);
      }
    });
  }

  setCurrentCategory(data) {
    this.setState({
      currentCategory: data,
      currentVideo: null
    });
  }

  setCurrentVideo(data) {
    this.setState({
      currentVideo: data
    });
  }

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  setCategoryState(state, categoryId) {
    for (var category in this.state.theory.categoryDetails) {
      var obj = this.state.theory.categoryDetails[category];
      if (obj.id === categoryId) {
        obj['state'] = state;
        this.setState({
          currentCategory: obj
        });
      }
    }
  }

  processResponse(theoryData) {
    for (var category in theoryData.categoryDetails) {
      var obj = theoryData.categoryDetails[category];
      obj['state'] = null;
    }
    return theoryData;
  }

  getTheoryLogs(theories, theory) {
    var data = [];
    for (var category in theories.categoryDetails) {
      var obj = theories.categoryDetails[category];
      if (obj.state !== null) {
        const _data = {
          category: obj.id,
          state: obj.state,
          theory: theory
        };
        data.push(_data);
      }
    }
    return data;
  }

  getCategoryTitle(categoryTitle) {
    let pattern = /(Lesson)(\D*)(\d+)/;
    let match = categoryTitle.match(pattern);
    return match && match.length && match.length > 2
      ? match[3].trim()
      : categoryTitle;
  }

  submit() {
    const sessionData = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    const theoryLogsData = this.state.theory;
    const classrooms = [sessionData.classroom];
    const from_time = sessionData.session_from_time;
    const to_time = moment().format('HH:mm');
    const date = sessionData.session_date;
    const theory = sessionData.theory;

    const data = {
      ocm_session: sessionData,
      session: {
        from_time,
        to_time,
        date,
        classrooms
      },
      theory_logs: this.getTheoryLogs(theoryLogsData, theory)
    };

    createTheoryProgress(data).then(res => {
      const url = `${routes.mySchedule}`;
      history.push(url);
    });
  }

  componentWillMount() {
    let theoryProgressId = this.props.match.params.theoryProgressId;
    this.getTheory(theoryProgressId);
  }

  render() {
    const { theory, currentCategory, currentVideo } = this.state;

    return (
      <Layout className="main-container">
        <div className="item-1">
          <div className="conduct-header">
            <div className="teacher-avatar">
              <img src={teacherLogo} />
            </div>
            <div className="recital-lessons-container">
              <h1 className="recital-name">{theory.theoryTitle}</h1>
              <div className="recital-lessons">
                <div className="item">Categories :</div>
                {theory.categoryDetails.map((category, index) => (
                  <div
                    key={index}
                    className={
                      currentCategory.id == category.id
                        ? 'item circle pointer white'
                        : 'item circle pointer orange'
                    }
                    onClick={e => this.setCurrentCategory(category, e)}
                  >
                    {this.getCategoryTitle(category.title)}
                  </div>
                ))}
              </div>
            </div>
            <div className="instrument-container">
              <div className="instrument-name">
                {_.capitalize(theory.theoryType)}
              </div>
              <div className="exit-session">
                <Button
                  className="exit-session-btn"
                  onClick={e => this.submit(e)}
                >
                  Exit Session
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="item-2">
          <div className={'conduct-body ' + currentCategory.state}>
            <div className="video-container">
              <div className="video-item-1 category-container">
                <div className="category-content">
                  <div
                    style={{ width: '100%' }}
                    className="category-content-item center"
                  >
                    <h2>{currentCategory.title}</h2>
                  </div>

                  <div className="category-content-item">
                    <h3>
                      <u>Learning outcome</u>:
                    </h3>
                    {currentCategory.learningOutcome}
                  </div>

                  <div className="category-content-item">
                    <h3>
                      <u>Assessment</u>:
                    </h3>
                    {currentCategory.assessment}
                  </div>

                  <div className="category-content-item">
                    <h3>
                      <u>Videos</u>:
                    </h3>
                  </div>

                  <div className="category-content-item category-content-video">
                    {currentCategory &&
                    currentCategory.categoryVideosDetails &&
                    currentCategory.categoryVideosDetails.length ? (
                      currentCategory.categoryVideosDetails.map(
                        (video, index) => (
                          <div
                            className="category-content-video-item"
                            key={index}
                          >
                            <ReactPlayer
                              pip
                              width="100%"
                              height="100%"
                              url={video.url}
                            />
                          </div>
                        )
                      )
                    ) : (
                      <div className="category-content-video-item">N/A</div>
                    )}
                  </div>

                  <div className="category-content-item">
                    <div className="category-actions-container">
                      <div className="item">
                        Have you completed teaching this? Mark your feedback by
                        clicking on appropriate button:
                      </div>
                      <div
                        className="item img pointer"
                        onClick={e =>
                          this.setCategoryState(
                            'completed',
                            currentCategory.id,
                            e
                          )
                        }
                      >
                        <Tooltip placement="bottom" title="Completed">
                          <img src={completedLogo} />
                        </Tooltip>
                      </div>

                      <div
                        className="item img pointer"
                        onClick={e =>
                          this.setCategoryState(
                            'not_needed',
                            currentCategory.id,
                            e
                          )
                        }
                      >
                        <Tooltip placement="bottom" title="Not Needed">
                          <img src={notNeededLogo} />
                        </Tooltip>
                      </div>

                      <div
                        className="item img pointer"
                        onClick={e =>
                          this.setCategoryState(
                            'next_class',
                            currentCategory.id,
                            e
                          )
                        }
                      >
                        <Tooltip placement="bottom" title="Next Class">
                          <img src={nextClassLogo} />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="activities-container pad15 center">
                  <div className="activities-item " onClick={this.showDrawer}>
                    <div className="activity-logo-container pointer">
                      <Tooltip placement="left" title="Click to view activites">
                        <img src={activityLogo} />
                      </Tooltip>
                    </div>

                    <div className="center">Activity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Drawer
          width={450}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          closable
          style={{ fontFamily: 'Gotham Rounded Medium' }}
          bodyStyle={{ background: '#ede6e6' }}
        >
          <Row>
            <Col span={24}>
              <div className="activity-classflow-container">
                <h1> {currentCategory && currentCategory.title} </h1>
                <h2>Activity </h2>
                <div>
                  {currentCategory &&
                  currentCategory.activitiesDetails &&
                  currentCategory.activitiesDetails.length ? (
                    currentCategory.activitiesDetails.map((activity, index) => (
                      <ul key={index}>
                        <li>
                          <b>Title: </b> {activity.title}
                        </li>
                        <li>
                          <b>Description: </b> {activity.description}
                        </li>
                        <li>
                          <b>URL: </b>
                          <a href={activity.url} target="_blank">
                            {activity.url}
                          </a>
                        </li>
                      </ul>
                    ))
                  ) : (
                    <span>No Activities Available.</span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Drawer>
      </Layout>
    );
  }
}

export default connect(
  null,
  null
)(ConductTheoryClassContainer);
