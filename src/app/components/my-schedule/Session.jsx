import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Row, Col, Card, Avatar, Button } from "antd";
import { createSessionAction } from "../../reducers/sessions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import history from "../../helpers/history";
import routes from "../../constants/routes.json";
import moment from "moment";

import playLogo from "../../../assets/img/play.png";
import "./Session.less";

const { Meta } = Card;

class Session extends React.Component {
  constructor(props) {
    super(props);
  }

  actOnReflection(e, sessionId, type, action) {
    let url;
    if (type === "recital") {
      url =
        action == "add"
          ? `${routes.recitalReflectionAdd}/${sessionId}`
          : `${routes.recitalReflectionView}/${sessionId}`;
    } else {
      url =
        action == "add"
          ? `${routes.theoryReflectionAdd}/${sessionId}`
          : `${routes.theoryReflectionView}/${sessionId}`;
    }

    history.push(url);
  }

  render() {
    const { sessionData, loading } = this.props;

    if (loading) {
      return (
        <Card className="shadow" style={{ marginTop: "15px" }}>
          Loading...
        </Card>
      );
    }

    if (!sessionData.length) {
      return (
        <Card className="shadow" style={{ marginTop: "15px" }}>
          No session conducted yet.
        </Card>
      );
    }

    return (
      <div>
        {sessionData.map((data, index) => (
          <Card
            className="shadow"
            key={index}
            style={{ marginTop: "15px" }}
            key={index}
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
                <div className="schedule-title">Planned Date & Time</div>
                <div className="schedule-description">
                  {moment(data.plannedDate).format("DD-MM-YYYY")}{" "}
                  {data.plannedDuration}
                </div>
              </div>
              <div className="schedule-item">
                <div className="schedule-title">Type</div>
                <div className="schedule-description">
                  {_.capitalize(data.type)}
                </div>
              </div>
              <div className="schedule-item">
                <div className="schedule-title">Current curriculum</div>
                <div className="schedule-description">
                  {data.curriculumCovered}
                </div>
              </div>

              <div className="schedule-item">
                <div className="schedule-title">Completion Date & Time</div>
                <div className="schedule-description">
                  {moment(data.created).format("DD-MM-YYYY HH:mm")}
                </div>
              </div>

              <div className="schedule-item center">
                <div className="schedule-title">&nbsp;</div>

                <div className="schedule-description ">
                  {data.isReflectionAdded ? (
                    <Button
                      className="view-reflection-btn"
                      onClick={(e, type, sessionId) =>
                        this.actOnReflection(e, data.id, data.type, "view")
                      }
                    >
                      View Reflection
                    </Button>
                  ) : (
                    <Button
                      className="add-reflection-btn"
                      onClick={(e, type, sessionId) =>
                        this.actOnReflection(e, data.id, data.type, "add")
                      }
                    >
                      Add Reflection
                    </Button>
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

export default Session;
