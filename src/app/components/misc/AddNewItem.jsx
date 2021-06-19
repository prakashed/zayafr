import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

export default function AddNewItem({ link, addNewText, hide }) {
  return (
    <Link className={hide ? 'hide' : 'show'} to={link}><Button type="primary">{ addNewText }</Button></Link>
  );
}

AddNewItem.propTypes = {
  link: PropTypes.string.isRequired,
  addNewText: PropTypes.string,
  hide: PropTypes.bool,
};

AddNewItem.defaultProps = {
  addNewText: 'Add',
  hide: false,
};
