import React, { Fragment, Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import { getSchoolDetailsAction } from '../../reducers/schools';

import SchoolDetails from './SchoolDetails';

import AddEditAnnualPlan from './AddEditAnnualPlan';
import routes from '../../constants/routes.json';
import LoadingMessage from '../misc/LoadingMessage';
import NotFoundError from '../misc/NotFoundError';

class SchoolDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddEditAnnualPlanModal: false,
      fetchingSchoolDetails: false,
      annualPlanToEdit: null,
      editingAnnualPlan: false,
      customRecitals: []
    };
  }

  componentWillMount() {
    const { schoolId } = this.props.match.params;
    this.props.getSchoolDetails(schoolId);
  }

  checkIfSchoolDetailsLoaded = school =>
    !!school && !!school.annualPlansDetails;

  componentWillReceiveProps(nextProps) {
    // const { school } = nextProps;
    // const { schoolId } = nextProps.match.params;
    // if (this.checkIfSchoolDetailsLoaded) {
    // this.props.getSchoolDetails(schoolId);
    // }
    // this.updateEditingAnnualPlan(nextProps.school);
  }

  addCustomRecital(customRecital) {
    var { customRecitals } = this.state;
    const newCustomRecitals = [...customRecital, ...customRecitals];
    this.setState({ customRecitals: newCustomRecitals });
  }

  showAddEditAnnualPlan(annualPlanToEdit) {
    this.setState({
      showAddEditAnnualPlanModal: true,
      customRecitals: [],
      editingAnnualPlan: !!annualPlanToEdit,
      annualPlanToEdit
    });
  }

  updateEditingAnnualPlan(school) {
    const { editingAnnualPlan, annualPlanToEdit } = this.state;
    if (editingAnnualPlan && school && school.annualPlansDetails) {
      const { properties } = school;
      const { annualPlansDetails } = properties;
      const annualPlan = annualPlansDetails.find(
        x => x.id === annualPlanToEdit.id
      );
      this.setState({ annualPlanToEdit: annualPlan });
    }
  }

  hideModal() {
    this.setState({
      showAddEditAnnualPlanModal: false
    });
  }

  render() {
    const { school, schoolNotFound } = this.props;
    const { customRecitals } = this.state;

    if (schoolNotFound) return <NotFoundError message="School not found" />;

    if (_.isNull(school)) {
      return <LoadingMessage message="Fetching School.." />;
    }

    const { schoolId } = this.props.match.params;

    const {
      showAddEditAnnualPlanModal,
      annualPlanToEdit,
      editingAnnualPlan
    } = this.state;

    const schoolDetailsComponent = (
      <SchoolDetails
        school={school}
        showAddEditAnnualPlan={annualPlan =>
          this.showAddEditAnnualPlan(annualPlan)
        }
      />
    );

    return (
      <Fragment>
        {schoolDetailsComponent}

        {showAddEditAnnualPlanModal ? (
          <AddEditAnnualPlan
            schoolId={schoolId}
            schoolName={school.name}
            classrooms={school.classroomDetails}
            annualPlanToEdit={annualPlanToEdit}
            editingAnnualPlan={editingAnnualPlan}
            showAddAnnualPlanModal={showAddEditAnnualPlanModal}
            addCustomRecital={customRecital =>
              this.addCustomRecital(customRecital)
            }
            customRecitals={customRecitals}
            hideModal={() => this.hideModal()}
          />
        ) : null}
      </Fragment>
    );
  }
}

SchoolDetailsContainer.propTypes = {
  school: PropTypes.shape({
    id: PropTypes.string
  }),
  schoolNotFound: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      schoolId: PropTypes.string.isRequired
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  getSchoolDetails: PropTypes.func.isRequired
};

SchoolDetailsContainer.defaultProps = {
  school: null,
  schoolNotFound: false
};

function mapStateToProps(state, ownProps) {
  const { schoolId } = ownProps.match.params;
  const { schools } = state;
  const schoolDetails = schools.get('details');
  const school = schoolDetails && schoolDetails.get(schoolId);

  const schoolNotFound = schoolDetails && !school;
  return {
    school,
    schoolNotFound
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSchoolDetails: getSchoolDetailsAction
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchoolDetailsContainer);
