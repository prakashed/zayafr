import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

const AssignedTeachersTable = ({ teachers, loading, columns }) => (
  <Table
    loading={loading}
    columns={columns}
    dataSource={teachers}
    pagination={false}
  />
);

AssignedTeachersTable.propTypes = {
  teachers: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
};

AssignedTeachersTable.defaultProps = {
  teachers: [],
  loading: false,
  columns: [],
};

export default AssignedTeachersTable;
