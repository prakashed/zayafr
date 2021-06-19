import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Select } from 'antd';

import UnitLessonTree from './UnitLessonTree';
import { DETAILS_STORE } from '../../helpers/stateUtils';
import { getRecitalsDetailsAction } from '../../reducers/recitals';
import { getLessonIdsFromCheckedNodesOfUnitLessonTree } from '../../helpers';

const { Option } = Select;

function getUnitsForInstrument({ recital, instrumentId }) {
  // console.log('getting units for recital, instrument ==> ', recital, instrumentId);
  if (!recital || !instrumentId) return null;

  const { recitalUnits } = recital;
  if (!recitalUnits) return null;
  const recitalUnit = recitalUnits.find(r => r.id === instrumentId);
  if (!recitalUnit) return null;
  const { unitDetails } = recitalUnit;
  return unitDetails;
}

class ManageLessonsInQuarter extends Component {
  static propTypes = {
    showModal: PropTypes.bool,
    quarter: PropTypes.shape({}),
    instrumentCustomRecital: PropTypes.shape({}),
    toggleShowModal: PropTypes.func,
    recitalDetails: ImmutablePropTypes.map,
    getRecitalDetails: PropTypes.func.isRequired,
    updateLessons: PropTypes.func.isRequired,
    portionsAlreadyAdded: PropTypes.shape({}),
  }

  static defaultProps = {
    showModal: false,
    quarter: null,
    instrumentCustomRecital: null,
    toggleShowModal: () => {},
    recitalDetails: null,
    portionsAlreadyAdded: null,
  }

  state = {
    currentRecital: null,
    selectedLessons: [],
  }

  // componentWillReceiveProps(nextProps) {
  //   const { instrumentCustomRecital, showModal, recitalDetails } = nextProps;
  //   const { customRecitals } = instrumentCustomRecital;
  //   const { recital: recitalId } = customRecitals[0];
  //   if (!showModal) return;

  //   const recital = recitalDetails && recitalDetails.get(`${recitalId}`);
  //   this.updateCurrentRecital({ id: recitalId, recital });
  // }

  setCurrentRecital = (recitalId) => {
    const { recitalDetails } = this.props;
    const recital = recitalDetails && recitalDetails.get(`${recitalId}`);
    this.updateCurrentRecital({ id: recitalId, recital });
  }

  resetState = () => {
    this.setState({
      currentRecital: null,
      selectedLessons: [],
    });
  }

  findPreSelectedAndDisabledLessons = ({ recitalId }) => {
    const { portionsAlreadyAdded, quarter } = this.props;
    const { id: currentQuarter } = quarter;
    let preSelectedLessons = [];
    let disabledLessons = [];
    const quarterIds = _.keys(portionsAlreadyAdded);
    for (let i = 0; i < quarterIds.length; i += 1) {
      const quartedId = quarterIds[i];
      const lessons = portionsAlreadyAdded[quartedId].recitalToLessonMapper[recitalId];
      if (lessons) {
        if (currentQuarter === quartedId) {
          preSelectedLessons = lessons;
        } else {
          disabledLessons = [...disabledLessons, ...lessons];
        }
      }
    }

    return {
      preSelectedLessons,
      disabledLessons,
    };
  }

  updateCurrentRecital = ({ id, recital }) => {
    this.setState({
      currentRecital: id,
    }, () => {
      if (!recital) {
        this.fetchRecitalDetails(id);
      }
    });
  }

  fetchRecitalDetails() {
    const { currentRecital } = this.state;
    const { getRecitalDetails } = this.props;
    getRecitalDetails(currentRecital);
  }

  lessonChecked = (checkedKeys) => {
    const lessonIds = getLessonIdsFromCheckedNodesOfUnitLessonTree(checkedKeys);
    // const lessonNodes = checkedKeys.filter(k => k.indexOf('LESSON') > -1);
    // const lessonIds = lessonNodes.map((node) => {
    //   const temp = node.split('-');
    //   const lessonId = temp[temp.length - 1];
    //   return parseInt(lessonId, 10);
    // });
    this.setState({
      selectedLessons: lessonIds,
    });
  }

  handleOk = (haveUnits) => {
    const { updateLessons, toggleShowModal, instrumentCustomRecital } = this.props;
    const { selectedLessons, currentRecital } = this.state;
    if (currentRecital && haveUnits) {
      const { customRecitals } = instrumentCustomRecital;
      const customRecital = customRecitals.find(c => c.recital === currentRecital);
      updateLessons({
        lessonIds: selectedLessons,
        customRecitalId: customRecital.id,
        recitalId: currentRecital,
      });
    }
    this.resetState();
    toggleShowModal();
  }

  handleCancel = () => {
    this.resetState();
    this.props.toggleShowModal();
  }

  render() {
    const {
      showModal, quarter, instrumentCustomRecital, recitalDetails,
    } = this.props;

    if (!instrumentCustomRecital) {
      // notification.error({
      //   message: 'Add recitals to the Annual Plan',
      //   description: 'To add lessons, annual plan needs to have recitals',
      //   duration: 0,
      // });
      return '';
    }

    const { customRecitals, instrumentDetails } = instrumentCustomRecital;

    const { currentRecital } = this.state;

    const recital = recitalDetails && recitalDetails.get(`${currentRecital}`);
    const recitalFetched = !!recital;

    let units = null;
    let lessonsAlreadySelected = [];
    let lessonsNotToBeTouched = [];

    if (recitalFetched && showModal) {
      units = getUnitsForInstrument({
        recital,
        instrumentId: instrumentDetails.id,
      });

      const { preSelectedLessons, disabledLessons } =
        this.findPreSelectedAndDisabledLessons({ recitalId: currentRecital });
      lessonsAlreadySelected = preSelectedLessons;
      lessonsNotToBeTouched = disabledLessons;
    }

    return (
      <Modal
        title={`Manage ${instrumentDetails.title} Lessons in: ${quarter && quarter.title}`}
        visible={showModal}
        onOk={() => this.handleOk(units && units.length > 0)}
        onCancel={this.handleCancel}
        okText="Ok"
        className="manage-lessons-in-quarter"
        destroyOnClose
      >
        <div className="recital-selection">
          <div className="label">Select a Recital</div>
          <Select placeholder="Select a Recital" onChange={this.setCurrentRecital}>
            {
              customRecitals.map(c =>
                <Option key={c.id} value={c.recital}>{ c.recitalName }</Option>)
            }
          </Select>
        </div>
        <div className="unit-selection">
          {recitalFetched && (<UnitLessonTree
            units={units}
            addingLesson
            onCheck={this.lessonChecked}
            preSelectedLessons={lessonsAlreadySelected}
            disabledLessons={lessonsNotToBeTouched}
          />)}

          {
            currentRecital && !recitalFetched && (
              <p>Fetching Recital..</p>
            )
          }
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { recitals } = state;
  const recitalDetails = recitals.get(DETAILS_STORE);

  return {
    recitalDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getRecitalDetails: getRecitalsDetailsAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageLessonsInQuarter);
