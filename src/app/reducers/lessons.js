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

export const DOMAIN = 'LESSONS';
export const DOMAIN_VIDEO = 'LESSON-VIDEOS';

const initialState = getInitialState();

export default function lessonsReducer(state = initialState, action) {
  const { type, payload } = action;

  return handleStateUpdate({ state, action, DOMAIN });
}

export function createLessonAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function updateLessonAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function deleteLessonAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}

export function createLessonVideoAction(payload) {
  return createNewAction({ domain: DOMAIN_VIDEO, payload });
}

export function deleteLessonVideoAction(payload) {
  return createDeleteAction({ domain: DOMAIN_VIDEO, payload });
}
