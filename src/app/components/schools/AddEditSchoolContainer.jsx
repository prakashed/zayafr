import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddEditSchool from './AddEditSchool';
import { createSchoolAction, updateSchoolAction } from '../../reducers/schools';
import { getClusterListAction } from '../../reducers/clusters';
import { getTeacherListAction } from '../../reducers/people';

class AddEditSchoolContainer extends Component {
  static propTypes = {
    createSchool: PropTypes.func.isRequired,
    updateSchool: PropTypes.func.isRequired,
    getClusterList: PropTypes.func.isRequired,
    school: PropTypes.shape({})
  };

  static defaultProps = {
    school: null
  };

  // We are editing when there is some school is passed as prop
  // Reset the form when there is no school to edit,
  // present a blank form to create a new school
  state = {
    editing: !!this.props.school,
    haveToResetForm: !this.props.school
  };

  componentWillMount() {
    this.props.getClusterList();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editing: !!nextProps.school,
      haveToResetForm: !nextProps.school
    });
  }

  resetFormDone() {
    this.setState({
      haveToResetForm: false
    });
  }

  schoolFormSubmitted(school) {
    const { createSchool, updateSchool } = this.props;

    if (this.state.editing) {
      updateSchool(school);
    } else {
      createSchool(school);
    }
  }

  render() {
    const { school: schoolToEdit, clusters } = this.props;

    const { haveToResetForm } = this.state;

    return (
      <AddEditSchool
        onSubmit={schoolSubmitted => this.schoolFormSubmitted(schoolSubmitted)}
        schoolToEdit={schoolToEdit}
        editingSchool={!!schoolToEdit}
        resetForm={haveToResetForm}
        formResetted={() => this.resetFormDone()}
        clusters={clusters}
      />
    );
  }
}

AddEditSchoolContainer.propTypes = {
  createSchool: PropTypes.func.isRequired,
  updateSchool: PropTypes.func.isRequired,
  clusters: ImmutablePropTypes.map,
  getClusterList: PropTypes.func.isRequired
};

AddEditSchoolContainer.defaultProps = {
  clusters: null
};

function mapStateToProps(state, ownProps) {
  const { schools, clusters } = state;
  const schoolList = schools.get('list');
  const { schoolId } = ownProps.match.params;

  const props = {
    clusters: clusters.get('list')
  };

  if (schoolId) {
    const school = schoolList.get(schoolId);

    return {
      ...props,
      school
    };
  }

  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createSchool: createSchoolAction,
      updateSchool: updateSchoolAction,
      getClusterList: getClusterListAction,
      getTeacherList: getTeacherListAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditSchoolContainer);
