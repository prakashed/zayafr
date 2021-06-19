import {
  DETAILS_STORE,
  getInitialState,
  getUpdatedStore,
  createOrderedMap,
} from '../helpers/stateUtils';

import {
  createNewAction,
  createListAction,
  createSearchAction,
  createDetailsAction,
  createUpdateAction,
  createDeleteAction,
  handleStateUpdate,
  createNextBatchAction,
} from '../helpers/reduxActionUtils';

export const DOMAIN = 'CURRICULUMS';

export const RECITAL_ADD_UNITS_REQUESTED = 'RECITAL/ADD_UNITS_REQUESTED';
export const RECITAL_ADD_UNITS_SUCCEEDED = 'RECITAL/ADD_UNITS_SUCCEEDED';
export const RECITAL_ADD_UNITS_FAILED = 'RECITAL/ADD_UNITS_FAILED';

export const RECITAL_ADD_CUSTOM_UNIT_REQUESTED = 'RECITAL/ADD_CUSTOM_UNIT_REQUESTED';
export const RECITAL_ADD_CUSTOM_UNIT_SUCCEEDED = 'RECITAL/ADD_CUSTOM_UNIT_SUCCEEDED';
export const RECITAL_ADD_CUSTOM_UNIT_FAILED = 'RECITAL/ADD_CUSTOM_UNIT_FAILED';

const initialState = getInitialState();

export default function indicesReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case RECITAL_ADD_UNITS_SUCCEEDED: {
      // got new updated recital as payload
      const newDataMap = createOrderedMap(payload);
      return getUpdatedStore({ state, storeType: DETAILS_STORE, newDataMap });
    }
    default: {
      return handleStateUpdate({ state, action, DOMAIN });
    }
  }
}

export function getCurriculumsListAction() {
  return createListAction({ domain: DOMAIN });
}

export function getNextBatchAction(payload) {
  return createNextBatchAction({ domain: DOMAIN, payload });
}

export function getCurriculumsSearchAction(payload) {
  return createSearchAction({ domain: DOMAIN, payload });
}

export function getCurriculumsDetailsAction(payload) {
  return createDetailsAction({ domain: DOMAIN, payload });
}

export function createCurriculumAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function updateCurriculumAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function deleteCurriculumAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}

// export function addUnitsToRecitalAction(payload) {
//   return {
//     type: RECITAL_ADD_UNITS_REQUESTED,
//     payload,
//   };
// }

// export function addCustomUnitToRecitalAction(payload) {
//   return {
//     type: RECITAL_ADD_CUSTOM_UNIT_REQUESTED,
//     payload,
//   };
// }
