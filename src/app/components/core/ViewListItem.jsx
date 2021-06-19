import React from 'react';
import { List } from 'antd';
import PropTypes from 'prop-types';

export default function ViewListItem(props) {
  const {
    activeItem,
    setActive,
    item,
    ...otherProps
  } = props;

  return (
    <List.Item
      className={`view-list-item ${activeItem === item.id ? 'active' : ''}`}
      onClick={() => setActive(item.id)}
      {...otherProps}
    >
      {
        props.children
      }
    </List.Item>
  );
}

ViewListItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  item: PropTypes.shape({}).isRequired,
  activeItem: PropTypes.string,
  setActive: PropTypes.func,
};

ViewListItem.defaultProps = {
  activeItem: null,
  setActive: () => {},
};
