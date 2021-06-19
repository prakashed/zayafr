import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import DailyPlanDetails from './DailyPlanDetails';
import { DETAILS_STORE, ERROR_STORE } from '../../helpers/stateUtils';
import LoadingMessage from '../misc/LoadingMessage';
import routes from '../../constants/routes.json';
import { getDetailsAction, getDeleteAction, getCreateNewReflectionAction } from '../../reducers/daily-plans';
import { is404Error } from '../../helpers';
import NotFoundError from '../misc/NotFoundError';

class DailyPlanDetailsContainer extends Component {
  static propTypes = {
    dailyPlan: PropTypes.shape({
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
    getDailyPlanDetails: PropTypes.func.isRequired,
    deleteDailyPlan: PropTypes.func.isRequired,
    createReflection: PropTypes.func.isRequired,
  }

  static defaultProps = {
    dailyPlan: null,
    errorInStore: null,
  }

  state = {
    showDeleteModal: false,
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { errorInStore } = this.props;
    if (!errorInStore && id) {
      this.props.getDailyPlanDetails(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dailyPlan } = nextProps;
    const { id } = nextProps.match.params;
    const { id: oldId } = this.props.match.params;

    if (((!dailyPlan || !dailyPlan.toDosDetails) && oldId !== id)) {
      this.props.getDailyPlanDetails(id);
    }
  }

  deleteDailyPlan() {
    this.hideConfirmDeleteModal();
    this.props.deleteDailyPlan(this.props.dailyPlan.id);

    const listingUrl = `${routes.daily_plans}`;
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
    const { dailyPlan, createReflection, errorInStore } = this.props;

    if (!dailyPlan && is404Error(errorInStore)) return <NotFoundError message="Daily Plan not found" />;

    if (!dailyPlan) {
      return (<LoadingMessage message="Fetching Daily Plan.." />);
    }

    return (
      <Fragment>
        <DailyPlanDetails
          dailyPlan={dailyPlan}
          deleteDailyPlan={() => this.showConfirmDeleteModal()}
          createReflection={createReflection}
        />
        <Modal
          title={`Delete daily plan for ${dailyPlan.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteDailyPlan()}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>
            Do you want to delete this daily plan?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { id } = ownProps.match.params;
  const { dailyPlans } = state;
  const dailyPlanDetails = dailyPlans.get(DETAILS_STORE);
  const errorInStore = dailyPlans.get(ERROR_STORE);

  const dailyPlan = dailyPlanDetails && dailyPlanDetails.get(id);

  return {
    dailyPlan,
    errorInStore,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDailyPlanDetails: getDetailsAction,
    deleteDailyPlan: getDeleteAction,
    createReflection: getCreateNewReflectionAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyPlanDetailsContainer);
