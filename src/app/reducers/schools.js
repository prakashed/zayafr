import { getInitialState } from '../helpers/stateUtils';

import {
  createListAction,
  createSearchAction,
  createUpdateAction,
  createNewAction,
  createDetailsAction,
  createDeleteAction,
  handleStateUpdate,
  createNextBatchAction
} from '../helpers/reduxActionUtils';

export const DOMAIN = 'CENTERS';

const initialState = getInitialState();

export default function schoolsReducer(state = initialState, action) {
  return handleStateUpdate({ state, action, DOMAIN });
}

export function getSchoolListAction() {
  return createListAction({ domain: DOMAIN });
}

export function getSchoolDetailsAction(payload) {
  return createDetailsAction({ domain: DOMAIN, payload });
}

export function getNextBatchAction(payload) {
  return createNextBatchAction({ domain: DOMAIN, payload });
}

export function getSchoolSearchAction(payload) {
  return createSearchAction({ domain: DOMAIN, payload });
}

export function createSchoolAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function updateSchoolAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function deleteSchoolAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}
