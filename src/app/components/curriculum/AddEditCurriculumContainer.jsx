import React, { Fragment, Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

// import { getCategoryListAction, getFilteredUnitListAction, clearFilteredUnitsAction, getBooksForInstrumentAction } from '../../reducers/general';
// import { getCurriculumsDetailsAction, deleteCurriculumAction } from '../../reducers/curriculums';
import RecitalDetails from './RecitalDetails';
import TheoryDetails from './TheoryDetails';
import AddEditLesson from './AddEditLesson';
import AddEditObjective from './AddEditObjective';
// import AddNewStructuredLesson from './AddNewStructuredLesson';
import routes from '../../constants/routes.json';
import LoadingMessage from '../misc/LoadingMessage';
import { doHarlemShake } from '../../helpers';
import NotFoundError from '../misc/NotFoundError';

class CurriculumDetailsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { curriculumId } = this.props.match.params;
    this.props.getCurriculumsDetails(curriculumId);
  }

  componentWillReceiveProps(nextProps) {
    const { curriculum } = nextProps;
    const { curriculumId } = nextProps.match.params;
    // const { oldCurriculumId } = curriculum.id

    if (curriculum.childType === 'recital' && !curriculum.properties.instrumentLessonsDetails) {
      this.props.getCurriculumsDetails(curriculumId);
    } else if (curriculum.childType === 'theory' && !curriculum.properties.categoriesDetails) {
      this.props.getCurriculumsDetails(curriculumId);
    }
  }

  // Visit this later when list and detail api have some difference
  checkIfCurriculumDetailsLoaded = curriculum => {
    if (!!curriculum) {
      if (curriculum.childType === "recital") {
        return !!curriculum.properties.instrumentLessonsDetails
      } else {
        return !!curriculum.properties.categoriesDetails
      }
    }
    return false
  } 

  // checkIfCurriculumDetailsLoaded = curriculum => !!curriculum && !!curriculum.properties.instrumentLessonsDetails

  showAddEditLesson(instrument) {
    console.log(instrument)
    this.setState({
      showAddEditLessonModal: true,
      addLessonToInstrument: instrument,
    });
  }

  showAddEditObjective(lesson) {
    console.log(lesson)
    this.setState({
      showAddEditObjectiveModal: true,
      addObjectiveToLesson: lesson,
    });
  }

  hideModal() {
    this.setState({
      showAddEditLessonModal: false,
      showAddEditObjectiveModal: false,
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
      showDeleteModal: true,
    });
  }

  hideConfirmDeleteModal() {
    this.setState({
      showDeleteModal: false,
    });
  }

  render() {
    const {
      curriculum, curriculumNotFound,
    } = this.props;

    if (curriculumNotFound) return <NotFoundError message="Curriculum not found" />;

    if (_.isNull(curriculum)) {
      return <LoadingMessage message="Fetching Curriculum.." />;
    }

    const { curriculumId } = this.props.match.params;

    const {
      addLessonToInstrument,
      addObjectiveToLesson,
      showAddEditLessonModal,
      showAddEditObjectiveModal,
    } = this.state;
    
    var recitalDetailsComponent = <RecitalDetails 
                                    curriculum={curriculum}  
                                    deleteCurriculum={() => this.showConfirmDeleteModal()}
                                    showAddEditLesson={instrument => this.showAddEditLesson(instrument)}
                                    showAddEditObjective={instrument => this.showAddEditObjective(instrument)
                                    }
                                  />
    var theoryDetailsComponent =  <TheoryDetails 
                                    curriculum={curriculum} deleteCurriculum={() => this.showConfirmDeleteModal()}
                                  />
    var curriculumDetailsComponent = curriculum.childType === 'recital' ? recitalDetailsComponent : theoryDetailsComponent

    return (
      <Fragment>
        {
          curriculumDetailsComponent
        }
        <AddEditLesson
          recitalId={curriculumId}
          recitalTitle={curriculum.title}
          instrument={addLessonToInstrument}
          // categories={categories}
          // filteredUnits={filteredUnits}
          // getFilteredUnitList={getFilteredUnitList}
          // clearFilteredUnits={clearFilteredUnits}
          showAddLessonModal={showAddEditLessonModal}
          hideModal={() => this.hideModal()}
        />
        
        <AddEditObjective
          recitalTitle={curriculum.title}
          // instrument={addLessonToInstrument}
          lesson={addObjectiveToLesson}
          showAddObjectiveModal={showAddEditObjectiveModal}
          hideModal={() => this.hideModal()}
        />
        <Modal
          title={`Delete ${curriculum.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteCurriculum()}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>
            Do you want to delete this curriculum?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

CurriculumDetailsContainer.propTypes = {
  curriculum: PropTypes.shape({
    id: PropTypes.string,
  }),
  curriculumNotFound: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      curriculumId: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  deleteCurriculum: PropTypes.func.isRequired,
  getCurriculumsDetails: PropTypes.func.isRequired,
};

CurriculumDetailsContainer.defaultProps = {
  curriculum: null,
  curriculumNotFound: false,
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
  return bindActionCreators({
    getCurriculumsDetails: getCurriculumsDetailsAction,
    deleteCurriculum: deleteCurriculumAction,
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(CurriculumDetailsContainer);
