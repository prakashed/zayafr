import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import AnnualPlanDetails from './AnnualPlanDetails';
import { DETAILS_STORE, ERROR_STORE } from '../../helpers/stateUtils';
import LoadingMessage from '../misc/LoadingMessage';
import routes from '../../constants/routes.json';
import { getDetailsAction, getDeleteAction } from '../../reducers/annual-plans';
import NotFoundError from '../misc/NotFoundError';
import { is404Error } from '../../helpers';

class AnnualPlanDetailsContainer extends Component {
  static propTypes = {
    annualPlan: PropTypes.shape({
      id: PropTypes.string,
    }),
    errorInStore: PropTypes.shape({}),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    getAnnualPlanDetails: PropTypes.func.isRequired,
    deleteAnnualPlan: PropTypes.func.isRequired,
  }

  static defaultProps = {
    annualPlan: null,
    errorInStore: null,
  }

  state = {
    showDeleteModal: false,
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { errorInStore } = this.props;
    if (!errorInStore && id) {
      this.props.getAnnualPlanDetails(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { annualPlan } = nextProps;
    const { id } = nextProps.match.params;
    const { id: oldId } = this.props.match.params;
    console.log('old id and new id matches --> ', oldId === id);
    console.log('old id, new id, annual plan --> ', oldId, id, annualPlan);
    if (!annualPlan && oldId !== id) {
      console.log('fetching annual plan');
      this.props.getAnnualPlanDetails(id);
    }
  }

  deleteAnnualPlan() {
    this.hideConfirmDeleteModal();
    this.props.deleteAnnualPlan(this.props.annualPlan.id);

    const listingUrl = `${routes.annual_plans}`;
    this.props.history.push(listingUrl);
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
    const { annualPlan, errorInStore } = this.props;

    if (!annualPlan && is404Error(errorInStore)) return <NotFoundError message="Annual Plan not found" />;

    if (!annualPlan) {
      return (<LoadingMessage message="Fetching Annual Plan.." />);
    }

    return (
      <Fragment>
        <AnnualPlanDetails
          annualPlan={annualPlan}
          deleteAnnualPlan={() => this.showConfirmDeleteModal()}
        />
        <Modal
          title={`Delete ${annualPlan.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteAnnualPlan()}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>
            Do you want to delete this annual plan?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { id } = ownProps.match.params;
  const { annualLessonPlans } = state;
  const annualPlanDetails = annualLessonPlans.get(DETAILS_STORE);
  const errorInStore = annualLessonPlans.get(ERROR_STORE);

  const annualPlan = annualPlanDetails && annualPlanDetails.get(id);

  return {
    annualPlan,
    errorInStore,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAnnualPlanDetails: getDetailsAction,
    deleteAnnualPlan: getDeleteAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnualPlanDetailsContainer);
