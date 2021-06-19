import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Tooltip } from "antd";

class Activities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { activitiesDetails } = this.props;

    if (_.isNull(activitiesDetails) || _.isEmpty(activitiesDetails)) {
      return <span>No activites added.</span>;
    }

    return (
      // activitiesDetails ?
      <div>
        <ul>
          {activitiesDetails.map(activity => (
            // <Tooltip placement="right" title={activity.description}>
              <li key={activity.id}>{activity.title}</li>
            // </Tooltip>
          ))}
        </ul>
      </div>
    );
  }
}

Activities.defaultProps = {
  activitiesDetails: null
};

export default Activities;
