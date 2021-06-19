import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddEditRecital from './AddEditRecital';
import { createRecitalAction, updateRecitalAction } from '../../reducers/recitals';
import { getMusicalGradesListAction, getInstrumentsListAction } from '../../reducers/general';

class AddEditRecitalContainer extends React.Component {
  static propTypes = {
    getInstruments: PropTypes.func.isRequired,
    getMusicalGrades: PropTypes.func.isRequired,
    createCurriculum: PropTypes.func.isRequired,
    updateCurriculum: PropTypes.func.isRequired,
    instruments: ImmutablePropTypes.list,
    musicalGrades: ImmutablePropTypes.list,
    curriculum: PropTypes.shape({})
  };

  static defaultProps = {
    instruments: null,
    musicalGrades: null,
    curriculum: null,
    childTypes: [{
        id: 'recital',
        value: 'Recital'
    },{
        id: 'theory',
        value: 'Theory'
    }],
    childType: null
  };

  // We are editing when there is some curriculum is passed as prop
  // Reset the form when there is no curriculum to edit,
  // present a blank form to create a new curriculum
  state = {
    editing: !!this.props.curriculum,
    haveToResetForm: !this.props.curriculum,
  }

  componentWillMount() {
    this.props.getInstruments();
    this.props.getMusicalGrades();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editing: !!nextProps.curriculum,
      haveToResetForm: !nextProps.curriculum,
    });
  }

  resetFormDone() {
    this.setState({
      haveToResetForm: false,
    });
  }

  formSubmitted(curriculum) {
    const { createCurriculum, updateCurriculum } = this.props;

    if (this.state.editing) {
      updateCurriculum(curriculum);
    } else {
      createCurriculum(curriculum);
    }
  }

  render() {
    const {
      instruments, musicalGrades, curriculum: curriculumToEdit, childType
    } = this.props;

    const { haveToResetForm } = this.state;

    return (<AddEditRecital
      instruments={instruments}
      musicalGrades={musicalGrades}
      onSubmit={data => this.formSubmitted(data)}
      curriculumToEdit={curriculumToEdit}
      editingCurriculum={!!curriculumToEdit}
      resetForm={haveToResetForm}
      formResetted={() => this.resetFormDone()}
    />);
  }
}

function mapStateToProps(state, ownProps) {
  const { general, curriculums } = state;
  const curriculumDetails = curriculums.get('details');
  const instruments = general.get('instruments');
  const musicalGrades = general.get('musicalGrades');

  const props = {
    instruments,
    musicalGrades,
  };

  const { curriculumId } = ownProps.match.params;
  if (curriculumId) {
    const curriculum = curriculumDetails && curriculumDetails.get(curriculumId);

    return {
      ...props,
      curriculum,
    };
  }

  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createCurriculum: createRecitalAction,
    updateCurriculum: updateRecitalAction,
    getInstruments: getInstrumentsListAction,
    getMusicalGrades: getMusicalGradesListAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditRecitalContainer);
