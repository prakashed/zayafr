import { getInitialState } from '../helpers/stateUtils';

import {
  createNewAction,
  createListAction,
  createSearchAction,
  createDetailsAction,
  createUpdateAction,
  createDeleteAction,
  handleStateUpdate,
} from '../helpers/reduxActionUtils';

import { SET_SCHOOL } from './auth';

export const DOMAIN = 'CLASSROOM';

const initialState = getInitialState();

export default function classroomReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case SET_SCHOOL:
      return initialState;
    default:
      return handleStateUpdate({ state, action, DOMAIN });
  }
}

export function getClassroomsListAction(payload) {
  return createListAction({ domain: DOMAIN, payload });
}

export function getClassroomFilterAction(payload) {
  return createSearchAction({ domain: DOMAIN, payload });
}

export function getClassroomDetailsAction(payload) {
  return createDetailsAction({ domain: DOMAIN, payload });
}

export function createClassroomAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function updateClassroomAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function deleteClassroomAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}
