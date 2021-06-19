import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, Select } from 'antd';

import { LIST_STORE } from '../../helpers/stateUtils';
import AddEditClassroomContainer from './AddEditClassroomContainer';
import ClassroomDetailsContainer from './ClassroomDetailsContainer';
import {
  // getClassroomsListAction,
  getClassroomFilterAction,
} from '../../reducers/classrooms';
import { getSchoolGradesListAction, getDivisionsListAction } from '../../reducers/general';
import LoadingMessage from '../misc/LoadingMessage';
import permissionConfig from '../../constants/permission-config.json';
import routes from '../../constants/routes.json';
import PrivateRoute from '../routes/PrivateRoute';
import BackButton from '../misc/BackButton';
import AddNewEntity from '../core/AddNewEntity';
// import ChooseSchool from '../classrooms-v2/ChooseSchool';

const { Option } = Select;
const { entity: permissionEntity } = permissionConfig;

function ClassroomItem({ classroom, setActive, activeItemId }) {
  const {
    id,
    gradeDetails,
    divisionDetails,
    classroomTeachers,
  } = classroom;

  const { title: gradeTitle } = gradeDetails;
  const { title: divisionTitle } = divisionDetails;

  const teachers = classroomTeachers && classroomTeachers.length ?
    classroomTeachers.map((teacher) => {
      const { teacherName } = teacher;

      return teacherName;
    }).join(' | ') : 'No Teachers assigned';

  return (
    <List.Item className={`classroom-item view-list-item ${activeItemId === id ? 'active' : ''}`} onClick={() => setActive(id)}>
      <h2 className="classroom-name item-title">{ gradeTitle } - { divisionTitle }</h2>
      <div className="classroom-details item-details">
        <span>{ teachers }</span>
      </div>
    </List.Item>
  );
}

ClassroomItem.propTypes = {
  classroom: PropTypes.shape({
    gradeDetails: PropTypes.shape({}),
    divisionDetails: PropTypes.shape({}),
    teacherDetails: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  activeItemId: PropTypes.string,
  setActive: PropTypes.func,
};

ClassroomItem.defaultProps = {
  activeItemId: null,
  setActive: () => {},
};

class ClassroomsViewContainer extends Component {
  state = {
    activeItemId: null,
    filter: {
      grade: '',
      division: '',
    },
  }

  componentDidMount() {
    const {
      school,
    } = this.props;

    if (school) {
      this.fetchSchoolData(school.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;
    const schoolSelectedChanged = nextProps.school && nextProps.school !== this.props.school;

    if (schoolSelectedChanged) {
      this.fetchSchoolData(nextProps.school.id);
    }

    this.setState({
      activeItemId: id,
    });
  }

  setActive = (itemId) => {
    const url = `${routes.classrooms}/${itemId}`;
    this.props.history.push(url);
  }

  fetchSchoolData(schoolId) {
    const {
      grades, getDivisions, getGrades,
    } = this.props;

    this.filterClassrooms(schoolId);
    if (!grades || grades.size === 0) {
      getGrades();
    }
    getDivisions({ school: schoolId });
  }

  gradeFilterChanged(grade) {
    const newFilter = {
      grade,
    };
    const oldFilter = this.state.filter;
    this.setState({
      filter: {
        ...oldFilter,
        ...newFilter,
      },
    }, () => this.filterClassrooms());
  }

  divisionFilterChanged(division) {
    const newFilter = {
      division,
    };
    const oldFilter = this.state.filter;
    this.setState({
      filter: {
        ...oldFilter,
        ...newFilter,
      },
    }, () => this.filterClassrooms());
  }

  filterClassrooms(schoolId) {
    const { filter } = this.state;
    const filterData = {
      ...filter,
      school: schoolId || this.props.school.id,
    };
    this.props.filterClassrooms(filterData);
  }

  render() {
    const {
      classrooms,
      grades,
      divisions,
      school,
    } = this.props;
    const { activeItemId } = this.state;
    const newItemLink = `${routes.classrooms}${routes.new}`;

    if (_.isNull(school)) {
      return (
        <div className="view-container classroom-container">
          <LoadingMessage message="Fetching School..." />
        </div>
      );
    }

    if (_.isNull(classrooms)) {
      return <LoadingMessage message="Fetching Classrooms..." />;
    }

    return (
      <div className="view-container">
        <div className="action-buttons">
          <AddNewEntity
            entityType={permissionEntity.classroom}
            linkToAdd={newItemLink}
            hide={!!activeItemId}
          />
          <BackButton link={routes.classrooms} hide={!activeItemId} />
        </div>
        <div className="view-details">
          <div className={`view-details-list ${activeItemId ? 'hide' : 'show'}`}>
            <div className="view-search-filters">
              {/* <div className="view-search">
                  <Search onSearch={this.searchForSchools} placeholder="Search" />
                </div> */}
              <div
                className="view-filters"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '20px' }}>Filter By:</span>
                <Select defaultValue="" onChange={value => this.gradeFilterChanged(value)}>
                  <Option value="">All Grades</Option>
                  {
                      grades && grades.map(g =>
                        <Option key={g.id} value={g.id}>{g.title}</Option>)
                    }
                </Select>
                <Select defaultValue="" onChange={value => this.divisionFilterChanged(value)}>
                  <Option value="">All Divisions</Option>
                  {
                      divisions && divisions.map(d =>
                        <Option key={d.id} value={d.id}>{d.title}</Option>)
                    }
                </Select>
              </div>
            </div>
            <div className="view-list-container">
              {
                <List
                  itemLayout="horizontal"
                  dataSource={classrooms.toIndexedSeq().toArray()}
                  renderItem={classroom => (<ClassroomItem
                    classroom={classroom}
                    activeItemId={activeItemId}
                    setActive={this.setActive}
                  />)}
                />
              }
            </div>
          </div>

          <div className={`view-details-container ${activeItemId ? 'show' : 'hide'}`}>
            <Switch>
              <PrivateRoute exact path={`${routes.classrooms}${routes.new}`} component={AddEditClassroomContainer} school={this.props.school} />
              <PrivateRoute exact path={`${routes.classrooms}/:id${routes.edit}`} component={AddEditClassroomContainer} school={this.props.school} />
              <PrivateRoute path={`${routes.classrooms}/:id`} component={ClassroomDetailsContainer} school={this.props.school} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

ClassroomsViewContainer.propTypes = {
  school: PropTypes.shape({
    id: PropTypes.string,
  }),
  classrooms: ImmutablePropTypes.map,
  grades: ImmutablePropTypes.list,
  divisions: ImmutablePropTypes.list,
  // getClassrooms: PropTypes.func.isRequired,
  filterClassrooms: PropTypes.func.isRequired,
  // clearSearch: PropTypes.func.isRequired,
  getDivisions: PropTypes.func.isRequired,
  getGrades: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
    }),
  }).isRequired,
};

ClassroomsViewContainer.defaultProps = {
  school: null,
  classrooms: null,
  grades: null,
  divisions: null,
};

function mapStateToProps(state) {
  const {
    classrooms, general,
  } = state;
  // const currentSelectedSchool = auth.get('school');
  // const schoolList = schools.get(LIST_STORE);
  // const school = schoolList && schoolList.get(currentSelectedSchool);

  const grades = general.get('schoolGrades');
  const divisions = general.get('divisions');
  const classroomList = classrooms.get(LIST_STORE);
  return {
    classrooms: classroomList,
    grades,
    divisions,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // getClassrooms: getClassroomsListAction,
    filterClassrooms: getClassroomFilterAction,
    // clearSearch: getClearClassroomSearchAction,
    getDivisions: getDivisionsListAction,
    getGrades: getSchoolGradesListAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassroomsViewContainer);
