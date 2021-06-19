// The use of these util functions is to break down a action type
// such as SCHOOL_LIST_REQUESTED into more detailed and generalised action objects
/**
 * SCHOOL_LIST_REQUESTED can be written as
 * {
 *  domain: SCHOOL, (can be CLUSTER, RECITALS, USER, BOOKS etc.)
 *  type: LIST, (can be NEW, DETAILS, UPDATE, DELETE etc.)
 *  status: REQUESTED (can be SUCCESS, FAILED etc.)
 * }
 *
 * Additionally we can add some extra info such as subtype to have finer control
 * E.g. subtype can be API action or APP action, these additional info can be used by middlewares
 * or different functions to use in respective ways
 */
import { LOGOUT_SUCCEEDED } from '../reducers/auth';

import {
  LIST_STORE,
  DETAILS_STORE,
  getNewStore,
  getUpdatedStore,
  deleteFromStore,
  updateBothStores,
  createOrderedMap,
  getInitialState,
  setTotalCountStore,
  setSearchCountStore,
  setNextBatchUrlStore,
  setErrorStore
} from '../helpers/stateUtils';

// Different types of Actions that can be formed
export const ACTION_TYPES = {
  LIST: 'LIST',
  NEXT_BATCH: 'NEXT-BATCH',
  NEW: 'NEW',
  DETAILS: 'DETAILS',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SEARCH: 'SEARCH'
};

// Used to identify the status of the action
export const STATUS_TYPES = {
  REQUESTED: 'REQUESTED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};

// Action Sub-Types which can provide additional info
// For Eg.
// A middleware can check for API subtype and use the status info
// to show appropriate progress
export const API_ACTION = 'ACTION/API';
export const APP_ACTION = 'ACTION/APP';

export function createAPIAction(args) {
  return {
    ...args,
    subtype: API_ACTION
  };
}

export function createAppAction(args) {
  return {
    ...args,
    subtype: APP_ACTION
  };
}

// Specific Request Actions
export function createNewAction(args) {
  return createAPIAction({
    ...args,
    type: ACTION_TYPES.NEW,
    status: STATUS_TYPES.REQUESTED
  });
}

export function createListAction(args) {
  return createAPIAction({
    ...args,
    type: ACTION_TYPES.LIST,
    status: STATUS_TYPES.REQUESTED
  });
}

export function createNextBatchAction(args) {
  return createAPIAction({
    ...args,
    type: ACTION_TYPES.NEXT_BATCH,
    status: STATUS_TYPES.REQUESTED
  });
}

export function createSearchAction(args) {
  return createAPIAction({
    ...args,
    type: ACTION_TYPES.SEARCH,
    status: STATUS_TYPES.REQUESTED
  });
}

export function createDetailsAction(args) {
  return createAPIAction({
    ...args,
    type: ACTION_TYPES.DETAILS,
    status: STATUS_TYPES.REQUESTED
  });
}

export function createUpdateAction(args) {
  return createAPIAction({
    ...args,
    type: ACTION_TYPES.UPDATE,
    status: STATUS_TYPES.REQUESTED
  });
}

export function createDeleteAction(args) {
  return createAPIAction({
    ...args,
    type: ACTION_TYPES.DELETE,
    status: STATUS_TYPES.REQUESTED
  });
}

// API Success Action
export function createAPISuccessAction(args) {
  return createAPIAction({
    ...args,
    status: STATUS_TYPES.SUCCESS
  });
}

// API Failed Action
export function createAPIFailAction(args) {
  return createAPIAction({
    ...args,
    status: STATUS_TYPES.FAILED
  });
}

// Checks if an action is related for specific DOMAIN, type and
// status is REQUESTED (hardcoded)
export const isThisRequestActionMine = ({ domain, type, action }) =>
  action.domain === domain &&
  action.type === type &&
  action.status === STATUS_TYPES.REQUESTED;

function handleSuccessStateUpdate({ state, action }) {
  const { type, payload } = action;

  const {
    LIST,
    SEARCH,
    UPDATE,
    NEW,
    DELETE,
    DETAILS,
    NEXT_BATCH
  } = ACTION_TYPES;

  switch (type) {
    case LIST: {
      const { data, count, next } = payload;
      const newDataMap = createOrderedMap(data);

      const updatedState = updateBothStores({
        state,
        storeType: LIST_STORE,
        newDataMap
      });

      const searchResetState = setSearchCountStore({
        state: updatedState,
        count: 0
      });

      const totalCountState = setTotalCountStore({
        state: searchResetState,
        count
      });

      // return totalCountState;
      return setNextBatchUrlStore({ state: totalCountState, next });
    }
    case NEXT_BATCH: {
      const { data, next } = payload;

      const newDataMap = createOrderedMap(data);

      const updatedState = updateBothStores({
        state,
        storeType: LIST_STORE,
        newDataMap
      });

      return setNextBatchUrlStore({ state: updatedState, next });
    }
    case SEARCH: {
      const { data, count } = payload;
      const newDataMap = createOrderedMap(data);

      const newState = getNewStore({
        state,
        storeType: LIST_STORE,
        newDataMap
      });

      return setSearchCountStore({ state: newState, count });
    }
    case DETAILS: {
      const newDataMap = createOrderedMap(payload);

      return getUpdatedStore({
        state,
        storeType: DETAILS_STORE,
        newDataMap
      });
    }
    case NEW: {
      const newDataMap = createOrderedMap(payload);
      return updateBothStores({ state, newDataMap });
    }
    case UPDATE: {
      const newDataMap = createOrderedMap(payload);

      return updateBothStores({ state, newDataMap });
    }
    case DELETE: {
      const deletedListStore = deleteFromStore({
        state,
        storeType: LIST_STORE,
        id: payload
      });
      const deletedDetailsStore = deleteFromStore({
        state: deletedListStore,
        storeType: DETAILS_STORE,
        id: payload
      });

      return deletedListStore.merge(deletedDetailsStore);
    }
    case LOGOUT_SUCCEEDED: {
      return getInitialState();
    }
    default:
      return state;
  }
}

export function handleStateUpdate({ state, action, DOMAIN }) {
  console.log(action);
  const { payload, domain, status } = action;

  if (domain && domain !== DOMAIN) return state;

  if (status && status === STATUS_TYPES.FAILED) {
    const { err } = payload;
    return setErrorStore({ state, error: err });
  }

  if (status && status !== STATUS_TYPES.SUCCESS) return state;

  // reset error store when success action happens
  const errorResetState = setErrorStore({ state, error: null });

  return handleSuccessStateUpdate({ state: errorResetState, action });
}
