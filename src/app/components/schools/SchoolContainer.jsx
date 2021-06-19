import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import {
  getSchoolListAction,
  getSchoolSearchAction,
  getNextBatchAction
} from '../../reducers/schools';

import SchoolDetailsContainer from './SchoolDetailsContainer';
import AddEditSchoolContainer from './AddEditSchoolContainer';
import SearchBar from '../misc/SearchBar';
import routes from '../../constants/routes.json';
import LoadingMessage from '../misc/LoadingMessage';
import permissionConfig from '../../constants/permission-config.json';
import './School.less';
import BackButton from '../misc/BackButton';
import AddNewEntity from '../core/AddNewEntity';
import { LIST_STORE, NEXT_BATCH_URL_STORE } from '../../helpers/stateUtils';

const { entity: permissionEntity } = permissionConfig;

function SchoolItem({
  school,
  setActive,
  activeItemId,
  isCurrentSelectedSchool
}) {
  const { id, name, establishedYear, teacherNames, classroomDetails } = school;

  return (
    <List.Item
      className={`school view-list-item ${
        activeItemId === id ? 'active' : ''
      } ${isCurrentSelectedSchool ? 'current-school' : ''}`}
      onClick={() => setActive(id)}
    >
      <div style={{ paddingRight: '60px' }}>
        <span className="title item-title">{name}</span>
        <div className="school-details item-details">
          <span>Established year: {establishedYear}</span>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <span>Teachers: {teacherNames.length}</span>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <span>Classes: {classroomDetails.length}</span>
        </div>
      </div>
    </List.Item>
  );
}

SchoolItem.propTypes = {
  school: PropTypes.shape({
    name: PropTypes.string,
    established: PropTypes.string,
    teacherNames: PropTypes.array
  }).isRequired,
  activeItemId: PropTypes.string,
  setActive: PropTypes.func,
  isCurrentSelectedSchool: PropTypes.bool
};

SchoolItem.defaultProps = {
  activeItemId: null,
  setActive: () => {},
  isCurrentSelectedSchool: false
};

class SchoolViewContainer extends React.Component {
  state = {
    activeItemId: null
  };

  componentDidMount() {
    this.props.getSchoolList();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;
    this.setState({
      activeItemId: id
    });
  }

  setActive = itemId => {
    const url = `${routes.schools}/${itemId}`;
    this.props.history.push(url);
  };

  searchForSchools = searchText => {
    if (!searchText || !searchText.length) {
      this.props.getSchoolList();
    } else {
      this.props.searchSchool({ search: searchText });
    }
  };

  fetchNextBatch = () => {
    const { getNextBatch, nextBatchUrl } = this.props;
    getNextBatch(nextBatchUrl);
  };

  render() {
    const {
      schools,
      currentSelectedSchool,
      haveMoreSchools,
      schoolCount
    } = this.props;
    const { activeItemId } = this.state;
    const newItemLink = `${routes.schools}${routes.new}`;

    if (_.isNull(schools)) {
      return <LoadingMessage message="Fetching Schools..." />;
    }

    return (
      <div className="view-container school-view-container">
        <div className="action-buttons">
          <AddNewEntity
            entityType={permissionEntity.school}
            linkToAdd={newItemLink}
            hide={!!activeItemId}
          />
          <BackButton link={routes.schools} hide={!activeItemId} />
        </div>
        <div className="view-details">
          <div
            className={`view-details-list ${activeItemId ? 'hide' : 'show'}`}
          >
            <div className="view-search">
              <SearchBar
                onSearch={this.searchForSchools}
                placeholder={`Search from ${schoolCount} Schools...`}
              />
            </div>
            <div className="view-list-container school-list">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.fetchNextBatch}
                hasMore={haveMoreSchools}
                loader={
                  <div className="loader" key={0}>
                    Loading ...
                  </div>
                }
                useWindow={false}
              >
                {
                  <List
                    itemLayout="horizontal"
                    dataSource={schools.toIndexedSeq().toArray()}
                    renderItem={school => (
                      <SchoolItem
                        school={school}
                        activeItemId={activeItemId}
                        setActive={this.setActive}
                        isCurrentSelectedSchool={
                          currentSelectedSchool === school.id
                        }
                      />
                    )}
                  />
                }
              </InfiniteScroll>
            </div>
          </div>

          <div
            className={`view-details-container ${
              activeItemId ? 'show' : 'hide'
            }`}
          >
            <Switch>
              <Route
                exact
                path={`${routes.schools}${routes.new}`}
                component={AddEditSchoolContainer}
              />
              <Route
                exact
                path={`${routes.schools}/:schoolId${routes.edit}`}
                component={AddEditSchoolContainer}
              />
              <Route
                path={`${routes.schools}/:schoolId`}
                component={SchoolDetailsContainer}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

SchoolViewContainer.propTypes = {
  schools: ImmutablePropTypes.map,
  haveMoreSchools: PropTypes.bool,
  nextBatchUrl: PropTypes.string,
  getNextBatch: PropTypes.func.isRequired,
  getSchoolList: PropTypes.func.isRequired,
  searchSchool: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({})
  }).isRequired,
  currentSelectedSchool: PropTypes.string
};

SchoolViewContainer.defaultProps = {
  schools: null,
  haveMoreSchools: false,
  nextBatchUrl: null,
  currentSelectedSchool: null,
  schoolCount: null
};

function mapStateToProps(state) {
  const { schools, auth } = state;
  const schoolList = schools.get(LIST_STORE);
  const nextBatchUrl = schools.get(NEXT_BATCH_URL_STORE);
  const haveMoreSchools = !!nextBatchUrl;
  const currentSelectedSchool = auth.get('school');
  return {
    schools: schoolList,
    schoolCount: schools.get('totalCount'),
    currentSelectedSchool,
    haveMoreSchools,
    nextBatchUrl
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSchoolList: getSchoolListAction,
      getNextBatch: getNextBatchAction,
      searchSchool: getSchoolSearchAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchoolViewContainer);
