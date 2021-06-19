import _ from 'lodash';
import {
  getInitialState,
  DETAILS_STORE,
  createOrderedMap,
  updateBothStores
} from '../helpers/stateUtils';

import {
  createNewAction,
  createListAction,
  createDetailsAction,
  createUpdateAction,
  createDeleteAction,
  handleStateUpdate,
  APP_ACTION,
  createSearchAction
} from '../helpers/reduxActionUtils';

import { parseAnnualPlan } from '../helpers';

import { SET_SCHOOL } from './auth';

export const DOMAIN = 'ANNUAL_PLANS';

const CUSTOM_RECITAL_DELETE_SUCCEDED = 'CUSTOM_RECITAL/DELETE/SUCCESS';
const CUSTOM_RECITAL_NEW_SUCCEDED = 'CUSTOM_RECITAL/NEW/SUCCESS';

function updateCustomRecitalsInAnnualPlan({
  state,
  annualPlan,
  customRecitals
}) {
  const updatedAnnualPlan = parseAnnualPlan({
    ...annualPlan,
    customRecitalDetails: customRecitals
  });
  const newDataMap = createOrderedMap(updatedAnnualPlan);

  return updateBothStores({
    state,
    newDataMap
  });
}

function handleNewCustomRecital(state, payload) {
  const { annualPlanId, newCustomRecitals } = payload;
  const annualPlanDetails = state.get(DETAILS_STORE);
  const annualPlan = annualPlanDetails.get(annualPlanId);
  const { customRecitalDetails } = annualPlan;
  return updateCustomRecitalsInAnnualPlan({
    state,
    annualPlan,
    customRecitals: [...customRecitalDetails, ...newCustomRecitals]
  });
}

function handleCustomRecitalDelete(state, payload) {
  const { annualPlanId, customRecitalIds: deletedCustomRecitalIds } = payload;
  const annualPlanDetails = state.get(DETAILS_STORE);
  const annualPlan = annualPlanDetails.get(annualPlanId);
  const { customRecitalDetails } = annualPlan;
  const customRecitalObj = _.keyBy(customRecitalDetails, 'id');
  for (let i = 0; i < deletedCustomRecitalIds.length; i += 1) {
    const deletedId = deletedCustomRecitalIds[i];
    delete customRecitalObj[deletedId];
  }
  const remainingCustomRecitals = _.values(customRecitalObj);
  return updateCustomRecitalsInAnnualPlan({
    state,
    annualPlan,
    customRecitals: remainingCustomRecitals
  });
}

const initialState = getInitialState();

export default function indicesReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case SET_SCHOOL:
      return initialState;
    case CUSTOM_RECITAL_DELETE_SUCCEDED:
      return handleCustomRecitalDelete(state, action.payload);
    case CUSTOM_RECITAL_NEW_SUCCEDED:
      return handleNewCustomRecital(state, action.payload);
    default:
      return handleStateUpdate({ state, action, DOMAIN });
  }
}

export function getListAction(payload) {
  return createListAction({ domain: DOMAIN, payload });
}

// export function getAnnualPlansSearchAction(payload) {
//   return createAPIAction({ type: ANNUAL_PLAN_SEARCH_REQUESTED, payload });
// }

export function getSearchAction(payload) {
  return createSearchAction({ domain: DOMAIN, payload });
}

export function getDetailsAction(payload) {
  return createDetailsAction({ domain: DOMAIN, payload });
}

export function getCreateNewAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function getUpdateAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function getDeleteAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}

export function getCustomRecitalDeletedAction(payload) {
  return {
    type: CUSTOM_RECITAL_DELETE_SUCCEDED,
    subtype: APP_ACTION,
    payload
  };
}

export function getCustomRecitalAddedAction(payload) {
  return {
    type: CUSTOM_RECITAL_NEW_SUCCEDED,
    subtype: APP_ACTION,
    payload
  };
}

// New reducers

export function createAnnualPlanAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function deleteAnnualPlanAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}
