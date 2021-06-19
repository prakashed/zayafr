import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AddEditRecital from "./AddEditRecital";
import {
  createRecitalAction,
  updateRecitalAction
} from "../../reducers/recitals";
import {
  getMusicalGradesListAction,
  getInstrumentsListAction
} from "../../reducers/general";

class AddEditIndexContainer extends React.Component {
  static propTypes = {
    getInstruments: PropTypes.func.isRequired,
    getMusicalGrades: PropTypes.func.isRequired,
    createRecital: PropTypes.func.isRequired,
    updateRecital: PropTypes.func.isRequired,
    instruments: ImmutablePropTypes.list,
    musicalGrades: ImmutablePropTypes.list,
    recital: PropTypes.shape({})
  };

  static defaultProps = {
    instruments: null,
    musicalGrades: null,
    recital: null
  };

  // We are editing when there is some recital is passed as prop
  // Reset the form when there is no recital to edit,
  // present a blank form to create a new recital
  state = {
    editing: !!this.props.recital,
    haveToResetForm: !this.props.recital
  };

  componentWillMount() {
    this.props.getInstruments();
    this.props.getMusicalGrades();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editing: !!nextProps.recital,
      haveToResetForm: !nextProps.recital
    });
  }

  resetFormDone() {
    this.setState({
      haveToResetForm: false
    });
  }

  formSubmitted(recital) {
    const { createRecital, updateRecital } = this.props;

    if (this.state.editing) {
      updateRecital(recital);
    } else {
      createRecital(recital);
    }
  }

  render() {
    const { instruments, musicalGrades, recital: recitalToEdit } = this.props;

    const { haveToResetForm } = this.state;

    return (
      <AddEditRecital
        instruments={instruments}
        musicalGrades={musicalGrades}
        onSubmit={data => this.formSubmitted(data)}
        recitalToEdit={recitalToEdit}
        editingRecital={!!recitalToEdit}
        resetForm={haveToResetForm}
        formResetted={() => this.resetFormDone()}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { general, recitals } = state;
  const recitalDetails = recitals.get("details");
  const instruments = general.get("instruments");
  const musicalGrades = general.get("musicalGrades");

  const props = {
    instruments,
    musicalGrades
  };

  const { recitalId } = ownProps.match.params;
  if (recitalId) {
    const recital = recitalDetails && recitalDetails.get(recitalId);

    return {
      ...props,
      recital
    };
  }

  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createRecital: createRecitalAction,
      updateRecital: updateRecitalAction,
      getInstruments: getInstrumentsListAction,
      getMusicalGrades: getMusicalGradesListAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditIndexContainer);
