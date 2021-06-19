import {
  getInitialState,
  // DETAILS_STORE,
  // createOrderedMap,
  // updateBothStores,
} from '../helpers/stateUtils';

import {
  createNewAction,
  createListAction,
  // createDetailsAction,
  // createUpdateAction,
  // createDeleteAction,
  handleStateUpdate,
  // APP_ACTION,
} from '../helpers/reduxActionUtils';

export const DOMAIN = 'PORTION';

const initialState = getInitialState();

export default function indicesReducer(state = initialState, action) {
  return handleStateUpdate({ state, action, DOMAIN });
}

export function getListAction(payload) {
  return createListAction({ domain: DOMAIN, payload });
}

// export function getDetailsAction(payload) {
//   return createDetailsAction({ domain: DOMAIN, payload });
// }

export function getCreateNewAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

// export function getUpdateAction(payload) {
//   return createUpdateAction({ domain: DOMAIN, payload });
// }

// export function getDeleteAction(payload) {
//   return createDeleteAction({ domain: DOMAIN, payload });
// }
