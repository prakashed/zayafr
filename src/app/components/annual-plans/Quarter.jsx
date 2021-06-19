import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Icon } from 'antd';

import UnitLessonTree from './UnitLessonTree';
import './Quarter.less';

const { Panel } = Collapse;

const QuarterHeader = ({ title, deletePortion }) => (
  <div className="quarter-header">
    <span>{title}</span>
    <Icon onClick={deletePortion} title="Remove Portion" type="delete" />
  </div>
);

QuarterHeader.propTypes = {
  title: PropTypes.string.isRequired,
  deletePortion: PropTypes.func.isRequired,
};

export default function Quarter({
  quarter, manageLessons, portions, canManageLessons, deletePortion,
}) {
  const { title, readableFromDate, readableToDate } = quarter;

  const customPanelStyle = {
    border: '1px solid #d9d9d9',
    borderRadius: 4,
    marginBottom: 12,
  };

  return (
    <div className="quarter">
      <div className="title">
        <h3>{title}</h3>
        <span>{ readableFromDate } - { readableToDate }</span>
      </div>
      <div className="lessons">
        <Collapse bordered={false}>
          {
            portions && portions.map((portion) => {
              const { id, customRecitalDetails, unitCategoryDetails } = portion;
              const { recitalName, recital } = customRecitalDetails;

              return (
                <Panel
                  header={
                    <QuarterHeader
                      title={recitalName}
                      deletePortion={(e) => { e.stopPropagation(); deletePortion(id); }}
                    />
                  }
                  key={recital}
                  style={customPanelStyle}
                >
                  <UnitLessonTree units={unitCategoryDetails} />
                </Panel>
              );
            })
          }
        </Collapse>
        {
          !portions && (
            <div>
              <h4 style={{ margin: 0 }}>No Lessons added to this quarter.</h4>
              <p style={{ fontStyle: 'italic', fontSize: 12 }}>Get started by adding new lessons to this quarter</p>
            </div>
          )
        }
      </div>
      {
        canManageLessons && (
          <div className="add-lesson" role="presentation" onClick={() => manageLessons({ quarter })}>
            <Icon type="plus-circle-o" />
            <span>Manage Lessons</span>
          </div>
        )
      }
    </div>
  );
}

Quarter.propTypes = {
  quarter: PropTypes.shape({}).isRequired,
  manageLessons: PropTypes.func.isRequired,
  portions: PropTypes.arrayOf(PropTypes.shape({})),
  canManageLessons: PropTypes.bool,
  deletePortion: PropTypes.func.isRequired,
};

Quarter.defaultProps = {
  portions: null,
  canManageLessons: false,
};
