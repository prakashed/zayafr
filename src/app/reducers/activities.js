import { getInitialState } from '../helpers/stateUtils';

import {
  createNewAction,
  createListAction,
  createNextBatchAction,
  createSearchAction,
  createDetailsAction,
  createUpdateAction,
  createDeleteAction,
  handleStateUpdate,
} from '../helpers/reduxActionUtils';

export const DOMAIN = 'ACTIVITIES';

const initialState = getInitialState();

export default function activitiesReducer(state = initialState, action) {
  return handleStateUpdate({ state, action, DOMAIN });
}

export function createActivityAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function deleteActivityAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}

export function updateActivityAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function getActivityDetailsAction(payload) {
  return createDetailsAction({ domain: DOMAIN, payload });
}

export function getActivitiesAction() {
  return createListAction({ domain: DOMAIN });
}

export function getNextBatchAction(payload) {
  return createNextBatchAction({ domain: DOMAIN, payload });
}

export function getSearchActivitiesAction(payload) {
  return createSearchAction({ domain: DOMAIN, payload });
}
