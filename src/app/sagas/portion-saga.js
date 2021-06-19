import { takeLatest, put, call } from 'redux-saga/effects';

import { createNewPortion, filterPortions } from '../apis/annual-lesson-plan-api';

import { DOMAIN } from '../reducers/portions';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  createAPIFailAction,
  isThisRequestActionMine,
} from '../helpers/reduxActionUtils';

const {
  NEW,
  LIST,
  // DETAILS,
  // DELETE,
  // UPDATE,
} = ACTION_TYPES;

function* createPortion(action) {
  try {
    const payload = yield call(createNewPortion, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* portionCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createPortion,
  );
}

function* handleFilterPortion(action) {
  try {
    const { results, count } = yield call(filterPortions, action.payload);
    const payload = { data: results, count };
    console.log('got list of portions --> ', payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* portionFilterSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: LIST, action }),
    handleFilterPortion,
  );
}
