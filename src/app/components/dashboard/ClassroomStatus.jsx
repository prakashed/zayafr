import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Row, Col, Select, Card, Modal, Progress } from "antd";

import "./ClassroomStatus.less";
import { fetchClassroomCurrentStatus } from "../../apis/dashboard-api";

const Option = Select;

class ClassroomStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStatus: [],
      currentSelectedClassroom: null,
      message: "Please select a class"
    };
  }

  getClassroomCurrentStatus(classroomId) {
    if (classroomId) {
      this.setState({
        currentSelectedClassroom: classroomId
      });
      fetchClassroomCurrentStatus(classroomId).then(res => {
        this.setState({
          currentStatus: res
        });
      });
    }
  }

  hideClassroomStatusModal = () => {
    this.setState({
      currentStatus: [],
      currentSelectedClassroom: null
    });

    this.props.hideModal();
  };

  componentWillMount() {
    // debugger;
    const { classrooms, currentClassroom } = this.props;
  }

  componentDidUpdate(prevProps) {
    const { classrooms, currentClassroom } = this.props;
    if (currentClassroom !== prevProps.currentClassroom) {
      this.getClassroomCurrentStatus(currentClassroom);
    }
  }

  getAppropriateMessage(currentClassroom, classrooms) {
    if (!currentClassroom) {
      return "Please select a classroom!";
    }

    if (currentClassroom && !classrooms.length) {
      return "No annual plan assigned.";
    }
  }

  startCurriculum(id, type, classroom) {
    this.setState({
      currentStatus: []
    });
    this.props.startCurriculum(id, type, classroom);
  }

  hasInstrumentClass(
    currentClassroom,
    myClassroomsInstrument,
    instrumentOcmId
  ) {
    for (var i in myClassroomsInstrument) {
      if (
        myClassroomsInstrument[i]['instrumentOcmId'] === instrumentOcmId &&
        myClassroomsInstrument[i]['classroomId'] === currentClassroom
      ) {
        return true;
      }
    }
    return false;
  }

  shouldAllow(data, currentClassroom, myClassroomsInstrument) {
    // debugger;
    if (data.type === 'theory' && data.canBeStarted && data.progress !== 100) {
      return true;
    } else {
      if (
        data.canBeStarted &&
        data.progress !== 100 &&
        this.hasInstrumentClass(
          currentClassroom,
          myClassroomsInstrument,
          data.instrumentOcmId
        )
      ) {
        return true;
      }
      return false;
    }
  }

  render() {
    const {
      classrooms,
      currentClassroom,
      showClassroomStatusModal,
      myClassroomsInstrument
    } = this.props;

    const { currentStatus, currentSelectedClassroom } = this.state;

    return (
      <Modal
        title="Classroom curent status"
        visible={showClassroomStatusModal}
        onCancel={() => this.hideClassroomStatusModal()}
        footer={null}
        destroyOnClose
        width="60%"
      >
        <Row>
          <Col span={24}>
            <div className="space-5">
              Select Classroom: &nbsp;
              {classrooms && classrooms.length ? (
                <Select
                  style={{ width: "320px" }}
                  onChange={value => this.getClassroomCurrentStatus(value)}
                  defaultValue={currentClassroom}
                  disabled={
                    classrooms.length == 1 && currentClassroom ? true : false
                  }
                >
                  {classrooms.map((classroom, index) => (
                    <Option key={index} value={classroom.classroomId}>
                      {classroom.classroomName}
                    </Option>
                  ))}
                </Select>
              ) : (
                "No class assigned"
              )}
            </div>
            <div className="progress-container space-5">
              {currentStatus.length ? (
                <div className="item-container ">
                  <div style={{ flex: "2" }}>
                    <b>Title</b>
                  </div>
                  <div style={{ flex: "1" }}>
                    <b>Type</b>
                  </div>
                  <div style={{ flex: "1" }}>
                    <b>Progress</b>
                  </div>
                  <div style={{ flex: "1" }}>
                    <b>Status</b>
                  </div>
                </div>
              ) : null}

              {currentStatus.length ? (
                currentStatus.map((data, index) => (

                  <div
                    className={
                      this.shouldAllow(
                        data,
                        currentSelectedClassroom,
                        myClassroomsInstrument
                      )
                        ? 'item-container '
                        : 'item-container instrument-disabled'
                    }
                  >
                    <div style={{ flex: '2' }}>{data.title}</div>
                    <div style={{ flex: '1' }}>{_.capitalize(data.type)} </div>
                    <div style={{ flex: '1', paddingRight: '10px' }}>

                      <Progress percent={data.progress} size="small" />
                    </div>

                    {this.shouldAllow(
                      data,
                      currentSelectedClassroom,
                      myClassroomsInstrument
                    ) ? (
                      <div
                        style={{
                          flex: "1",
                          fontSize: "16px",
                          paddingTop: "1px"
                        }}
                        className="pointer curriculum-assignment"
                        onClick={(id, type, classroomId) =>
                          this.startCurriculum(
                            data.id,
                            data.type,
                            currentSelectedClassroom
                          )
                        }
                      >
                        Start
                      </div>
                    ) : (
                      <div
                        style={{ flex: "1", paddingTop: "1px" }}
                        className="disabled"
                      >
                        {data.progress == 100
                          ? "Done"
                          : data.isInProgress
                          ? "In Progress"
                          : "N/A"}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>
                  {this.getAppropriateMessage(
                    currentSelectedClassroom,
                    currentStatus
                  )}
                </div>
              )}
            </div>
          </Col>
          {currentStatus.length ? (
            <Col span={24}>
              <div className="note">
                You are not allowed to choose another recital/theory until the
                current “ In Progress “ recital/theory is completed. Please
                reach out to your Cluster Manager for more information
              </div>
            </Col>
          ) : null}
        </Row>
      </Modal>
    );
  }
}

export default ClassroomStatus;
