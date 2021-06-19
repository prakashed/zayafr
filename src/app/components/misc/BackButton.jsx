import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

export default function BackButton({ link, hide }) {
  return (
    <Link className={`back-btn ${hide ? 'hide' : 'show'}`} to={link}>
      <Icon type="arrow-left" /><span>Back</span>
    </Link>
  );
}

BackButton.propTypes = {
  link: PropTypes.string.isRequired,
  hide: PropTypes.bool,
};

BackButton.defaultProps = {
  hide: true,
};
