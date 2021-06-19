import { getInitialState } from '../helpers/stateUtils';

import {
  createNewAction,
  createListAction,
  createNextBatchAction,
  createSearchAction,
  createDetailsAction,
  createDeleteAction,
  handleStateUpdate,
} from '../helpers/reduxActionUtils';

export const DOMAIN = 'BOOKS';

const initialState = getInitialState();

export default function booksReducer(state = initialState, action) {
  return handleStateUpdate({ state, action, DOMAIN });
}

export function createBookAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function deleteBookAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}

export function getBookDetailsAction(payload) {
  return createDetailsAction({ domain: DOMAIN, payload });
}

export function getBooksAction() {
  return createListAction({ domain: DOMAIN });
}

export function getNextBatchAction(payload) {
  return createNextBatchAction({ domain: DOMAIN, payload });
}

export function getSearchBooksAction(payload) {
  return createSearchAction({ domain: DOMAIN, payload });
}
