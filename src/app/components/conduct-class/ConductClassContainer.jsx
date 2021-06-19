import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Row,
  Col,
  Card,
  Form,
  Layout,
  Icon,
  Drawer,
  Tooltip,
  Button,
  Checkbox,
  Modal
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
  fetchRecitalProgress,
  fetchRecitalPieces,
  createAssignRecitalPiece,
  createRecitalProgress
} from '../../apis/conduct-recital-class-api';

const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
class ConductClassContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recital: {
        lessonDetails: []
      },
      currentObjective: {
        objectiveVideosDetails: [],
        activitiesDetails: []
      },
      currentLesson: {
        lessonVideosDetails: [],
        objectiveDetails: []
      },
      currentVideo: null,
      visible: false,
      showModal: false,
      pieces: [],
      loadingPieces: false,
      assigningPieces: false,
      pieceFetchErrorMessage: '',
      assignPieceErrorMessage: ''
    };
  }

  getRecital(id) {
    fetchRecitalProgress(id).then(res => {
      const recital = this.processResponse(res);
      this.setState({
        recital: recital
      });

      if (recital && recital.lessonDetails && recital.lessonDetails.length) {
        console.log(recital.lessonDetails);
        this.setCurrentLesson(recital.lessonDetails[0]);
      }
    });
  }

  getRecitalPieces(id) {
    fetchRecitalPieces(id)
      .then(res => {
        const pieces = res;
        this.setState({
          pieces: pieces
        });
      })
      .catch(res => {
        this.setState({
          pieceFetchErrorMessage: res
        });
      });
  }

  setCurrentObjective(data) {
    this.setState({
      currentObjective: data,
      currentVideo: null
    });
  }

  setCurrentLesson(data) {
    const objective =
      (data.objectiveDetails &&
        data.objectiveDetails.length &&
        data.objectiveDetails[0]) ||
      null;
    console.log(data);
    console.log(objective);
    this.setState({
      currentLesson: data,
      currentVideo: null,
      currentObjective: objective
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

  showModal = () => {
    this.setState({
      showModal: true
    });
  };

  // handleOk = () => {
  //   this.assignPieces();
  //   this.setState({ showModal: false });
  // };

  handleCancel = () => {
    this.setState({ showModal: false });
  };

  setObjectiveState(state, objectiveId) {
    for (var lesson in this.state.recital.lessonDetails) {
      for (var objective in this.state.recital.lessonDetails[lesson]
        .objectiveDetails) {
        var obj = this.state.recital.lessonDetails[lesson].objectiveDetails[
          objective
        ];
        if (obj.id === objectiveId) {
          obj['state'] = state;
        }
      }
    }
  }

  processResponse(recitalData) {
    for (var lesson in recitalData.lessonDetails) {
      for (var objective in recitalData.lessonDetails[lesson]
        .objectiveDetails) {
        var obj = recitalData.lessonDetails[lesson].objectiveDetails[objective];
        obj['state'] = null;
      }
    }
    return recitalData;
  }

  getRecitalLogs(recitals, custom_recital) {
    var data = [];
    for (var lesson in recitals.lessonDetails) {
      for (var objective in recitals.lessonDetails[lesson].objectiveDetails) {
        var obj = recitals.lessonDetails[lesson].objectiveDetails[objective];
        if (obj.state !== null) {
          const _data = {
            objective: obj.id,
            state: obj.state,
            custom_recital: custom_recital
          };
          data.push(_data);
        }
      }
    }
    return data;
  }

  getLessonTitle(lessonTitle) {
    return lessonTitle.replace(/lesson/gi, '').trim();
  }

  assignPieces = e => {
    e.preventDefault();

    const { form } = this.props;
    const sessionData = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    const class_id = sessionData.class_ocm_id;
    const recital_piece = [sessionData.classroom];
    const from_time = sessionData.session_from_time;
    const to_time = moment().format('HH:mm');
    const date = sessionData.session_date;
    const custom_recital = sessionData.custom_recital;

    form.validateFields((err, values) => {
      if (!err) {
        // Currently implementing single piece logic
        // debugger;
        if (values.pieces && values.pieces.length && values.pieces.length > 0) {
          let assignPiece = {
            class_id: class_id,
            recital_piece_id: values.pieces[0],
            class_type: 'school',
            institute_name: 'osian'
          };

          createAssignRecitalPiece(assignPiece)
            .then(res => {
              this.submit();
            })
            .catch(res => {
              debugger;
              this.setState({
                assignPieceErrorMessage:
                  res.response.data.message + ' Exiting Session.' || null
              });
              const self = this;
              setTimeout(function() {
                self.submit();
              }, 3000);
            });
        } else {
          this.submit();
        }
      }
    });
  };

  submit() {
    const sessionData = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    const recitalLogsData = this.state.recital;
    const classrooms = [sessionData.classroom];
    const from_time = sessionData.session_from_time;
    const to_time = moment().format('HH:mm');
    const date = sessionData.session_date;
    const custom_recital = sessionData.custom_recital;

    const data = {
      ocm_session: sessionData,
      session: {
        from_time,
        to_time,
        date,
        classrooms
      },
      recital_logs: this.getRecitalLogs(recitalLogsData, custom_recital)
    };

    createRecitalProgress(data).then(res => {
      const url = `${routes.mySchedule}`;
      history.push(url);
    });
  }

  componentWillMount() {
    let recitalProgressId = this.props.match.params.recitalProgressId;
    const queryParams = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    const recitalId = queryParams.recital_id;
    this.getRecital(recitalProgressId);
    this.getRecitalPieces(recitalId);
  }

  render() {
    const {
      recital,
      currentLesson,
      currentObjective,
      currentVideo,
      pieces,
      showModal,
      pieceFetchErrorMessage,
      assignPieceErrorMessage
    } = this.state;

    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <Layout className="main-container">
        <div className="item-1">
          <div className="conduct-header">
            <div className="teacher-avatar">
              <img src={teacherLogo} />
            </div>
            <div className="recital-lessons-container">
              <h1 className="recital-name">{recital.recitalTitle}</h1>
              <div className="recital-lessons">
                <div className="item">Lessons:</div>
                {recital.lessonDetails.map((lesson, index) => (
                  <div
                    key={index}
                    className={
                      currentLesson.id == lesson.id
                        ? 'item circle pointer white'
                        : 'item circle pointer orange'
                    }
                    onClick={e => this.setCurrentLesson(lesson, e)}
                  >
                    {this.getLessonTitle(lesson.lessonTitle)}
                  </div>
                ))}
              </div>
            </div>
            <div className="instrument-container">
              <div className="instrument-name">{recital.instrumentTitle}</div>
              <div className="exit-session">
                <Button
                  className="exit-session-btn"
                  onClick={e => this.showModal(e)}
                >
                  Exit Session
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="item-2">
          <div className="conduct-body">
            <div className="playlist-container">
              <div className="menu center">
                <b>{currentLesson.lessonTitle || 'Menu'}</b>
              </div>

              {/* Lesson Videos */}
              {currentLesson &&
              currentLesson.lessonVideosDetails &&
              currentLesson.lessonVideosDetails.length ? (
                currentLesson.lessonVideosDetails.map((video, index) => (
                  <div
                    key={video.id}
                    className="center"
                    onClick={e => this.setCurrentVideo(video, e)}
                  >
                    <span
                      className={
                        currentVideo && currentVideo.id == video.id
                          ? 'pointer active-video'
                          : 'pointer'
                      }
                    >
                      Video {index + 1}
                    </span>
                  </div>
                ))
              ) : (
                <div className="center">No Lesson Videos Available</div>
              )}

              {/* Objectives */}
              {currentLesson &&
                currentLesson.objectiveDetails &&
                currentLesson.objectiveDetails.map((objective, index) => (
                  <div
                    key={index}
                    className="objective"
                    onClick={e => this.setCurrentObjective(objective, e)}
                  >
                    <div
                      className={
                        (currentObjective && currentObjective.id == objective.id
                          ? 'center pointer objective-container shadow '
                          : 'center pointer objective-container ') +
                        objective.state
                      }
                    >
                      <b /> {objective.title}
                      <br />
                      <span>({objective.durationInMinutes} mins)</span>
                    </div>
                    <div className="controls-container">
                      <div
                        className={
                          'control-logo pointer ' +
                          (objective.state == 'completed'
                            ? 'completed-img'
                            : null)
                        }
                        onClick={e =>
                          this.setObjectiveState('completed', objective.id, e)
                        }
                      >
                        <Tooltip placement="bottom" title="Completed">
                          <img src={completedLogo} />
                        </Tooltip>
                      </div>
                      <div
                        className={
                          'control-logo pointer ' +
                          (objective.state == 'not_needed'
                            ? 'not-needed-img'
                            : null)
                        }
                        onClick={e =>
                          this.setObjectiveState('not_needed', objective.id, e)
                        }
                      >
                        <Tooltip placement="bottom" title="Not Needed">
                          <img src={notNeededLogo} />
                        </Tooltip>
                      </div>
                      <div
                        className={
                          'control-logo pointer ' +
                          (objective.state == 'next_class'
                            ? 'next-class-img'
                            : null)
                        }
                        onClick={e =>
                          this.setObjectiveState('next_class', objective.id, e)
                        }
                      >
                        <Tooltip placement="bottom" title="Next Class">
                          <img src={nextClassLogo} />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="video-container">
              <div className="video-item-1">
                <div className="video pad15">
                  {currentVideo ? (
                    <ReactPlayer
                      pip
                      width="100%"
                      height="100%"
                      url={currentVideo.url}
                    />
                  ) : (
                    <div>
                      <img src={videoNotFoundLogo} />
                    </div>
                  )}
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
                  <div className="activities-item" onClick={this.showDrawer}>
                    <div className="class-flow pointer">
                      <Tooltip
                        placement="left"
                        title="Click to view class flow"
                      >
                        <img src={classFlowLogo} />
                      </Tooltip>
                    </div>
                    <div className="center pointer">Class Flow</div>
                  </div>
                </div>
              </div>

              <div className="video-item-2">
                <div className="video-thumb-container">
                  <div className="center pad5">
                    <div style={{ paddingTop: '10px' }}>Objective videos:</div>
                  </div>
                  {currentObjective &&
                  currentObjective.objectiveVideosDetails &&
                  currentObjective.objectiveVideosDetails.length ? (
                    currentObjective.objectiveVideosDetails.map(
                      (video, index) => (
                        <div
                          className={
                            currentVideo && currentVideo.id == video.id
                              ? 'center pad5 pointer active-video'
                              : 'center pad5 pointer'
                          }
                          key={index}
                          onClick={e => this.setCurrentVideo(video, e)}
                        >
                          <Icon type="play-square" className="play" />
                          <div className="small">Video {index + 1}</div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="center pad5">
                      <div style={{ paddingTop: '10px' }}>
                        No Objective videos available
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal to assign pieces start */}

        <Modal
          title="Assign Pieces"
          visible={this.state.showModal}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose
          width="60%"
        >
          <Form layout="horizontal" onSubmit={this.assignPieces}>
            <FormItem>
              {getFieldDecorator('pieces', {})(
                <Checkbox.Group>
                  {pieces.length && pieces.length > 0
                    ? pieces.map((piece, index) => (
                        <Checkbox key={index} value={piece.id}>
                          {piece.pieceName}
                        </Checkbox>
                      ))
                    : 'No pieces to assign'}
                </Checkbox.Group>
              )}
              <div>{assignPieceErrorMessage}</div>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                // disabled={this.state.submittingForm}
              >
                Exit Session
              </Button>
            </FormItem>
          </Form>
        </Modal>

        {/* Modal to assign pieces end */}

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
                <h1> {currentObjective && currentObjective.title} </h1>
                <h2>Activity </h2>
                <div>
                  {currentObjective &&
                  currentObjective.activitiesDetails &&
                  currentObjective.activitiesDetails.length ? (
                    currentObjective.activitiesDetails.map(
                      (activity, index) => (
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
                      )
                    )
                  ) : (
                    <span>No Activities Available.</span>
                  )}
                </div>

                <hr />
                <h2>Classflow</h2>
                <p>
                  {(currentObjective && currentObjective.classFlow) ||
                    'No classflow available.'}
                </p>
                <p>
                  Reference: &nbsp;
                  {(currentObjective && currentObjective.reference) ||
                    'No reference available.'}
                </p>
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
)(Form.create()(ConductClassContainer));
