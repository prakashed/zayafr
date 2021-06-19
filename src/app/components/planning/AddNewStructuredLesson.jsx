import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { Modal, Steps, Button, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getBookDetailsAction } from '../../reducers/books';
import { addUnitsToRecitalAction } from '../../reducers/recitals_old';
import Step1Content from './add-units/structured/Step1Content';
import Step2Content from './add-units/structured/Step2Content';
import Step3Content from './add-units/structured/Step3Content';
import './AddNewLesson.less';
import './AddNewStructuredLesson.less';

const { Step } = Steps;

class AddNewStructuredLesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      current: 0,
      steps: [
        {
          id: 1,
          title: 'Step - 1',
          description: 'Choose Book',
        },
        {
          id: 2,
          title: 'Step - 2',
          description: 'Choose Units',
        },
        {
          id: 3,
          title: 'Step - 3',
          description: 'Review',
        },
      ],
      stepData: [
        {
          book: null,
        },
        {
          selectedUnits: {},
        },
      ],
      forms: {
        step1: null,
        step2: null,
      },
    };
  }

  getContent = (current) => {
    const { instrument, instrumentBooks } = this.props;
    const booksList = instrument && instrumentBooks[instrument.id];

    switch (current) {
      case 0:
        return (<Step1Content
          bookSelected={this.bookSelected}
          wrappedComponentRef={this.saveStep1FormRef}
          books={booksList}
        />);
      case 1: {
        const { books } = this.props;
        const { stepData } = this.state;
        const bookSelected = stepData[0].book;
        const bookDetails = books.get(bookSelected);

        return (<Step2Content
          unitsAlreadyAdded={this.props.instrument.unitDetails}
          searchUnit={tag => this.searchUnit(tag)}
          searchFilteredUnits={this.props.filteredUnits}
          toggleUnit={this.toggleUnit}
          book={bookDetails}
        />);
      }
      case 2:
        return (<Step3Content
          units={this.state.stepData[1].selectedUnits}
        />);
      default:
        return <p>No content</p>;
    }
  }

  saveStep1FormRef = (step1Form) => {
    const { forms } = this.state;
    const newForms = { ...forms, step1: step1Form };
    this.setState({
      forms: newForms,
    });
  }

  bookSelected = (bookId) => {
    const { stepData } = this.state;
    const { getBookDetails } = this.props;
    getBookDetails(bookId);

    const newStepData = [{ book: bookId }, ...stepData.slice(1)];
    this.setState({
      stepData: newStepData,
    });

    // Reset Filtered units on selection of new book
    if (this.props.filteredUnits) {
      this.props.clearFilteredUnits();
    }
  }

  // DEPRECATED
  // gatherLessonGroupData() {
  //   const { stepData } = this.state;
  //   const { category, title } = stepData[0];
  //   const { recitalId } = this.props;

  //   const step3Data = stepData[2];
  //   const step4Data = stepData[3];

  //   const learningOutcomeData = {
  //     pieces: {
  //       unit_pieces: _.keys(step3Data.learningOutcome),
  //     },
  //     message: step4Data.learningOutcome.description,
  //   };

  //   const customPieceActivity = step4Data.activities.customMessage ?
  //     { title: step4Data.activities.customMessage } : null;

  //   const activityData = {
  //     pieces: {
  //       unit_pieces: _.keys(step3Data.activities),
  //       custom_piece: customPieceActivity,
  //     },
  //     message: step4Data.activities.description,
  //   };

  //   const customPieceAssessment = step4Data.assessment.customMessage ?
  //     { title: step4Data.assessment.customMessage } : null;

  //   const assessmentData = {
  //     pieces: {
  //       unit_pieces: _.keys(step3Data.assessment),
  //       custom_piece: customPieceAssessment,
  //     },
  //     message: step4Data.assessment.description,
  //   };

  //   return {
  //     category_id: category.id,
  //     title,
  //     description: '',
  //     index: recitalId,
  //     learning_outcome: learningOutcomeData,
  //     assessment: assessmentData,
  //     activity: activityData,
  //   };
  // }

  addLessonsToInstrument() {
    const { recitalId, instrument, addUnitsToRecital } = this.props;
    const { id: instrumentId } = instrument;

    const { stepData } = this.state;
    const step2Data = stepData[1];
    const { selectedUnits } = step2Data;
    const newUnitsAdded = _.values(selectedUnits).map(unit => unit.id);
    const unitsData = newUnitsAdded.map(unitId => (
      {
        unit: unitId,
        recital: recitalId,
        instrument: instrumentId,
      }
    ));

    addUnitsToRecital(unitsData);
    this.hideAddNewLessonModal();
  }

  searchUnit(tag) {
    const { instrument } = this.props;
    const { id } = instrument;
    this.props.getFilteredUnitList({ tag, instrumentId: id });
  }

  // selectUnit = (unit) => {
  //   const { stepData } = this.state;
  //   const newStep2Data = {
  //     activeUnitId: unit.id,
  //     selectedUnit: unit,
  //   };

  //   const newStepData = [...stepData.slice(0, 1), newStep2Data, ...stepData.slice(2)];
  //   this.setState({
  //     stepData: newStepData,
  //   });
  // }

  toggleUnit = (unit) => {
    const { stepData } = this.state;
    const step2Data = stepData[1];
    const { selectedUnits } = step2Data;
    if (selectedUnits[unit.id]) {
      delete selectedUnits[unit.id];
    } else {
      selectedUnits[unit.id] = unit;
    }

    const newUnitsSelected = { ...selectedUnits };
    const newStep2Data = {
      selectedUnits: newUnitsSelected,
    };

    const newStepData = [...stepData.slice(0, 1), newStep2Data, ...stepData.slice(2)];
    this.setState({
      stepData: newStepData,
    });
  }

  async next() {
    const { current } = this.state;
    let stepValidated = false;

    switch (current) {
      case 0:
        stepValidated = await this.validateStep1();
        break;

      case 1:
        stepValidated = this.validateStep2();
        break;

      case 2:
        stepValidated = this.validateStep3();
        break;

      default:
        stepValidated = false;
    }

    if (!stepValidated) return;

    const nextCurrent = current + 1;
    this.setState({ current: nextCurrent });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  validateStep1() {
    return new Promise((resolve) => {
      const { step1: step1Form } = this.state.forms;
      const { form } = step1Form.props;

      form.validateFields((err, values) => {
        if (err) {
          resolve(false);
        }

        this.saveStep1Data(values);

        resolve(true);
      });
    });
  }

  validateStep2() {
    const { stepData } = this.state;
    const step2Data = stepData[1];

    if (_.isEmpty(step2Data.selectedUnits)) {
      notification.warning({
        message: 'Please select atleast one unit',
        description: 'Search for a tag and select a unit',
      });

      return false;
    }

    return true;
  }

  validateStep3() {
    const { stepData } = this.state;
    const checkedPieces = stepData[2];
    // const { learningOutcome, activities, assessment } = step3Data;

    if (_.isEmpty(checkedPieces)) {
      notification.warning({
        message: 'Please check atleast one piece!',
      });
      return false;
    }

    return true;
  }

  saveStep1Data = ({ book }) => {
    const { stepData } = this.state;

    const newStep1 = {
      book,
    };

    const newStepData = [newStep1, ...stepData.slice(1)];

    this.setState({
      stepData: newStepData,
    });
  }

  togglePieceCheckbox = (piece) => {
    const { stepData } = this.state;
    // const step3Data = stepData[2];
    // const piecesAlreadySelected = step3Data[property];
    const piecesAlreadySelected = stepData[2];

    if (piecesAlreadySelected[piece.id]) {
      delete piecesAlreadySelected[piece.id];
    } else {
      piecesAlreadySelected[piece.id] = piece;
    }

    const newPiecesSelected = { ...piecesAlreadySelected };

    // step3Data[property] = newPiecesSelected;
    const newStepData = [...stepData.slice(0, 2), newPiecesSelected, ...stepData.slice(3)];
    this.setState({
      stepData: newStepData,
    });
  }

  saveDescription = (description, property) => {
    const { stepData } = this.state;
    const step4Data = stepData[3];
    const oldProperty = step4Data[property];
    const newProperty = { ...oldProperty, description };
    step4Data[property] = newProperty;
    const newStepData = [...stepData.slice(0, 3), step4Data];
    this.setState({
      stepData: newStepData,
    });
  }

  saveCustomMessage = (customMessage, property) => {
    const { stepData } = this.state;
    const step4Data = stepData[3];
    const oldProperty = step4Data[property];
    const newProperty = { ...oldProperty, customMessage };
    step4Data[property] = newProperty;
    const newStepData = [...stepData.slice(0, 3), step4Data];
    this.setState({
      stepData: newStepData,
    });
  }

  hideAddNewLessonModal = () => {
    this.setState(this.getInitialState());
    this.props.hideModal();
  }

  render() {
    const { current, steps } = this.state;
    const { recitalTitle, instrument } = this.props;
    const instrumentName = instrument && instrument.title ? instrument.title : 'No Instrument';

    return (
      <Modal
        title={`${recitalTitle} - Add Lesson: ${instrumentName}`}
        visible={this.props.showAddLesson}
        onCancel={this.hideAddNewLessonModal}
        footer={null}
        destroyOnClose
        className="add-new-lesson add-new-structured-lesson"
      >
        <div className="steps-container">
          <Steps direction="vertical" current={current}>
            {
              steps.map(step =>
                <Step key={step.id} title={step.title} description={step.description} />)
            }
          </Steps>
          <div className="steps-content-container">
            {
              this.getContent(current)
            }
          </div>
        </div>
        <div className="steps-action">
          {
            this.state.current > 0
            &&
            <Button onClick={() => this.prev()}>
              Back
            </Button>
          }
          {
            current < steps.length - 1
            &&
            <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.next()}>Next</Button>
          }
          {
            this.state.current === steps.length - 1
            &&
            <Button style={{ marginLeft: 8 }} onClick={() => this.addLessonsToInstrument()} type="primary">Done</Button>
          }
        </div>
      </Modal>
    );
  }
}

AddNewStructuredLesson.propTypes = {
  showAddLesson: PropTypes.bool,
  hideModal: PropTypes.func,
  recitalId: PropTypes.string,
  recitalTitle: PropTypes.string,
  instrument: PropTypes.shape({
    unitDetails: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  books: ImmutablePropTypes.map,
  getFilteredUnitList: PropTypes.func,
  clearFilteredUnits: PropTypes.func,
  getBookDetails: PropTypes.func.isRequired,
  filteredUnits: ImmutablePropTypes.list,
  instrumentBooks: PropTypes.shape({}),
  addUnitsToRecital: PropTypes.func.isRequired,
};

AddNewStructuredLesson.defaultProps = {
  showAddLesson: false,
  hideModal: () => {},
  recitalId: null,
  recitalTitle: null,
  instrument: null,
  books: null,
  getFilteredUnitList: () => {},
  clearFilteredUnits: () => {},
  filteredUnits: null,
  instrumentBooks: null,
};

function mapStateToProps(state) {
  const { books } = state;
  const bookDetails = books.get('details');
  return {
    books: bookDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getBookDetails: getBookDetailsAction,
    addUnitsToRecital: addUnitsToRecitalAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewStructuredLesson);
