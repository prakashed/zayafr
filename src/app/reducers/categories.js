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

export const DOMAIN = 'CATEGORIES';
export const DOMAIN_VIDEO = 'CATEGORIES-VIDEOS';

const initialState = getInitialState();

export default function categoriesReducer(state = initialState, action) {
  const { type, payload } = action;

  return handleStateUpdate({ state, action, DOMAIN });
}

export function createCategoryAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function updateCategoryAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function deleteCategoryAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}

export function createCategoryVideoAction(payload) {
  return createNewAction({ domain: DOMAIN_VIDEO, payload });
}

export function deleteCategoryVideoAction(payload) {
  return createDeleteAction({ domain: DOMAIN_VIDEO, payload });
}
