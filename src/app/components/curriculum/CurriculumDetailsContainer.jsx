import React, { Fragment, Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

// import { getCategoryListAction, getFilteredUnitListAction, clearFilteredUnitsAction, getBooksForInstrumentAction } from '../../reducers/general';
import {
  getCurriculumsDetailsAction,
  deleteCurriculumAction
} from '../../reducers/curriculums';

import RecitalDetails from './RecitalDetails';
import TheoryDetails from './TheoryDetails';
import AddEditLesson from './AddEditLesson';
import AddEditCategory from './AddEditCategory';
import AddEditObjective from './AddEditObjective';
// import AddNewStructuredLesson from './AddNewStructuredLesson';
import routes from '../../constants/routes.json';
import LoadingMessage from '../misc/LoadingMessage';
import { doHarlemShake } from '../../helpers';
import NotFoundError from '../misc/NotFoundError';

class CurriculumDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddEditLessonModal: false,
      showAddEditCategoryModal: false,
      showAddEditObjectiveModal: false,
      addLessonToInstrument: null,
      addObjectiveToLesson: null,
      showDeleteModal: false,
      fetchingCurriculumDetails: false,
      lessonToEdit: null,
      editingLesson: false,
      categoryToEdit: null,
      editingCategory: false,
      objectiveToEdit: null,
      editingObjective: false
    };
  }

  componentWillMount() {
    const { curriculumId } = this.props.match.params;
    this.props.getCurriculumsDetails(curriculumId);
  }

  componentWillReceiveProps(nextProps) {
    const { curriculum } = nextProps;
    const { curriculumId } = nextProps.match.params;
    // const { oldCurriculumId } = curriculum.id

    if (
      curriculum.childType === 'recital' &&
      !curriculum.properties.instrumentLessonsDetails
    ) {
      this.props.getCurriculumsDetails(curriculumId);
    } else if (
      curriculum.childType === 'theory' &&
      !curriculum.properties.categoriesDetails
    ) {
      this.props.getCurriculumsDetails(curriculumId);
    }

    this.updateEditingLesson(nextProps.curriculum);
    this.updateEditingCategory(nextProps.curriculum);
    this.updateEditingObjective(nextProps.curriculum);
  }

  // Visit this later when list and detail api have some difference
  checkIfCurriculumDetailsLoaded = curriculum => {
    if (curriculum) {
      if (curriculum.childType === 'recital') {
        return !!curriculum.properties.instrumentLessonsDetails;
      }
      return !!curriculum.properties.categoriesDetails;
    }
    return false;
  };

  // checkIfCurriculumDetailsLoaded = curriculum => !!curriculum && !!curriculum.properties.instrumentLessonsDetails

  showAddEditLesson(instrument, lessonToEdit) {
    this.setState({
      showAddEditLessonModal: true,
      addLessonToInstrument: instrument,
      editingLesson: !!lessonToEdit,
      lessonToEdit
    });
  }

  updateEditingLesson(curriculum) {
    const { editingLesson, addLessonToInstrument, lessonToEdit } = this.state;
    if (
      editingLesson &&
      curriculum &&
      curriculum.properties &&
      curriculum.properties.instrumentLessonsDetails
    ) {
      const { properties } = curriculum;
      const { instrumentLessonsDetails } = properties;
      const instrument = instrumentLessonsDetails.find(
        x => x.id === addLessonToInstrument.id
      );
      const { lessonsDetails } = instrument;
      const lesson = lessonsDetails.find(x => x.id === lessonToEdit.id);
      this.setState({ lessonToEdit: lesson });
    }
  }

  showAddEditCategory(categoryToEdit) {
    this.setState({
      showAddEditCategoryModal: true,
      editingCategory: !!categoryToEdit,
      categoryToEdit
    });
  }

  updateEditingCategory(curriculum) {
    const { editingCategory, categoryToEdit } = this.state;
    if (
      editingCategory &&
      curriculum &&
      curriculum.properties &&
      curriculum.properties.categoriesDetails
    ) {
      const { properties } = curriculum;
      const { categoriesDetails } = properties;
      const category = categoriesDetails.find(x => x.id === categoryToEdit.id);
      this.setState({ categoryToEdit: category });
    }
  }

  showAddEditObjective(lesson, objectiveToEdit) {
    console.log('objectiveToEdit');
    console.log(objectiveToEdit);
    this.setState({
      showAddEditObjectiveModal: true,
      addObjectiveToLesson: lesson,
      editingObjective: !!objectiveToEdit,
      objectiveToEdit
    });
  }

  updateEditingObjective(curriculum) {
    const { editingObjective, objectiveToEdit } = this.state;
    if (
      editingObjective &&
      curriculum &&
      curriculum.properties &&
      curriculum.properties.instrumentLessonsDetails
    ) {
      const { properties } = curriculum;
      const { instrumentLessonsDetails } = properties;

      var lessonsDetails = [];
      var objective;

      for (var i in instrumentLessonsDetails) {
        if (instrumentLessonsDetails[i].lessonsDetails) {
          for (var j in instrumentLessonsDetails[i].lessonsDetails) {
            lessonsDetails.push(instrumentLessonsDetails[i].lessonsDetails[j]);
          }
        }
      }

      for (var i in lessonsDetails) {
        var objectivesDetails = lessonsDetails[i].objectivesDetails;
        for (var j in objectivesDetails) {
          if (objectivesDetails[j].id == objectiveToEdit.id) {
            objective = objectivesDetails[j];
          }
        }
      }
      this.setState({ objectiveToEdit: objective });
    }
  }

  hideModal() {
    this.setState({
      showAddEditLessonModal: false,
      showAddEditObjectiveModal: false,
      showAddEditCategoryModal: false
    });
  }

  deleteCurriculum() {
    this.hideConfirmDeleteModal();
    this.props.deleteCurriculum(this.props.curriculum.id);
    const indicesListingUrl = `${routes.curriculums}`;
    this.props.history.push(indicesListingUrl);
  }

  showConfirmDeleteModal() {
    this.setState({
      showDeleteModal: true
    });
  }

  hideConfirmDeleteModal() {
    this.setState({
      showDeleteModal: false
    });
  }

  render() {
    const { curriculum, curriculumNotFound } = this.props;

    if (curriculumNotFound)
      return <NotFoundError message="Curriculum not found" />;

    if (_.isNull(curriculum)) {
      return <LoadingMessage message="Fetching Curriculum.." />;
    }

    const { curriculumId } = this.props.match.params;

    const {
      addLessonToInstrument,
      addObjectiveToLesson,
      showAddEditLessonModal,
      showAddEditObjectiveModal,
      showAddEditCategoryModal,
      lessonToEdit,
      categoryToEdit,
      editingLesson,
      editingCategory,
      objectiveToEdit,
      editingObjective
    } = this.state;

    const recitalDetailsComponent = (
      <RecitalDetails
        curriculum={curriculum}
        deleteCurriculum={() => this.showConfirmDeleteModal()}
        showAddEditLesson={(instrument, lesson) =>
          this.showAddEditLesson(instrument, lesson)
        }
        showAddEditObjective={(lesson, objective) =>
          this.showAddEditObjective(lesson, objective)
        }
      />
    );
    const theoryDetailsComponent = (
      <TheoryDetails
        curriculum={curriculum}
        deleteCurriculum={() => this.showConfirmDeleteModal()}
        showAddEditCategory={category => this.showAddEditCategory(category)}
      />
    );
    const curriculumDetailsComponent =
      curriculum.childType === 'recital'
        ? recitalDetailsComponent
        : theoryDetailsComponent;

    return (
      <Fragment>
        {curriculumDetailsComponent}
        {showAddEditLessonModal ? (
          <AddEditLesson
            recitalId={curriculumId}
            recitalTitle={curriculum.title}
            instrument={addLessonToInstrument}
            lessonToEdit={lessonToEdit}
            editingLesson={editingLesson}
            showAddLessonModal={showAddEditLessonModal}
            hideModal={() => this.hideModal()}
          />
        ) : null}

        {showAddEditObjectiveModal ? (
          <AddEditObjective
            recitalId={curriculumId}
            recitalTitle={curriculum.title}
            lesson={addObjectiveToLesson}
            objectiveToEdit={objectiveToEdit}
            editingObjective={editingObjective}
            showAddObjectiveModal={showAddEditObjectiveModal}
            hideModal={() => this.hideModal()}
          />
        ) : null}

        {showAddEditCategoryModal ? (
          <AddEditCategory
            theoryId={curriculumId}
            theoryTitle={curriculum.title}
            categoryToEdit={categoryToEdit}
            editingCategory={editingCategory}
            showAddCategoryModal={showAddEditCategoryModal}
            hideModal={() => this.hideModal()}
          />
        ) : null}

        <Modal
          title={`Delete ${curriculum.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteCurriculum()}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>Do you want to delete this curriculum?</p>
        </Modal>
      </Fragment>
    );
  }
}

CurriculumDetailsContainer.propTypes = {
  curriculum: PropTypes.shape({
    id: PropTypes.string
  }),
  curriculumNotFound: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      curriculumId: PropTypes.string.isRequired
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  deleteCurriculum: PropTypes.func.isRequired,
  getCurriculumsDetails: PropTypes.func.isRequired
};

CurriculumDetailsContainer.defaultProps = {
  curriculum: null,
  curriculumNotFound: false
};

function mapStateToProps(state, ownProps) {
  const { curriculumId } = ownProps.match.params;
  const { curriculums } = state;
  const curriculumDetails = curriculums.get('details');
  const curriculum = curriculumDetails && curriculumDetails.get(curriculumId);

  const curriculumNotFound = curriculumDetails && !curriculum;
  return {
    curriculum,
    curriculumNotFound
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCurriculumsDetails: getCurriculumsDetailsAction,
      deleteCurriculum: deleteCurriculumAction
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurriculumDetailsContainer);
