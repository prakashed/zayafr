import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Select } from 'antd';

import ViewContainer from '../core/ViewContainer';
import ManageLessonsInQuarter from './ManageLessonsInQuarter';
import QuarterPlans from './QuarterPlans';
import './ViewAnnualPlan.less';
import { DETAILS_STORE, ERROR_STORE } from '../../helpers/stateUtils';
import { getDetailsAction } from '../../reducers/annual-plans';
// import { getCreateNewAction as createNewPortionAction } from '../../reducers/portions';
import LoadingMessage from '../misc/LoadingMessage';
import { getClassroomNames, showNotification, checkIfUserIsTeacher, is404Error } from '../../helpers';
import { filterPortions, createNewPortion, updatePortion, deletePortion } from '../../apis/annual-lesson-plan-api';
import { sortPortionsIntoQuarters } from '../../helpers/annual-plan-helper';
import routes from '../../constants/routes.json';
import { filterInstrumentListByUser } from '../../apis/general-api';
import NotFoundError from '../misc/NotFoundError';

const { Option } = Select;

function AnnualPlanMeta({
  classrooms, instruments, school, instrumentChanged,
}) {
  return (
    <div className="annual-plan-meta">
      <div className="meta-info">
        <div className="label">School</div>
        <div className="data">{ school }</div>
      </div>
      <div className="meta-info">
        <div className="label">Class</div>
        <div className="data">{ classrooms }</div>
      </div>
      <div className="meta-info">
        <div className="label">Instrument</div>
        <div className="data">
          <Select
            defaultValue={instruments && instruments.length && instruments[0].id}
            placeholder="Select an instrument"
            style={{ width: 120 }}
            onChange={instrumentChanged}
          >
            {
              instruments.map(i => <Option key={i.id} value={i.id}>{i.title}</Option>)
            }
            {/* <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option> */}
          </Select>
        </div>
      </div>
    </div>
  );
}

AnnualPlanMeta.propTypes = {
  classrooms: PropTypes.string.isRequired,
  instruments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  school: PropTypes.string,
  instrumentChanged: PropTypes.func.isRequired,
};

AnnualPlanMeta.defaultProps = {
  school: 'Getting school name',
};

class ViewAnnualPlanContainer extends Component {
  static propTypes = {
    annualPlan: PropTypes.shape({
      id: PropTypes.string,
    }),
    errorInStore: PropTypes.shape({}),
    school: PropTypes.shape({
      id: PropTypes.string,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }).isRequired,
    getAnnualPlanDetails: PropTypes.func.isRequired,
    // createNewPortion: PropTypes.func.isRequired,
    userGroups: PropTypes.arrayOf(PropTypes.string).isRequired,
    userName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    annualPlan: null,
    errorInStore: null,
    school: null,
  }

  state = {
    manageLessonsModalVisible: false,
    addingLessonToQuarter: null,
    instrumentSelected: null,
    currentInstrumentCustomRecital: null,
    portionsMappedToQuarters: {},
    portions: [],
    canManageLessons: false,
    userIsTeacher: false,
    teacherInstruments: [],
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.getAnnualPlanDetails(id);

    const { userGroups } = this.props;
    const haveToGetInstrumentsForTeacher = checkIfUserIsTeacher(userGroups);
    if (haveToGetInstrumentsForTeacher) {
      this.setState({
        userIsTeacher: true,
      });
      this.getInstrumentsForTeacher();
    } else {
      this.setState({
        canManageLessons: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { annualPlan } = nextProps;
    const { id } = nextProps.match.params;
    const { id: oldId } = this.props.match.params;
    if (!annualPlan && id !== oldId) {
      this.props.getAnnualPlanDetails(id);
    }
    if (annualPlan) {
      const { instrumentCustomRecitals } = annualPlan;
      const firstInstrumentAndCustomRecital = instrumentCustomRecitals
       && _.values(instrumentCustomRecitals)[0];

      // if (!this.props.annualPlan
      //   && (!instrumentCustomRecitals || _.isEmpty(instrumentCustomRecitals))) {
      //   notification.error({
      //     message: 'Add recitals to the Annual Plan',
      //     description: 'To add lessons, annual plan needs to have recitals',
      //     duration: 0,
      //   });
      // }

      this.updateCurrentInstrumentCustomRecital(firstInstrumentAndCustomRecital);
      const { instrumentDetails: instrDetails } = firstInstrumentAndCustomRecital;
      const { id: instrumentId } = instrDetails;
      this.checkForTeacherPermission(instrumentId);
    }
  }

  getInstrumentsForTeacher = () => {
    const { userName } = this.props;
    filterInstrumentListByUser({ userName })
      .then((response) => {
        const { results: instruments } = response;
        const ids = instruments.map(i => i.id);
        this.setState({
          teacherInstruments: ids,
        });
      })
      .catch(() => {
      });
  }

  instrumentChanged = (instrumentId) => {
    const { annualPlan } = this.props;
    const { instrumentCustomRecitals } = annualPlan;
    const instrumentCustomRecital = instrumentCustomRecitals[instrumentId];
    this.updateCurrentInstrumentCustomRecital(instrumentCustomRecital);

    this.checkForTeacherPermission(instrumentId);
  }

  checkForTeacherPermission = (instrumentId) => {
    const { userIsTeacher, teacherInstruments } = this.state;
    if (userIsTeacher) {
      const canTeachThisInstrument = teacherInstruments.indexOf(instrumentId) > -1;
      this.setState({
        canManageLessons: canTeachThisInstrument,
      });
    }
  }

  updateCurrentInstrumentCustomRecital = (instrumentCustomRecital) => {
    const { instrumentSelected } = this.state;
    if (!instrumentCustomRecital) return;
    const { instrumentDetails: instrDetails } = instrumentCustomRecital;
    const { id: instrumentId } = instrDetails;
    if (instrumentSelected
      && instrumentSelected === instrumentId) return;

    this.setState({
      currentInstrumentCustomRecital: instrumentCustomRecital,
      instrumentSelected: instrumentId,
    }, () => {
      const { instrumentDetails } = instrumentCustomRecital;
      const { annualPlan } = this.props;
      const { id: annualPlanId } = annualPlan;
      this.fetchPortions({ annualPlanId, instrumentId: instrumentDetails.id });
    });
  }

  fetchPortions = ({ annualPlanId, instrumentId }) => {
    showNotification({ text: 'Getting portions..', type: 'loading' });
    filterPortions({ annualPlanId, instrumentId })
      .then((response) => {
        const { results } = response;
        const mappedPortionsAccordingToQuarters = sortPortionsIntoQuarters(results);
        // const { portions } = this.state;
        this.setState({
          portionsMappedToQuarters: mappedPortionsAccordingToQuarters,
          portions: results,
        });
      })
      .catch(() => {
        showNotification({ text: 'Something went wrong!', type: 'error' });
        // console.error('Error while fetching portions --> ', error);
      });
  }

  toggleManageLessonsForQuarter = (payload) => {
    const { manageLessonsModalVisible } = this.state;
    this.setState({
      manageLessonsModalVisible: !manageLessonsModalVisible,
      addingLessonToQuarter: payload && payload.quarter,
    });
  }

  updateLessons = ({ lessonIds, customRecitalId, recitalId }) => {
    if (!recitalId) return;
    // const { createNewPortion } = this.props;
    const { addingLessonToQuarter, portionsMappedToQuarters } = this.state;
    const quarterId = addingLessonToQuarter.id;
    const quarterPortionData = portionsMappedToQuarters[quarterId];

    // check if we have to update a portion or create a portion
    // portion is for a quarter comprising of a recital for one instrument
    // so check if we already have some portion in the quarter
    // then check if for that quarter, do we have some portion for a particular recital

    // USE recitalId to check the recital
    // if we have some portion for that recital, then update the portion
    // else create a new portion for a recital, instrument inside one quarter
    if (quarterPortionData) {
      const { recitalToLessonMapper, portions: portionInQuarter } = quarterPortionData;
      if (recitalToLessonMapper[recitalId]) {
        // Find the portion for that recital
        const filteredPortion = portionInQuarter.filter((p) => {
          const { customRecitalDetails } = p;
          const { recital } = customRecitalDetails;
          return recital === recitalId;
        });

        const portion = filteredPortion && filteredPortion[0];
        if (!portion) {
          return;
        }

        showNotification({ text: 'Updating Portion..', type: 'loading' });
        updatePortion({ ...portion, lessons: lessonIds })
          .then((updatedPortion) => {
            showNotification({ text: 'Updated!', type: 'success' });
            const { portions } = this.state;
            const portionPos = portions.findIndex(p => p.id === updatedPortion.id);
            if (portionPos > -1) {
              const newPortions = [
                ...portions.slice(0, portionPos),
                updatedPortion,
                ...portions.slice(portionPos + 1),
              ];
              const mappedPortionsAccordingToQuarters = sortPortionsIntoQuarters(newPortions);
              this.setState({
                portionsMappedToQuarters: mappedPortionsAccordingToQuarters,
                portions: newPortions,
              });
            }
          })
          .catch(() => {
            showNotification({ text: 'Something went wrong!', type: 'error' });
            // console.error('Error while creating new portion --> ', error);
          });
        return;
      }
    }

    // If we reached here, then need to create a new portion
    if (lessonIds && lessonIds.length) {
      const payload = {
        customRecital: customRecitalId,
        timeUnit: quarterId,
        lessons: lessonIds,
      };
      this.createNewPortion(payload);
    }
  }

  createNewPortion = (payload) => {
    showNotification({ text: 'Adding new portion..', type: 'loading' });
    // Else create a new portion for this quarter
    createNewPortion(payload)
      .then((response) => {
        // console.log('created new portion --> ', response);
        showNotification({ text: 'Added!', type: 'success' });
        const { portions } = this.state;
        const newPortions = [...portions, response];
        const mappedPortionsAccordingToQuarters = sortPortionsIntoQuarters(newPortions);
        this.setState({
          portions: newPortions,
          portionsMappedToQuarters: mappedPortionsAccordingToQuarters,
        });
      })
      .catch(() => {
        showNotification({ text: 'Something went wrong!', type: 'error' });
        // console.error('Error while creating new portion --> ', error);
      });
  }

  deletePortion = (portionId) => {
    showNotification({ text: 'Deleting Portion..', type: 'loading' });
    deletePortion(portionId)
      .then(() => {
        showNotification({ text: 'Deleted!', type: 'success' });
        const { portions } = this.state;
        const pos = portions.findIndex(p => p.id === portionId);
        if (pos > -1) {
          const remainingPortions = [...portions.slice(0, pos), ...portions.slice(pos + 1)];
          const mappedPortionsAccordingToQuarters = sortPortionsIntoQuarters(remainingPortions);
          this.setState({
            portionsMappedToQuarters: mappedPortionsAccordingToQuarters,
            portions: remainingPortions,
          });
        }
      })
      .catch(() => {
        showNotification({ text: 'Something went wrong!', type: 'error' });
        // console.error('Error while deleting portion --> ', error);
      });
  }

  render() {
    const { annualPlan, school, errorInStore } = this.props;

    if (!annualPlan && is404Error(errorInStore)) return <NotFoundError message="Annual Plan not found" />;

    if (_.isNull(annualPlan)) {
      return (
        <ViewContainer>
          <LoadingMessage message="Fetching Annual Plan.." />
        </ViewContainer>
      );
    }

    const {
      timeUnitDetails, customRecitalDetails, classroomDetails, instrumentCustomRecitals,
    } = annualPlan;

    // If there are no timeunits or recital details added redirect to details page
    if (!timeUnitDetails || !timeUnitDetails.length
       || !customRecitalDetails || !customRecitalDetails.length) {
      return (<Redirect to={`${routes.annual_plans}/${annualPlan.id}`} />);
    }

    const {
      manageLessonsModalVisible,
      addingLessonToQuarter,
      currentInstrumentCustomRecital,
      portionsMappedToQuarters,
      canManageLessons,
    } = this.state;

    // const { classroomDetails, instrumentCustomRecitals, timeUnitDetails } = annualPlan;
    const classrooms = getClassroomNames(classroomDetails);
    const instrumentList = _.values(instrumentCustomRecitals).map(i => i.instrumentDetails);

    return (
      <ViewContainer className="view-annual-plan">
        <AnnualPlanMeta
          classrooms={classrooms}
          instruments={instrumentList}
          school={school && school.title}
          instrumentChanged={this.instrumentChanged}
        />
        <QuarterPlans
          quarterPlans={timeUnitDetails}
          portionToQuarters={portionsMappedToQuarters}
          manageLessons={this.toggleManageLessonsForQuarter}
          canManageLessons={canManageLessons}
          deletePortion={this.deletePortion}
        />
        <ManageLessonsInQuarter
          showModal={manageLessonsModalVisible}
          toggleShowModal={this.toggleManageLessonsForQuarter}
          quarter={addingLessonToQuarter}
          instrumentCustomRecital={currentInstrumentCustomRecital}
          updateLessons={this.updateLessons}
          portionsAlreadyAdded={portionsMappedToQuarters}
        />
      </ViewContainer>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { id } = ownProps.match.params;
  const { annualLessonPlans, auth } = state;
  const annualPlanDetails = annualLessonPlans.get(DETAILS_STORE);
  const errorInStore = annualLessonPlans.get(ERROR_STORE);
  const annualPlan = annualPlanDetails && annualPlanDetails.get(id);
  const userGroups = auth.get('role');
  const userName = auth.get('userName');

  return {
    annualPlan,
    userGroups,
    userName,
    errorInStore,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAnnualPlanDetails: getDetailsAction,
    // createNewPortion: createNewPortionAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAnnualPlanContainer);
