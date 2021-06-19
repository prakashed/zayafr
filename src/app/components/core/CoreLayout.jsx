import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout } from 'antd';

import SidebarRoutes from '../routes/SidebarRoutes';
import ViewHeaderRoutes from '../routes/ViewHeaderRoutes';
import ViewRoutes from '../routes/ViewRoutes';
import { getPermissionsAction } from '../../reducers/auth';
import './CoreLayout.less';

const { Content } = Layout;

class CoreLayout extends Component {
  componentWillMount() {
    this.props.getPermissions();
  }

  render() {
    const { canLoadApp } = this.props;
    return (
      <Layout className="core-layout">
        {
          canLoadApp ? (
            <Fragment>
              <SidebarRoutes />
              <Content className="core-content">
                <ViewHeaderRoutes />
                <ViewRoutes />
              </Content>
            </Fragment>
          ) : <h1>Gathering Essential Data..</h1>
        }
      </Layout>
    );
  }
}

CoreLayout.propTypes = {
  getPermissions: PropTypes.func.isRequired,
  canLoadApp: PropTypes.bool,
};

CoreLayout.defaultProps = {
  canLoadApp: false,
};

function mapStateToProps(state) {
  const { auth } = state;
  const permissions = auth.get('permissionsData');
  return {
    canLoadApp: !!permissions,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getPermissions: getPermissionsAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout);
