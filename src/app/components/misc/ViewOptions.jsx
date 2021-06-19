import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';

import Can from '../permissions/Can';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity, action: permissionAction } = permissionConfig;

export default function ViewOptions({ entity, editUrl, deleteFunction }) {
  const optionsMenu = (
    <Menu>
      { editUrl ? (
        <Menu.Item key="0">
          <Link to={editUrl}><Icon type="edit" /> Edit</Link>
        </Menu.Item>) : ''}
      <Menu.Item key="1" onClick={() => deleteFunction()}>
        <Icon type="delete" /> Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Can I={permissionAction.change} a={permissionEntity[entity]}>
      <Dropdown overlay={optionsMenu} trigger={['click']}>
        <Icon type="down" />
      </Dropdown>
    </Can>
  );
}

ViewOptions.propTypes = {
  editUrl: PropTypes.oneOfType(PropTypes.string, PropTypes.bool),
  deleteFunction: PropTypes.func,
  entity: PropTypes.string,
};

ViewOptions.defaultProps = {
  entity: '',
  editUrl: null,
  deleteFunction: () => {},
};
