import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DETAILS_STORE } from '../../helpers/stateUtils';
import AddEditClassroom from './AddEditClassroom';
import { createClassroomAction, updateClassroomAction } from '../../reducers/classrooms';
import { getDivisionsListAction, getSchoolGradesListAction, addNewDivisionAction, getInstrumentsListAction } from '../../reducers/general';

class AddEditClassroomContainer extends Component {
  static propTypes = {
    createClassroom: PropTypes.func.isRequired,
    updateClassroom: PropTypes.func.isRequired,
    // getDivisions: PropTypes.func.isRequired,
    getSchoolGrades: PropTypes.func.isRequired,
    getInstruments: PropTypes.func.isRequired,
    addNewDivision: PropTypes.func.isRequired,
    divisions: ImmutablePropTypes.list,
    schoolGrades: ImmutablePropTypes.list,
    school: PropTypes.shape({}),
    classroom: PropTypes.shape({}),
    instruments: ImmutablePropTypes.list,
  };

  static defaultProps = {
    school: null,
    classroom: null,
    divisions: null,
    schoolGrades: null,
    instruments: null,
  };

  // We are editing when there is some classroom is passed as prop
  // Reset the form when there is no classroom to edit,
  // present a blank form to create a new classroom
  state = {
    editing: !!this.props.classroom,
    haveToResetForm: !this.props.classroom,
  }

  componentWillMount() {
    const {
      // divisions,
      // getDivisions,
      schoolGrades,
      getSchoolGrades,
      getInstruments,
      instruments,
    } = this.props;

    // if (!divisions || divisions.size === 0) {
    //   getDivisions({ school: this.props.schoolId });
    // }
    if (!schoolGrades || schoolGrades.size === 0) {
      getSchoolGrades();
    }

    if (!instruments || instruments.size === 0) {
      getInstruments();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editing: !!nextProps.classroom,
      haveToResetForm: !nextProps.classroom,
    });

    // if (nextProps.schoolId !== this.props.schoolId) {
    //   this.props.getDivisions({ school: nextProps.schoolId });
    // }
  }

  resetFormDone() {
    this.setState({
      haveToResetForm: false,
    });
  }

  classroomFormSubmitted(classroom) {
    const { createClassroom, updateClassroom } = this.props;

    if (this.state.editing) {
      updateClassroom(classroom);
    } else {
      createClassroom(classroom);
    }
  }

  render() {
    const {
      classroom: classroomToEdit,
      divisions,
      schoolGrades,
      school,
      addNewDivision,
      instruments,
    } = this.props;

    const { haveToResetForm } = this.state;

    return (<AddEditClassroom
      divisions={divisions}
      school={school}
      schoolGrades={schoolGrades}
      schoolId={school && school.id}
      onSubmit={classroom => this.classroomFormSubmitted(classroom)}
      classroomToEdit={classroomToEdit}
      editingClassroom={!!classroomToEdit}
      resetForm={haveToResetForm}
      formResetted={() => this.resetFormDone()}
      addNewDivision={addNewDivision}
      instruments={instruments}
    />);
  }
}

function mapStateToProps(state, ownProps) {
  const { classrooms, general } = state;
  const classroomDetails = classrooms.get(DETAILS_STORE);
  const { id: classroomId } = ownProps.match.params;
  const divisions = general.get('divisions');
  const schoolGrades = general.get('schoolGrades');
  const instruments = general.get('instruments');

  const props = {
    divisions,
    schoolGrades,
    instruments,
  };

  if (classroomId) {
    const classroom = classroomDetails && classroomDetails.get(classroomId);

    return {
      ...props,
      classroom,
    };
  }

  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createClassroom: createClassroomAction,
    updateClassroom: updateClassroomAction,
    getDivisions: getDivisionsListAction,
    getInstruments: getInstrumentsListAction,
    getSchoolGrades: getSchoolGradesListAction,
    addNewDivision: addNewDivisionAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditClassroomContainer);
