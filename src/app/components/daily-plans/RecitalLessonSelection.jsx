import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, Steps, Button } from 'antd';
import _ from 'lodash';

import './RecitalLessonSelection.less';
import { fetchTimeUnitsForAnnualPlan, filterPortionsByQuarters } from '../../apis/annual-lesson-plan-api';
import UnitLessonTree from '../annual-plans/UnitLessonTree';
import { getLessonIdsFromCheckedNodesOfUnitLessonTree } from '../../helpers';
import LessonAssessmentActivityTable from './LessonAssessmentActivityTable';

const { Option } = Select;
const { Step } = Steps;

// function generateIdForLessonPlan() {
//   const randomInt = Math.floor(Math.random() * 255);
//   return `LESSON-PLAN-${randomInt}`;
// }

// function checkIfLessonDataIsComplete(lessonData) {
//   const data = _.values(lessonData);
//   for (let i = 0; i < data.length; i += 1) {
//     const lesson = data[i];
//     const { activity, assessment } = lesson;
//     if (activity === null || assessment.length === 0) return false;
//   }

//   return true;
// }

const initialState = {
  currentStep: 0,
  steps: [{
    title: 'Select Lessons',
  }, {
    title: 'Activity & Assessment',
  }],
  selectedQuarter: null,
  selectedPortion: null,
  quarters: [],
  portions: [],
  selectedLessons: [],
  fetchingQuarters: false,
  fetchingPortions: false,
  errorInFetchingQuarters: false,
  errorInFetchingPortions: false,
  lessonData: {},
  // submitLessonDataDisabled: true,
  submitLessonDataDisabled: false,
};

class RecitalLessonSelection extends Component {
  state = initialState

  getInitialState = () => initialState

  componentWillReceiveProps(nextProps) {
    const { annualPlan, visible } = nextProps;
    const modalIsNowVisible = visible && !this.props.visible;
    const annualPlanIsChanged = annualPlan && annualPlan !== this.props.annualPlan;
    if (modalIsNowVisible || annualPlanIsChanged) {
      this.fetchQuarters(annualPlan);
    }
  }

  getContentForSelectLessons = () => (
    <div className="step-1">
      { this.renderQuarters() }
      { this.renderRecitals() }
      { this.renderPortionTree() }
    </div>
  )

  getContentForLessonTable = () => {
    const recitalName = this.getRecitalNameOfSelectedPortion();
    const lessonDetails = this.getSelectedLessonsDetails();
    return (
      <div className="step-2">
        <div className="recital-name">Recital: {recitalName}</div>
        {
          lessonDetails &&
          <LessonAssessmentActivityTable
            lessons={lessonDetails}
            lessonDataUpdated={this.lessonDataUpdated}
            lessonData={this.state.lessonData}
          />
        }
        {!lessonDetails && <span>No Lessons Added</span>}
      </div>
    );
  }

  getRecitalNameOfSelectedPortion = () => {
    const { selectedPortion, portions } = this.state;
    const portion = portions.find(p => p.id === selectedPortion);

    if (!portion) return 'No Portion Selected';

    const { customRecitalDetails } = portion;
    const { recitalName } = customRecitalDetails;
    return recitalName;
  }

  getSelectedLessonsDetails = () => {
    const { selectedPortion, selectedLessons, portions } = this.state;
    const selectedLessonIds = new Set(selectedLessons);

    const portion = portions.find(p => p.id === selectedPortion);

    if (!portion) return 'No Portion Selected';

    const { unitCategoryDetails } = portion;

    const lessonDetails = unitCategoryDetails.reduce((lessonsArray, unit) => {
      const { categories } = unit;

      let lessonsInUnitWhichAreSelected = [];

      categories.forEach((category) => {
        const { lessons } = category;

        const lessonsWhichAreSelected = lessons.filter(l => selectedLessonIds.has(l.id));

        lessonsInUnitWhichAreSelected = [
          ...lessonsInUnitWhichAreSelected,
          ...lessonsWhichAreSelected,
        ];
      });

      return [...lessonsArray, ...lessonsInUnitWhichAreSelected];
    }, []);

    return lessonDetails;
  }

  getStepContent = () => {
    const { currentStep } = this.state;

    switch (currentStep) {
      case 0:
        return this.getContentForSelectLessons();
      case 1:
        return this.getContentForLessonTable();
      default:
        return this.getContentForSelectLessons();
    }
  }

  getFooter = () => {
    const {
      currentStep, steps, selectedLessons, submitLessonDataDisabled,
    } = this.state;
    const noOfSteps = steps.length - 1;
    if (currentStep === noOfSteps) {
      return (
        <Fragment>
          <Button onClick={this.goBackStep}>Back</Button>
          <Button type="primary" disabled={submitLessonDataDisabled} onClick={this.submitLessonSelection}>Submit</Button>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Button onClick={this.hideModal}>Cancel</Button>
        <Button type="primary" onClick={this.goNextStep} disabled={selectedLessons.length === 0}>Next</Button>
      </Fragment>
    );
  }

  lessonDataUpdated = (lessonData) => {
    // const dataComplete = checkIfLessonDataIsComplete(lessonData);
    // Let by default data complete as true
    const dataComplete = true;
    this.setState({ lessonData, submitLessonDataDisabled: !dataComplete });
  };

  goBackStep = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep - 1 });
  }

  goNextStep = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  }

  submitLessonSelection = () => {
    const { lessonData, selectedPortion, portions } = this.state;
    const lessonsList = _.values(lessonData);
    const toDoList = lessonsList.map(l => ({ ...l, id: l.lesson.id }));
    const portion = portions.find(p => p.id === selectedPortion);
    const { recitalName, recital: recitalId } = portion.customRecitalDetails;
    const newLessonPlan = {
      id: `${recitalId}`,
      lessons: toDoList,
      portion: selectedPortion,
      recitalName,
      recital: `${recitalId}`,
    };
    this.props.onOk(newLessonPlan);
    this.resetState();
  }

  hideModal = () => {
    this.props.onCancel();
    this.resetState();
  }

  fetchQuarters = (annualPlan) => {
    this.setState({ fetchingQuarters: true });
    // fetch Quarters (Time Units) for the Annual Plan
    fetchTimeUnitsForAnnualPlan(annualPlan)
      .then((response) => {
        const { results } = response;
        this.setState({ quarters: results, errorInFetchingQuarters: false });
      })
      .catch(() => this.setState({ errorInFetchingQuarters: true }))
      .finally(() => this.setState({ fetchingQuarters: false }));
  }

  quarterSelected = (quarterId) => {
    this.fetchPortionsForQuarter(quarterId);

    this.setState({
      selectedQuarter: quarterId,
    });
  };

  fetchPortionsForQuarter = (quarterId) => {
    const { instrumentId } = this.props;

    this.setState({ fetchingPortions: true, selectedPortion: null, selectedLessons: [] });

    filterPortionsByQuarters({ quarterId, instrumentId })
      .then((response) => {
        const { results: portions } = response;
        this.setState({ portions });
      })
      .catch(() => this.setState({ errorInFetchingPortions: true }))
      .finally(() => this.setState({ fetchingPortions: false }));
  }

  portionSelected = portionId => this.setState({ selectedPortion: portionId, selectedLessons: [] });

  lessonChecked = (checkedKeys) => {
    const lessonIds = getLessonIdsFromCheckedNodesOfUnitLessonTree(checkedKeys);
    const { addedLessonIds } = this.props;
    const addedLessonsSet = new Set(addedLessonIds);
    const afterRemovingPreSelectedLessons = lessonIds.filter(id => !addedLessonsSet.has(id));
    // const lessonNodes = checkedKeys.filter(k => k.indexOf('LESSON') > -1);
    // const lessonIds = lessonNodes.map((node) => {
    //   const temp = node.split('-');
    //   const lessonId = temp[temp.length - 1];
    //   return parseInt(lessonId, 10);
    // });
    this.setState({
      selectedLessons: afterRemovingPreSelectedLessons,
    });
  }

  resetState = () => this.setState(this.getInitialState())

  renderErrorMessage = errorMessage => (
    <div className="error-message">
      { errorMessage || 'Something went wrong!'}
    </div>
  )

  renderQuarters = () => {
    const {
      quarters, selectedQuarter, fetchingQuarters, errorInFetchingQuarters,
    } = this.state;

    if (errorInFetchingQuarters) return this.renderErrorMessage('Something went wrong in fetching quarters');

    if (fetchingQuarters) {
      return (
        <div className="select-container">
          <span>Fetching Quarters...</span>
        </div>
      );
    }

    return (
      <div className="select-container">
        <span className="label">Select a quarter</span>
        <Select
          onChange={this.quarterSelected}
          value={selectedQuarter || ''}
          placeholder="Select a quarter"
          className="select-dropdown quarters-selection"
        >
          {
            quarters.map(q => <Option key={q.id} value={q.id}>{ q.title }{ ` (${q.fromDate} - ${q.toDate})` }</Option>)
          }
        </Select>
      </div>
    );
  }

  renderRecitals = () => {
    const {
      selectedQuarter, fetchingPortions, errorInFetchingPortions, portions, selectedPortion,
    } = this.state;

    if (!selectedQuarter) return '';

    if (errorInFetchingPortions) return this.renderErrorMessage('Something went wrong in fetching portions');

    if (fetchingPortions) {
      return (
        <div className="select-container">
          <span>Fetching Portions...</span>
        </div>
      );
    }

    return (
      <div className="select-container">
        <span className="label">Select a recital</span>
        <Select
          onChange={this.portionSelected}
          value={selectedPortion}
          placeholder="Select a recital"
          className="select-dropdown recital-selection"
        >
          {
            portions.map(portion =>
              (
                <Option key={portion.id} value={portion.id}>
                  { portion.customRecitalDetails.recitalName }
                </Option>
              ))
          }
        </Select>
      </div>
    );
  }

  renderPortionTree = () => {
    const { selectedPortion, portions, selectedLessons } = this.state;

    const { addedLessonIds } = this.props;

    const preSelectedLessons = [...addedLessonIds, ...selectedLessons];

    if (!selectedPortion || !portions) return '';

    const portion = portions.find(p => p.id === selectedPortion);

    const { unitCategoryDetails } = portion;

    return (
      <UnitLessonTree
        units={unitCategoryDetails}
        addingLesson
        onCheck={this.lessonChecked}
        preSelectedLessons={preSelectedLessons}
        disabledLessons={addedLessonIds}
      />
    );
  }

  render() {
    const { visible } = this.props;
    const { steps, currentStep } = this.state;
    const footer = this.getFooter();

    const mobileScreen = window.innerWidth < 767;
    return (
      <Modal
        title="Add Lessons to Daily Plan"
        visible={visible}
        onOk={this.submitLessonSelection}
        onCancel={this.hideModal}
        footer={footer}
        className="daily-plan-recital-selection"
      >
        <Steps direction={mobileScreen ? 'horizontal' : 'vertical'} current={currentStep} className="add-lessons-steps">
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="step-content">
          { this.getStepContent() }
        </div>
      </Modal>
    );
  }
}

RecitalLessonSelection.propTypes = {
  visible: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  annualPlan: PropTypes.string,
  instrumentId: PropTypes.number,
  addedLessonIds: PropTypes.arrayOf(PropTypes.number),
};

RecitalLessonSelection.defaultProps = {
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  annualPlan: '',
  instrumentId: null,
  addedLessonIds: [],
};

export default RecitalLessonSelection;
