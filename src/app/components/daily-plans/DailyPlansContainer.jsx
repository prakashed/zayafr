import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, List, Select, DatePicker } from 'antd';

import ViewContainer from '../core/ViewContainer';
import AddNewEntity from '../core/AddNewEntity';
import ViewDetails from '../core/ViewDetails';
import ViewDetailsList from '../core/ViewDetailsList';
import ViewDetailsContainer from '../core/ViewDetailsContainer';
import SwitchViewDetails from '../core/SwitchViewDetails';
import routes from '../../constants/routes.json';
import DailyPlanDetailsContainer from './DailyPlanDetailsContainer';
import AddEditDailyPlanContainer from './AddEditDailyPlanContainer';
import BackButton from '../misc/BackButton';
import { LIST_STORE } from '../../helpers/stateUtils';
import { getListAction, getSearchAction } from '../../reducers/daily-plans';
import LoadingMessage from '../misc/LoadingMessage';
import InstrumentTag from '../misc/InstrumentTag';
import ClassroomsTitle from '../misc/ClassroomsTitle';

import './DailyPlan.less';
import ViewListItem from '../core/ViewListItem';
import { getClassroomsListAction } from '../../reducers/classrooms';
import { getInstrumentsListAction } from '../../reducers/general';
import { DATE_FORMAT } from '../../constants/config';
import { cleanUpFilterObj, checkIfUserIsTeacher } from '../../helpers';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity } = permissionConfig;

const { Option } = Select;

const DailyPlan = ({ item: dailyPlan }) => {
  const { title, instrumentDetails, classroomsDetails, isComplete } = dailyPlan;

  return (
    <div className={`daily-plan-item ${isComplete ? 'completed' : ''}`}>
      <div className="details">
        <h2 className="item-title">{title}</h2>
        <div className="item-details">
          <InstrumentTag instrument={instrumentDetails} />
          <ClassroomsTitle classrooms={classroomsDetails} />
        </div>
      </div>
      {isComplete ? (
        <Icon className="completed-icon" type="check-circle" />
      ) : (
        ''
      )}
    </div>
  );
};

DailyPlan.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    instrumentDetails: PropTypes.shape({}),
    classroomsDetails: PropTypes.arrayOf(PropTypes.shape({})),
    isComplete: PropTypes.bool
  }).isRequired
};

const DailyPlanList = ({ dailyPlans, setActive, activeItem }) => (
  <List
    itemLayout="horizontal"
    dataSource={dailyPlans.toIndexedSeq().toArray()}
    renderItem={item => (
      <ViewListItem item={item} setActive={setActive} activeItem={activeItem}>
        <DailyPlan item={item} />
      </ViewListItem>
    )}
  />
);

DailyPlanList.propTypes = {
  dailyPlans: ImmutablePropTypes.orderedMap.isRequired,
  setActive: PropTypes.func,
  activeItem: PropTypes.string
};

DailyPlanList.defaultProps = {
  setActive: () => {},
  activeItem: ''
};

class DailyPlansContainer extends Component {
  static propTypes = {
    school: PropTypes.shape({
      id: PropTypes.string
    }),
    dailyPlans: ImmutablePropTypes.map,
    match: PropTypes.shape({
      params: PropTypes.shape({})
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    getDailyPlans: PropTypes.func.isRequired,
    getClassrooms: PropTypes.func.isRequired,
    getInstruments: PropTypes.func.isRequired,
    classrooms: PropTypes.arrayOf(PropTypes.shape({})),
    instruments: ImmutablePropTypes.list,
    searchDailyPlans: PropTypes.func.isRequired,
    userGroups: PropTypes.arrayOf(PropTypes.string).isRequired,
    username: PropTypes.string.isRequired
  };

  static defaultProps = {
    school: null,
    dailyPlans: null,
    classrooms: null,
    instruments: null
  };

  state = {
    activeItem: null,
    filter: {},
    userIsTeacher: false
  };

  componentWillMount() {
    const { school, userGroups } = this.props;
    this.fetchData({ school, userGroups });
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;

    const schoolSelectedChanged =
      nextProps.school && nextProps.school !== this.props.school;

    if (schoolSelectedChanged) {
      const { school } = nextProps;
      const { userGroups } = nextProps;
      this.fetchData({ school, userGroups });
    }

    this.setState({
      activeItem: id
    });
  }

  setActive = id => {
    const url = `${routes.daily_plans}/${id}`;
    this.props.history.push(url);
  };

  fetchData = ({ school, userGroups }) => {
    if (!school) return;
    const { id: schoolId } = school;

    const userIsTeacher = checkIfUserIsTeacher(userGroups);
    this.setState({ userIsTeacher });

    if (userIsTeacher) {
      const { teacherDetails } = school;
      const { username } = this.props;
      const teacher = teacherDetails.find(
        t => t.userDetails.username === username
      );
      const { id } = teacher;
      // const { id: userId } = userDetails;
      // This function will fetch daily plans for just this userId
      this.teacherFilterChanged(id);
      this.props.getInstruments({ teachers__user__username: username });
      this.props.getClassrooms({
        school: schoolId,
        teachers__user__username: username
      });
    } else {
      this.props.getInstruments();
      this.props.getClassrooms({ school: schoolId });
      this.props.getDailyPlans({ school: schoolId });
    }
  };

  teacherFilterChanged = userRoleAccountId => {
    const { filter } = this.state;
    const newFilter = { ...filter, assigned_to: userRoleAccountId };
    this.filterUpdated(newFilter);
  };

  dateFilterChanged = dateMoment => {
    const { filter } = this.state;
    const date = dateMoment ? dateMoment.format(DATE_FORMAT) : '';
    const newFilter = { ...filter, date };
    this.filterUpdated(newFilter);
  };

  instrumentFilterChanged = instrument => {
    const { filter } = this.state;
    const newFilter = { ...filter, instrument };
    this.filterUpdated(newFilter);
  };

  classroomFilterChanged = classrooms => {
    const { filter } = this.state;
    const newFilter = { ...filter, classrooms };
    this.filterUpdated(newFilter);
  };

  filterUpdated = newFilter => {
    const filter = cleanUpFilterObj(newFilter);
    this.setState({ filter }, () => {
      this.filterDailyPlans();
    });
  };

  filterDailyPlans = () => {
    const { filter } = this.state;
    const { school } = this.props;
    const { id: schoolId } = school;
    this.props.searchDailyPlans({ ...filter, school: schoolId });
  };

  filterByTeacher = () => {
    const { school } = this.props;
    const teachers = school && school.teacherDetails;
    // const teachers = [{ id: 1, title: 'Teacher A' }, { id: 2, title: 'Teacher B' }];
    return (
      <Select defaultValue="" onChange={this.teacherFilterChanged}>
        <Option value="">All Teachers</Option>
        {teachers.map(t => (
          <Option value={t.id} key={t.user}>
            {t.userDetails.firstName}&nbsp;{t.userDetails.lastName}
          </Option>
        ))}
      </Select>
    );
  };

  filterByDate = () => <DatePicker onChange={this.dateFilterChanged} />;

  filterByInstrument = () => {
    const { instruments } = this.props;
    return (
      <Select defaultValue="" onChange={this.instrumentFilterChanged}>
        <Option value="">All Instruments</Option>
        {instruments &&
          instruments.map(t => (
            <Option value={t.id} key={t.id}>
              {t.title}
            </Option>
          ))}
      </Select>
    );
  };

  filterByClass = () => {
    const { classrooms } = this.props;
    return (
      <Select defaultValue="" onChange={this.classroomFilterChanged}>
        <Option value="">All Classes</Option>
        {classrooms &&
          classrooms.map(c => (
            <Option value={c.id} key={c.id}>
              {c.gradeDetails.title} {c.divisionDetails.title}
            </Option>
          ))}
      </Select>
    );
  };

  renderFilters = () => {
    const { userIsTeacher } = this.state;
    return (
      <div className="daily-plan-filters">
        <div>
          {!userIsTeacher && this.filterByTeacher()}
          {this.filterByDate()}
        </div>
        <div>
          {this.filterByInstrument()}
          {this.filterByClass()}
        </div>
      </div>
    );
  };

  renderOtherDailyPlans = () => {
    const { dailyPlans } = this.props;
    const { activeItem } = this.state;

    const otherDailyPlans = dailyPlans.filter(d => !d.isToday);

    if (otherDailyPlans.size) {
      return (
        <Fragment>
          <div className="list-title">Other</div>
          <DailyPlanList
            dailyPlans={otherDailyPlans}
            setActive={this.setActive}
            activeItem={activeItem}
          />
        </Fragment>
      );
    }

    return '';
  };

  renderTodaysDailyPlans = () => {
    const { dailyPlans } = this.props;
    const { activeItem } = this.state;

    const todaysDailyPlans = dailyPlans.filter(d => d.isToday);

    if (todaysDailyPlans.size) {
      return (
        <Fragment>
          <div className="list-title">Today</div>
          <DailyPlanList
            dailyPlans={todaysDailyPlans}
            setActive={this.setActive}
            activeItem={activeItem}
          />
        </Fragment>
      );
    }

    return '';
  };

  renderNoDailyPlansMessage = () => {
    const { dailyPlans } = this.props;

    if (dailyPlans.size === 0) {
      return <div>No Daily Plans found!</div>;
    }

    return '';
  };

  render() {
    const { activeItem } = this.state;
    const { dailyPlans, school } = this.props;

    const newItemLink = `${routes.daily_plans}${routes.new}`;

    if (_.isNull(school)) {
      return <LoadingMessage message="Fetching School..." />;
    }

    if (_.isNull(dailyPlans)) {
      return <LoadingMessage message="Fetching Daily Plans..." />;
    }

    return (
      <ViewContainer>
        <div className="action-buttons">
          <AddNewEntity
            entityType={permissionEntity.dailyPlans}
            linkToAdd={newItemLink}
            hide={!!activeItem}
          />
          <BackButton link={routes.daily_plans} hide={!activeItem} />
        </div>
        <ViewDetails>
          <ViewDetailsList hide={!!activeItem}>
            <div className="view-search-filters">
              <div
                className="view-filters"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: '20px' }}>Filter By:</span>
                {this.renderFilters()}
              </div>
            </div>
            <div className="view-list-container">
              {this.renderTodaysDailyPlans()}
              {this.renderOtherDailyPlans()}
              {this.renderNoDailyPlansMessage()}
            </div>
          </ViewDetailsList>
          <ViewDetailsContainer hide={!activeItem}>
            <SwitchViewDetails
              routeSubdomain={routes.daily_plans}
              AddEditComponent={AddEditDailyPlanContainer}
              DetailsComponent={DailyPlanDetailsContainer}
            />
          </ViewDetailsContainer>
        </ViewDetails>
      </ViewContainer>
    );
  }
}

function mapStateToProps(state) {
  const { dailyPlans, classrooms, general, auth } = state;
  const dailyPlansList = dailyPlans.get(LIST_STORE);
  const classroomList = classrooms.get(LIST_STORE);
  const instruments = general.get('instruments');
  const userGroups = auth.get('role');
  const username = auth.get('userName');
  return {
    dailyPlans: dailyPlansList,
    classrooms: classroomList && classroomList.toIndexedSeq().toArray(),
    instruments,
    userGroups,
    username
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDailyPlans: getListAction,
      searchDailyPlans: getSearchAction,
      getClassrooms: getClassroomsListAction,
      getInstruments: getInstrumentsListAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyPlansContainer);
