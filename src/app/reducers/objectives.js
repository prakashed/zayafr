import {
  DETAILS_STORE,
  getInitialState,
  getUpdatedStore,
  createOrderedMap
} from '../helpers/stateUtils';

import {
  createNewAction,
  createUpdateAction,
  createDeleteAction,
  handleStateUpdate
} from '../helpers/reduxActionUtils';

export const DOMAIN = 'OBJECTIVES';
export const DOMAIN_VIDEO = 'OBJECTIVE-VIDEOS';

const initialState = getInitialState();

export default function objectivesReducer(state = initialState, action) {
  const { type, payload } = action;

  return handleStateUpdate({ state, action, DOMAIN });
}

export function createObjectiveAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function updateObjectiveAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function deleteObjectiveAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}

export function createObjectiveVideoAction(payload) {
  return createNewAction({ domain: DOMAIN_VIDEO, payload });
}

export function deleteObjectiveVideoAction(payload) {
  return createDeleteAction({ domain: DOMAIN_VIDEO, payload });
}
