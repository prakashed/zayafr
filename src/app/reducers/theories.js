import {
  DETAILS_STORE,
  getInitialState,
  getUpdatedStore,
  createOrderedMap,
} from '../helpers/stateUtils';

import {
  createNewAction,
  createUpdateAction,
  handleStateUpdate,
} from '../helpers/reduxActionUtils';

export const DOMAIN = 'THEORIES';

// export const RECITAL_ADD_UNITS_REQUESTED = 'RECITAL/ADD_UNITS_REQUESTED';
// export const RECITAL_ADD_UNITS_SUCCEEDED = 'RECITAL/ADD_UNITS_SUCCEEDED';
// export const RECITAL_ADD_UNITS_FAILED = 'RECITAL/ADD_UNITS_FAILED';

// export const RECITAL_ADD_CUSTOM_UNIT_REQUESTED = 'RECITAL/ADD_CUSTOM_UNIT_REQUESTED';
// export const RECITAL_ADD_CUSTOM_UNIT_SUCCEEDED = 'RECITAL/ADD_CUSTOM_UNIT_SUCCEEDED';
// export const RECITAL_ADD_CUSTOM_UNIT_FAILED = 'RECITAL/ADD_CUSTOM_UNIT_FAILED';

const initialState = getInitialState();

export default function indicesReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  return handleStateUpdate({ state, action, DOMAIN });  
}

export function createTheoryAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function updateTheoryAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

