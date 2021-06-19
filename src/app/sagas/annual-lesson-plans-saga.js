import { takeLatest, put, call } from 'redux-saga/effects';

import {
  fetchAnnualLessonPlans,
  fetchAnnualLessonPlanDetails,
  addNewAnnualLessonPlan,
  updateAnnualPlan,
  removeAnnualPlan
} from '../apis/annual-lesson-plan-api';

import { SHOW_FAILED_MESSAGE } from '../reducers/general';

import { DOMAIN } from '../reducers/annual-plans';

import { extractErrorMessage } from '../helpers';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  createAPIFailAction,
  isThisRequestActionMine,
  createDetailsAction
} from '../helpers/reduxActionUtils';

import { parseAnnualPlan } from '../helpers';

const { LIST, NEW, DETAILS, DELETE, UPDATE, SEARCH } = ACTION_TYPES;

function* getAnnualLessonPlanList(action) {
  try {
    const { results, count } = yield call(
      fetchAnnualLessonPlans,
      action.payload
    );
    const parsedResults = results.map(annualPlan =>
      parseAnnualPlan(annualPlan)
    );
    const payload = { data: parsedResults, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* annualLessonPlanListSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: LIST, action }),
    getAnnualLessonPlanList
  );
}

function* searchForAnnualPlans(action) {
  try {
    const { results, count } = yield call(
      fetchAnnualLessonPlans,
      action.payload
    );
    const parsedResults = results.map(annualPlan =>
      parseAnnualPlan(annualPlan)
    );
    const payload = { data: parsedResults, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* searchAnnualPlansSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: SEARCH, action }),
    searchForAnnualPlans
  );
}

function* getAnnualPlanDetails(action) {
  try {
    const annualPlan = yield call(fetchAnnualLessonPlanDetails, action.payload);
    const payload = parseAnnualPlan(annualPlan);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* annualLessonPlanDetailsSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN, type: DETAILS, action }),
    getAnnualPlanDetails
  );
}

function* createAnnualLessonPlan(action) {
  try {
    const payload = yield call(addNewAnnualLessonPlan, action.payload);

    yield put(createAPISuccessAction({ ...action, payload }));

    // yield put({
    //   type: SHOW_SUCCESS_MESSAGE,
    //   payload: { message: 'New Annual Plan Added!' }
    // });

    const schoolId = payload ? payload.school : null;

    if (schoolId) {
      yield put(createDetailsAction({ domain: 'CENTERS', payload: schoolId }));
    }
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    // const payload = { err };
    // yield put(createAPIFailAction({ ...action, payload }));
    // debugger;
    yield put({
      type: SHOW_FAILED_MESSAGE,
      payload: { message: errorMessage }
    });
  }
}

export function* annualLessonPlanCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createAnnualLessonPlan
  );
}

function* updateAnnualLessonPlan(action) {
  try {
    const annualPlan = yield call(updateAnnualPlan, action.payload);
    const payload = parseAnnualPlan(annualPlan);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* annualLessonPlanUpdateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: UPDATE, action }),
    updateAnnualLessonPlan
  );
}

function* deleteAnnualPlan(action) {
  try {
    yield call(removeAnnualPlan, action.payload.id);

    yield put(createAPISuccessAction(action));
    const schoolId = action.payload.school ? action.payload.school : null;
    if (schoolId) {
      yield put(createDetailsAction({ domain: 'CENTERS', payload: schoolId }));
    }
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* annualLessonPlanDeleteSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: DELETE, action }),
    deleteAnnualPlan
  );
}
