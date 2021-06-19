import { takeLatest, put, call } from 'redux-saga/effects';

import {
  fetchDailyPlans,
  addNewDailyLessonPlan,
  fetchDailyPlanDetails,
  removeDailyPlan,
  updateDailyPlan,
  removeToDo,
  createToDos,
  createReflection,
} from '../apis/daily-plan-api';

import { DOMAIN, TODO_DOMAIN, REFLECTION_DOMAIN, getDetailsAction as getDailyPlanDetailsAction } from '../reducers/daily-plans';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  createAPIFailAction,
  isThisRequestActionMine,
} from '../helpers/reduxActionUtils';

import { parseDailyPlan } from '../helpers';

const {
  LIST, NEW, DETAILS, DELETE, UPDATE, SEARCH,
} = ACTION_TYPES;

function* getDailyPlanList(action) {
  try {
    const { results, count } = yield call(fetchDailyPlans, action.payload);
    const parsedResults = results.map(dailyPlan => parseDailyPlan(dailyPlan));
    const payload = { data: parsedResults, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* dailyPlanListSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: LIST, action }),
    getDailyPlanList,
  );
}

export function* dailyPlanFilterSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: SEARCH, action }),
    getDailyPlanList,
  );
}

function* getDailyPlanDetails(action) {
  try {
    const dailyPlan = yield call(fetchDailyPlanDetails, action.payload);
    const payload = parseDailyPlan(dailyPlan);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* dailyPlanDetailsSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN, type: DETAILS, action }),
    getDailyPlanDetails,
  );
}

function* createDailyPlan(action) {
  try {
    const dailyPlan = yield call(addNewDailyLessonPlan, action.payload);
    const payload = parseDailyPlan(dailyPlan);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* dailyPlanCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createDailyPlan,
  );
}

function* updateDailyPlanFn(action) {
  try {
    const dailyPlan = yield call(updateDailyPlan, action.payload);
    const payload = parseDailyPlan(dailyPlan);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* dailyPlanUpdateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: UPDATE, action }),
    updateDailyPlanFn,
  );
}

function* deleteDailyPlan(action) {
  try {
    yield call(removeDailyPlan, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* dailyPlanDeleteSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: DELETE, action }),
    deleteDailyPlan,
  );
}

function* createToDosFn(action) {
  try {
    const payload = yield call(createToDos, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* toDosCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: TODO_DOMAIN, type: NEW, action }),
    createToDosFn,
  );
}

function* deleteToDo(action) {
  try {
    yield call(removeToDo, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* toDoDeleteSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: TODO_DOMAIN, type: DELETE, action }),
    deleteToDo,
  );
}

function* createReflectionFn(action) {
  try {
    const payload = yield call(createReflection, action.payload);
    const { dailyPlan } = payload;
    // yield put(createAPISuccessAction({ ...action, payload }));
    // Fetch daily plan details to get the updated reflections and todo list
    yield put(getDailyPlanDetailsAction(dailyPlan));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* reflectionCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: REFLECTION_DOMAIN, type: NEW, action }),
    createReflectionFn,
  );
}
