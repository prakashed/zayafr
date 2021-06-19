import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

const InstrumentTag = ({ instrument }) => (
  <Tag color={instrument.color}>{ instrument.title }</Tag>
);

InstrumentTag.propTypes = {
  instrument: PropTypes.shape({
    color: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

export default InstrumentTag;
