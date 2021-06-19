import React from 'react';
import PropTypes from 'prop-types';

import Can from '../permissions/Can';
import AddNewItem from '../misc/AddNewItem';
import permissionConfig from '../../constants/permission-config.json';

const { action: permissionAction } = permissionConfig;

export default function AddNewEntity({
  entityType,
  linkToAdd,
  addNewText,
  hide
}) {
  return (
    <Can I={permissionAction.add} a={entityType}>
      <AddNewItem link={linkToAdd} addNewText={addNewText} hide={hide} />
    </Can>
  );
}

AddNewEntity.propTypes = {
  entityType: PropTypes.string,
  linkToAdd: PropTypes.string,
  addNewText: PropTypes.string,
  hide: PropTypes.bool
};

AddNewEntity.defaultProps = {
  entityType: null,
  linkToAdd: '',
  addNewText: 'Add',
  hide: false
};
