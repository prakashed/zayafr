import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Checkbox } from 'antd';

const Step3Content = ({ selectedUnit, togglePieceCheckbox, checkedPieces }) => {
  const { title: unitTitle, bookTitle, lessons } = selectedUnit;

  return (
    <div className="step-content step-3 outcome-activities">
      <div className="unit-selection">
        <p>Select the Lessons from the unit</p>
        <div className="selected-unit">
          <div className="title">{ unitTitle }</div>
          <div className="book">{ bookTitle || 'Default Book Title' }</div>
        </div>
      </div>
      <div className="selection-table">
        <Row className="row header">
          <Col span={12} className="col"><b>Lessons</b></Col>
          <Col span={12} className="col"><b>Choose Lessons</b></Col>
        </Row>
        <div className="selection-rows">
          {
            lessons ?
            lessons.map(lesson => (
              <Row className="row" key={lesson.id}>
                <Col span={12} className="col">{lesson.title}</Col>
                <Col span={12} className="col"><Checkbox onChange={() => togglePieceCheckbox(lesson)} checked={!!checkedPieces[lesson.id]} /></Col>
              </Row>
            ))
            : <p>No Pieces available</p>
          }
        </div>
      </div>
    </div>
  );
};

Step3Content.propTypes = {
  // pieces: PropTypes.arrayOf(PropTypes.shape({})),
  selectedUnit: PropTypes.shape({}),
  togglePieceCheckbox: PropTypes.func.isRequired,
  checkedPieces: PropTypes.shape({}),
};

Step3Content.defaultProps = {
  // pieces: null,
  selectedUnit: null,
  checkedPieces: null,
};

export default Step3Content;
