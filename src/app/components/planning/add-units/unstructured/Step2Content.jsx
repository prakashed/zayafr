import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { Input, List } from 'antd';

const { Search } = Input;

const Unit = ({ unit, selectUnit, activeUnitId }) =>
  (
    <List.Item className={`unit-search-result ${unit.id === activeUnitId ? 'active' : ''}`} onClick={() => selectUnit(unit)}>
      <div className="title">{ unit.title }</div>
      <div className="details">
        <span>{ unit.bookTitle || 'Default Book Title' }</span>
      </div>
    </List.Item>
  );
Unit.propTypes = {
  unit: PropTypes.shape({
    title: PropTypes.string,
    bookTitle: PropTypes.string,
  }).isRequired,
  selectUnit: PropTypes.func.isRequired,
  activeUnitId: PropTypes.number,
};

Unit.defaultProps = {
  activeUnitId: null,
};

class Step2Content extends Component {
  componentWillMount() {
    this.props.searchUnit('');
  }

  render() {
    const {
      searchUnit, filteredUnits, selectUnit, activeUnitId,
    } = this.props;

    return (
      <div className="step-content book-unit step-2">
        <div className="tag-search">
          <p><b>Search the tag you want to teach</b></p>
          <Search style={{ width: '50%' }} onSearch={value => searchUnit(value)} placeholder="Enter Tag name" />
        </div>
        <div className="search-results">
          <p>Search Results</p>
          <div className="result-list">
            {
              _.isNull(filteredUnits) ?
                <p>No Search Results</p>
            : <List
              itemLayout="horizontal"
              dataSource={filteredUnits}
              renderItem={unit =>
                <Unit unit={unit} selectUnit={selectUnit} activeUnitId={activeUnitId} />}
            />
            }
          </div>
        </div>
      </div>
    );
  }
}

Step2Content.propTypes = {
  searchUnit: PropTypes.func.isRequired,
  filteredUnits: ImmutablePropTypes.list,
  selectUnit: PropTypes.func.isRequired,
  activeUnitId: PropTypes.number,
};

Step2Content.defaultProps = {
  filteredUnits: null,
  activeUnitId: null,
};

export default Step2Content;
