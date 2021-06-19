import { getInitialState, DETAILS_STORE, createOrderedMap, updateBothStores } from '../helpers/stateUtils';

import {
  createNewAction,
  createListAction,
  createDetailsAction,
  createUpdateAction,
  createDeleteAction,
  handleStateUpdate,
  createSearchAction,
  ACTION_TYPES,
} from '../helpers/reduxActionUtils';

import { SET_SCHOOL } from './auth';

const { DELETE, CREATE } = ACTION_TYPES;

export const DOMAIN = 'DAILY_PLANS';

export const TODO_DOMAIN = 'TODOS';

export const REFLECTION_DOMAIN = 'REFLECTIONS';

const initialState = getInitialState();

function addNewToDoToState(state, action) {
  // console.log('add these todos to state --> ', action);
  return state;
}

function removeToDoFromState(state, action) {
  const dailyPlanDetails = state.get(DETAILS_STORE);
  const { payload: todoId, dailyPlan: dailyPlanId } = action;
  const dailyPlan = dailyPlanDetails.get(dailyPlanId);

  if (!dailyPlan) return state;

  const { toDosDetails } = dailyPlan;
  const pos = toDosDetails.findIndex(t => t.id === todoId);

  if (pos === -1) return state;

  const newTodos = [
    ...toDosDetails.slice(0, pos),
    ...toDosDetails.slice(pos + 1),
  ];

  const updatedDailyPlan = {
    ...dailyPlan,
    toDosDetails: newTodos,
  };

  const newDataMap = createOrderedMap(updatedDailyPlan);

  return updateBothStores({
    state,
    newDataMap,
  });
}

function handleToDoDomain(state, action) {
  const { type } = action;

  switch (type) {
    case CREATE:
      return addNewToDoToState(state, action);
    case DELETE:
      return removeToDoFromState(state, action);
    default:
      return state;
  }
}

function handleDailyPlanDomain(state, action) {
  const { type } = action;

  switch (type) {
    case SET_SCHOOL:
      return initialState;
    default:
      return handleStateUpdate({ state, action, DOMAIN });
  }
}

export default function indicesReducer(state = initialState, action) {
  const { domain } = action;

  switch (domain) {
    case TODO_DOMAIN:
      return handleToDoDomain(state, action);
    default:
      return handleDailyPlanDomain(state, action);
  }
}

export function getListAction(payload) {
  return createListAction({ domain: DOMAIN, payload });
}

export function getSearchAction(payload) {
  return createSearchAction({ domain: DOMAIN, payload });
}

export function getDetailsAction(payload) {
  return createDetailsAction({ domain: DOMAIN, payload });
}

export function getCreateNewAction(payload) {
  return createNewAction({ domain: DOMAIN, payload });
}

export function getUpdateAction(payload) {
  return createUpdateAction({ domain: DOMAIN, payload });
}

export function getDeleteAction(payload) {
  return createDeleteAction({ domain: DOMAIN, payload });
}

export function getCreateNewToDoAction(payload) {
  return createNewAction({ domain: TODO_DOMAIN, payload });
}

export function getDeleteToDoAction({ toDoId, dailyPlan }) {
  return createDeleteAction({ domain: TODO_DOMAIN, payload: toDoId, dailyPlan });
}

export function getCreateNewReflectionAction(payload) {
  return createNewAction({ domain: REFLECTION_DOMAIN, payload });
}
