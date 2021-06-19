import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Collapse, Checkbox, Icon } from 'antd';
import _ from 'lodash';

import LoadingMessage from '../../../misc/LoadingMessage';

const { Panel } = Collapse;
// const { Search } = Input;

function UnitLessonsTable({ unit }) {
  return (
    <div className="unit">
      {/* <div className="activity-title">{ activity.title }</div> */}
      <div className="pieces">
        {
          unit.lessons.map(lesson => (
            <div key={lesson.id} className="piece">
              { lesson.title }
            </div>))
        }
      </div>
    </div>
  );
}

UnitLessonsTable.propTypes = {
  unit: PropTypes.shape({
    // title: PropTypes.string,
    lessons: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

// function ActivityTable({ activity }) {
//   return (
//     <div className="activity">
//       <div className="activity-title">{ activity.title }</div>
//       <div className="pieces">
//         {
//           activity.lessons.map(lesson => (
//             <div key={lesson.id} className="piece">
//               { lesson.title }
//             </div>))
//         }
//       </div>
//     </div>
//   );
// }

// ActivityTable.propTypes = {
//   activity: PropTypes.shape({
//     title: PropTypes.string,
//     pieces: PropTypes.arrayOf(PropTypes.shape({})),
//   }).isRequired,
// };

// function parseBookUnits(bookUnitsDetails) {
//   return bookUnitsDetails.map(u => ({
//     ...u,
//     activities: [
//       {
//         id: 1,
//         type: 'activity',
//         title: 'Technique',
//         lessons: u.lessons,
//       },
//     ],
//   }));
// }

function PanelTitle({ title, toggleUnit }) {
  return (
    <div className="panel-title">
      <Checkbox onChange={toggleUnit} onClick={e => e.stopPropagation()}>{title}</Checkbox>
      <Icon type="up" />
    </div>
  );
}

PanelTitle.propTypes = {
  title: PropTypes.string,
  toggleUnit: PropTypes.func.isRequired,
};

PanelTitle.defaultProps = {
  title: 'No Unit Title',
};

function filterAlreadyAddedUnits(units, unitsAlreadyAdded) {
  const unitIdsAdded = unitsAlreadyAdded.map(u => u.id);
  const unitsSet = new Set(unitIdsAdded);

  return units.filter(unit => !unitsSet.has(unit.id));
}

export default function Step2Content({
  toggleUnit, book, searchFilteredUnits, unitsAlreadyAdded,
}) {
  if (_.isNull(book)) {
    return <LoadingMessage message="Fetching Book..." />;
  }
  const { bookUnitsDetails } = book;
  // const parsedUnits = parseBookUnits(filterAlreadyAddedUnits(
  //   searchFilteredUnits || bookUnitsDetails,
  //   unitsAlreadyAdded,
  // ));
  const parsedUnits = filterAlreadyAddedUnits(
    searchFilteredUnits || bookUnitsDetails,
    unitsAlreadyAdded,
  );
  return (
    <div className="step-content step-2">
      <div className="title">
        Select Units to Add
      </div>
      {/* <div className="search-units">
        <Search style={{ width: '50%' }}
         onSearch={value => searchUnit(value)} placeholder="Search..." />
      </div> */}
      {
        parsedUnits.size === 0 ? 'No Units found!' :
        (
          <div className="units-container">
            <Collapse>
              {
                parsedUnits.map(unit => (
                  <Panel showArrow={false} className="unit" header={<PanelTitle title={unit.title} toggleUnit={() => toggleUnit(unit)} />} key={unit.id}>
                    {/* { unit.activities.map(activity =>
                      <ActivityTable key={activity.id} activity={activity} />)
                    } */}
                    <UnitLessonsTable unit={unit} />
                  </Panel>
                ))
              }
            </Collapse>
          </div>
        )
      }
    </div>
  );
}

Step2Content.propTypes = {
  toggleUnit: PropTypes.func.isRequired,
  // searchUnit: PropTypes.func,
  book: PropTypes.shape({}),
  searchFilteredUnits: ImmutablePropTypes.list,
  unitsAlreadyAdded: PropTypes.arrayOf(PropTypes.shape({})),
};

Step2Content.defaultProps = {
  book: null,
  searchUnit: () => {},
  unitsAlreadyAdded: [],
  searchFilteredUnits: null,
};
