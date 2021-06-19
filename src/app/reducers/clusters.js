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

export const DOMAIN = 'CLUSTERS';

const initialState = getInitialState();

export default function clusterReducer(state = initialState, action) {
  return handleStateUpdate({ state, action, DOMAIN });
}

export function getClusterListAction() {
  return createListAction({ domain: DOMAIN });
}

export function getNextBatchAction(payload) {
  return createNextBatchAction({ domain: DOMAIN, payload });
}

export function getClustersSearchAction(payload) {
  return createSearchAction({ domain: DOMAIN, payload });
}

export function createClusterAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function getClusterDetailsAction(payload) {
  return createDetailsAction({ domain: DOMAIN, payload });
}

export function updateClusterAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function deleteClusterAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}
