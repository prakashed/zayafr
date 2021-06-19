import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddEditTheory from './AddEditTheory';
import { createTheoryAction, updateTheoryAction } from '../../reducers/theories';
import { getMusicalGradesListAction, getInstrumentsListAction } from '../../reducers/general';

class AddEditTheoryContainer extends React.Component {
  static propTypes = {
    createCurriculum: PropTypes.func.isRequired,
    updateCurriculum: PropTypes.func.isRequired,
    curriculum: PropTypes.shape({})
  };

  static defaultProps = {
    curriculum: null
  };

  // We are editing when there is some curriculum is passed as prop
  // Reset the form when there is no curriculum to edit,
  // present a blank form to create a new curriculum
  state = {
    editing: !!this.props.curriculum,
    haveToResetForm: !this.props.curriculum,
  }

  // componentWillMount() {
  //   this.props.getInstruments();
  //   this.props.getMusicalGrades();
  // }

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
      curriculum: curriculumToEdit
    } = this.props;

    const { haveToResetForm } = this.state;

    return (<AddEditTheory
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

  const props = {
    childType: 'theory'
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
    createCurriculum: createTheoryAction,
    updateCurriculum: updateTheoryAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditTheoryContainer);
