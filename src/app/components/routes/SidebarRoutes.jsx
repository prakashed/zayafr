import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon, Layout } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import routes from '../../constants/routes.json';
import './SidebarRoutes.less';
import logo from '../../../assets/img/logo.svg';
import { toggleSidebarAction } from '../../reducers/general';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;

function getActiveTab(url) {
  const tokens = url.split('/');
  const subdomain = tokens && tokens[1];
  return [`/${subdomain}`];
}

function SidebarRoutes({ location, sidebarOpen, toggleSidebar }) {
  const { pathname } = location;
  return (
    <Sider className={`sidebar ${sidebarOpen ? 'show' : 'hide'}`}>
      <div className="logo-container">
        <div className="logo">
          <img src={logo} alt="FSM" />
        </div>
        <div
          className="close-sidebar"
          onClick={() => toggleSidebar()}
          role="presentation"
        >
          <Icon type="arrow-left" />
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={getActiveTab(pathname)}
        className="sidebar-menu"
      >
        <Item key={routes.dashboard} className="item">
          <Link to={routes.dashboard}>
            <Icon type="dashboard" /> Dashboard
          </Link>
        </Item>

        <Item key={routes.curriculums} className="item">
          <Link to={routes.curriculums}>
            <Icon type="sound" /> Curriculum
          </Link>
        </Item>

        <SubMenu
          key="Master"
          className="sub-menu"
          title={
            <span>
              <Icon type="edit" />
              <span>Master</span>
            </span>
          }
        >
          {/* <Item key={routes.books} className="item">
            <Link to={routes.books}>
              Books
            </Link>
          </Item> */}
          <Item key={routes.activities} className="item act-funda">
            <Link to={routes.activities}>Activities & Fundamentals</Link>
          </Item>
        </SubMenu>
        {/* <Item key={routes.annual_plans} className="item">
          <Link to={routes.annual_plans}>Annual Plans</Link>
        </Item> */}
        {/* <SubMenu key="Organization" className="sub-menu" title={<span><Icon type="global" /><span>Organization</span></span>}>
          <Item key={routes.clusters} className="item">
            <Link to={routes.clusters}>
              Clusters
            </Link>
          </Item>
          <Item key={routes.schools} className="item">
            <Link to={routes.schools}>
              Schools
            </Link>
          </Item>
        </SubMenu> */}

        <Item key={routes.schools} className="item">
          <Link to={routes.schools}>
            <span>
              <Icon type="home" />
              <span>My School</span>
            </span>
          </Link>
        </Item>

        <Item key={routes.mySchedule} className="item">
          <Link to={routes.mySchedule}>
            <span>
              <Icon type="calendar" />
              <span>My Schedule</span>
            </span>
          </Link>
        </Item>

        {/* <Item key={routes.user
        s} className="item">
          <Link to={routes.users}>
            <Icon type="team" /> User Management
          </Link>
        </Item>

        <Item key={routes.profile} className="item">
          <Link to={routes.profile}>
            <Icon type="profile" /> Profile
          </Link>
        </Item> */}
      </Menu>
    </Sider>
  );
}

SidebarRoutes.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  sidebarOpen: PropTypes.bool,
  toggleSidebar: PropTypes.func.isRequired
};

SidebarRoutes.defaultProps = {
  sidebarOpen: false
};

function mapStateToProps(state) {
  const { general } = state;

  const sidebarOpen = general.get('sidebarOpen');
  return {
    sidebarOpen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleSidebar: toggleSidebarAction
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SidebarRoutes)
);
