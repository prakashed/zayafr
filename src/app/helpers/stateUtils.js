import { Map, OrderedMap } from 'immutable';
import _ from 'lodash';
// State corresponds to one state data of one kind
// E.g. State for Schools or Recitals
// Each State has two properties namely store
// 1) list -> Used to store data corresponding to listing component
// 2) details -> Used to store data corresponding to details component

// Schema
/**
 * state => Map({
 *  list: Map({}),
 *  details: Map({})
 * })
 *
 * list/details => Map({
 *  id => object{}
 * })
 */

// State ==> The map containing both stores
// StoreType ==> List or Details
// newDataMap ==> The new data map corresponding to the store

export const LIST_STORE = 'list';
export const DETAILS_STORE = 'details';
export const TOTAL_COUNT_STORE = 'totalCount';
export const SEARCH_COUNT_STORE = 'searchCount';
export const NEXT_BATCH_URL_STORE = 'nextBatchUrl';
export const ERROR_STORE = 'error';

export const getInitialState = () => Map({
  list: null,
  details: null,
  nextBatchUrl: null,
  totalCount: 0,
  searchCount: 0,
  error: null,
});

export function setTotalCountStore({ state, count }) {
  if (!state) return state;

  return state.set(TOTAL_COUNT_STORE, count);
}

export function setSearchCountStore({ state, count }) {
  if (!state) return state;

  return state.set(SEARCH_COUNT_STORE, count);
}

export function setNextBatchUrlStore({ state, next }) {
  if (!state) return state;

  return state.set(NEXT_BATCH_URL_STORE, next);
}

export function setErrorStore({ state, error }) {
  if (!state) return state;

  return state.set(ERROR_STORE, error);
}

// Overwrite and create a new store

export function getNewStore({ state, storeType, newDataMap }) {
  if (!state) return state;
  return state.set(storeType, newDataMap);
}

export function getUpdatedStore({ state, storeType, newDataMap }) {
  if (!state) return state;
  const store = state.get(storeType) || OrderedMap();
  if (!store) return state;
  const updatedStore = store.merge(newDataMap);
  return state.set(storeType, updatedStore);
}

export function deleteFromStore({ state, storeType, id }) {
  if (!state) return state;
  const store = state.get(storeType);
  if (!store) return state;
  return state.set(storeType, store.delete(id));
}

export function updateBothStores({ state, newDataMap }) {
  const updatedDetailsState = getUpdatedStore({
    state,
    storeType: DETAILS_STORE,
    newDataMap,
  });

  return getUpdatedStore({
    state: updatedDetailsState,
    storeType: LIST_STORE,
    newDataMap,
  });
}

export function createOrderedMap(data) {
  // console.log('received this data --> ', data);
  if (!data || _.isNull(data)) return data;

  // Received an array of data objects
  // Create an object of ids as key and values as data object
  // Then create an Ordered Map from this object
  if (data instanceof Array) {
    return new OrderedMap(data.map((obj) => {
      // Make all ids as strings
      const parsedObj = { ...obj };
      parsedObj.id = `${obj.id}`;
      return [parsedObj.id, parsedObj];
    }));
  }

  // Received a single instance of data object
  // Create an Ordered Map of this data
  // Which will be merged with the entire data set
  if (data instanceof Object) {
    const parsedData = { ...data };
    parsedData.id = `${data.id}`;
    const obj = {};
    obj[parsedData.id] = parsedData;
    return new OrderedMap(obj);
  }

  // Nothing matches, just return the data
  return data;
}
