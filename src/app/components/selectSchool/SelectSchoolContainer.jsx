import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { Layout, Card, Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getSchoolListAction } from '../../reducers/schools';
import { setSchoolAction } from '../../reducers/auth';
import './SelectSchool.less';
import { LIST_STORE } from '../../helpers/stateUtils';

const { Header, Content } = Layout;
const { Search } = Input;

function SchoolCard({ school, selectSchool }) {
  const { id, title, locationName } = school;

  return (
    <Card className="school-card" onClick={() => selectSchool(id)}>
      <h3>{ title }</h3>
      <p>{ locationName }</p>
    </Card>
  );
}

SchoolCard.propTypes = {
  school: PropTypes.shape({}).isRequired,
  selectSchool: PropTypes.func.isRequired,
};

class SelectSchoolContainer extends Component {
  componentDidMount() {
    this.props.getSchoolList();
  }

  setSchoolContext(schoolId) {
    this.props.setSchool(schoolId);
  }

  render() {
    if (this.props.schoolSelected) {
      return <Redirect to="/" />;
    }

    const { schools } = this.props;

    if (_.isNull(schools)) {
      return (<p>Loading Schools..</p>);
    }

    return (
      <Layout className="select-school-container">
        <Header className="header">Furtados School of Music</Header>
        <Content className="content">
          {
            (!schools || schools.size === 0) ? (
              <h1>You are not assigned to any school, please contact your manager!</h1>
            ) : (
              <Fragment>
                <div className="school-search">
                  <h2>Select a School</h2>
                  <Search placeholder="Search for School" />
                </div>
                <div className="school-list">
                  {
                    schools.toIndexedSeq().toArray().map(school =>
                      (<SchoolCard
                        key={school.id}
                        school={school}
                        selectSchool={schoolId => this.setSchoolContext(schoolId)}
                      />))
                  }
                </div>
              </Fragment>
            )
          }
        </Content>
      </Layout>
    );
  }
}

SelectSchoolContainer.propTypes = {
  schools: ImmutablePropTypes.map,
  getSchoolList: PropTypes.func.isRequired,
  setSchool: PropTypes.func.isRequired,
  schoolSelected: PropTypes.bool,
};

SelectSchoolContainer.defaultProps = {
  schools: null,
  schoolSelected: false,
};

function mapStateToProps(state) {
  const { schools } = state;
  const schoolList = schools.get(LIST_STORE);
  return {
    schools: schoolList,
    schoolSelected: _.isString(state.auth.get('school')),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getSchoolList: getSchoolListAction,
    setSchool: setSchoolAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSchoolContainer);
