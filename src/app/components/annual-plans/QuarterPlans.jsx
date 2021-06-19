import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Quarter from './Quarter';

export default function QuarterPlans({
  quarterPlans, manageLessons, portionToQuarters, canManageLessons, deletePortion,
}) {
  if (_.isNull(quarterPlans)) {
    return (
      <div className="quarter-plans">
        No Quarters added to this Annual Plan
      </div>
    );
  }

  return (
    <div className="quarter-plans">
      {
        quarterPlans.map((q) => {
          const quarterPortionData = portionToQuarters && portionToQuarters[q.id];
          return (<Quarter
            manageLessons={manageLessons}
            key={q.id}
            quarter={q}
            portions={quarterPortionData && quarterPortionData.portions}
            canManageLessons={canManageLessons}
            deletePortion={deletePortion}
          />);
        })
      }
    </div>
  );
}

QuarterPlans.propTypes = {
  quarterPlans: PropTypes.arrayOf(PropTypes.shape({})),
  manageLessons: PropTypes.func.isRequired,
  portionToQuarters: PropTypes.shape({}),
  canManageLessons: PropTypes.bool,
  deletePortion: PropTypes.func.isRequired,
};

QuarterPlans.defaultProps = {
  quarterPlans: null,
  portionToQuarters: null,
  canManageLessons: false,
};
