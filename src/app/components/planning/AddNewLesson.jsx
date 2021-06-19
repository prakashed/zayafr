import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { Modal, Steps, Button, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addCustomUnitToRecitalAction } from '../../reducers/recitals';
import Step1Content from './add-units/unstructured/Step1Content';
import Step2Content from './add-units/unstructured/Step2Content';
import Step3Content from './add-units/unstructured/Step3Content';
import Step4Content from './add-units/unstructured/Step4Content';
import './AddNewLesson.less';

const { Step } = Steps;

class AddNewLesson extends React.Component {
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
          description: 'Details',
        },
        {
          id: 2,
          title: 'Step - 2',
          description: 'Book and Unit',
        },
        {
          id: 3,
          title: 'Step - 3',
          description: 'Choose Pieces',
        },
        {
          id: 4,
          title: 'Step - 4',
          description: 'Review',
        },
      ],
      stepData: [
        {
          category: null,
          title: '',
        },
        {
          activeUnitId: null,
          selectedUnit: null,
        },
        // checked pieces id will be stored
        {},
        // {
        //   learningOutcome: {
        //     description: '',
        //     customMessage: null,
        //   },
        //   assessment: {
        //     description: '',
        //     customMessage: null,
        //   },
        //   activities: {
        //     description: '',
        //     customMessage: null,
        //   },
        // },
      ],
      forms: {
        step1: null,
        step2: null,
        step3: null,
      },
    };
  }

  getContent = (current) => {
    switch (current) {
      case 0:
        return (<Step1Content
          wrappedComponentRef={this.saveStep1FormRef}
          categories={this.props.categories}
        />);
      case 1:
        return (<Step2Content
          searchUnit={tag => this.searchUnit(tag)}
          filteredUnits={this.props.filteredUnits}
          selectUnit={this.selectUnit}
          activeUnitId={this.state.stepData[1].activeUnitId}
        />);
      case 2:
        return (<Step3Content
          selectedUnit={this.state.stepData[1].selectedUnit}
          // pieces={this.state.stepData[1].selectedUnit.unitPieces}
          togglePieceCheckbox={(piece, property) => this.togglePieceCheckbox(piece, property)}
          checkedPieces={this.state.stepData[2]}
        />);
      case 3:
        return (
          <Step4Content
            unitName={this.state.stepData[0].title}
            category={this.state.stepData[0].category}
            pieces={this.state.stepData[2]}
          />
        );
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

  gatherCustomUnitData() {
    const { stepData } = this.state;
    const { category, title } = stepData[0];
    const { id: categoryId } = category;
    const lessons = _.keys(stepData[2]).map(l => parseInt(l, 10));

    return {
      title,
      category: parseInt(categoryId, 10),
      lessons,
    };
  }

  createNewLessonGroup() {
    const customUnit = this.gatherCustomUnitData();
    let { recitalId } = this.props;
    const { instrument } = this.props;
    let { id: instrumentId } = instrument;
    recitalId = parseInt(recitalId, 10);
    instrumentId = parseInt(instrumentId, 10);
    this.props.addCustomUnitToRecital({ recitalId, instrumentId, customUnit });
    this.hideAddNewLessonModal();
  }

  searchUnit(tag) {
    const { instrument } = this.props;
    this.props.getFilteredUnitList({ tag, instrumentId: instrument.id });
  }

  selectUnit = (unit) => {
    const { stepData } = this.state;
    const newStep2Data = {
      activeUnitId: unit.id,
      selectedUnit: unit,
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
    const { activeUnitId } = step2Data;

    if (activeUnitId) {
      return true;
    }

    notification.warning({
      message: 'Please select a unit',
      description: 'Search for a tag and select a unit',
    });

    return false;
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

  saveStep1Data = ({ title, category }) => {
    const { stepData } = this.state;
    const step1Data = stepData[0];

    const { categories } = this.props;
    const categorySelected = categories.find(c => c.id === category);

    const newStep1Data = { title, category: categorySelected };
    const newStep1 = {
      ...step1Data,
      ...newStep1Data,
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
        title={`${recitalTitle} - Add Unit: ${instrumentName}`}
        visible={this.props.showAddLesson}
        onCancel={this.hideAddNewLessonModal}
        footer={null}
        destroyOnClose
        className="add-new-lesson"
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
            <Button style={{ marginLeft: 8 }} onClick={() => this.createNewLessonGroup()} type="primary">Done</Button>
          }
        </div>
      </Modal>
    );
  }
}

AddNewLesson.propTypes = {
  showAddLesson: PropTypes.bool,
  hideModal: PropTypes.func,
  recitalId: PropTypes.string,
  recitalTitle: PropTypes.string,
  instrument: PropTypes.shape({}),
  categories: ImmutablePropTypes.list,
  getFilteredUnitList: PropTypes.func,
  filteredUnits: ImmutablePropTypes.list,
  addCustomUnitToRecital: PropTypes.func.isRequired,
};

AddNewLesson.defaultProps = {
  showAddLesson: false,
  hideModal: () => {},
  recitalId: null,
  recitalTitle: null,
  instrument: null,
  categories: null,
  getFilteredUnitList: () => {},
  filteredUnits: null,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addCustomUnitToRecital: addCustomUnitToRecitalAction,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(AddNewLesson);
