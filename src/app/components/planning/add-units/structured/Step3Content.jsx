import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default function Step3Content({ units }) {
  if (_.isNull(units) || _.isEmpty(units)) return <p>No Units selected</p>;

  const unitsArray = _.values(units);

  return (
    <div className="step-content step-3">
      <p>Review the following -</p>
      {
        unitsArray.map(unit => (
          <div key={unit.id} className="unit-section">
            <b className="title">{ unit.title }</b>
            <ul>
              {unit.lessons.map(lesson => (
                <li key={lesson.id}>{lesson.title}</li>
            ))}
            </ul>
            {/* <ul>
              {unit.activities.map(activity => (
                <li key={activity.id}>
                  <u>{ activity.title }</u>
                  <ul>
                    {
                      activity.lessons.map(lesson => (
                        <li key={lesson.id}>{lesson.title}</li>
                      ))
                    }
                  </ul>
                </li>
              ))}
            </ul> */}
          </div>
        ))
      }
    </div>
  );
}

Step3Content.propTypes = {
  units: PropTypes.shape({}),
};

Step3Content.defaultProps = {
  units: null,
};
