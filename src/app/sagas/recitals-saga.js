import { takeLatest, put, call } from 'redux-saga/effects';

import { DOMAIN } from '../reducers/recitals';

import {
  SHOW_REQUESTED_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_FAILED_MESSAGE
} from '../reducers/general';

import { addNewRecital, updateRecitalDetails } from '../apis/recitals-api';

// import {  addNewTheory} from '../apis/theories-api'

import { getApi } from '../apis';

import { extractErrorMessage } from '../helpers';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  createAPIFailAction,
  isThisRequestActionMine,
  createDetailsAction,
  createListAction
} from '../helpers/reduxActionUtils';

const { NEW, UPDATE } = ACTION_TYPES;

function* createNewRecital(action) {
  try {
    yield put({
      type: SHOW_REQUESTED_MESSAGE,
      payload: { message: 'Creating New Recital' }
    });
    const payload = yield call(addNewRecital, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({
      type: SHOW_SUCCESS_MESSAGE,
      payload: { message: 'New Recital Added!' }
    });
    yield put(createListAction({ domain: 'CURRICULUMS' }));
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
    yield put({
      type: SHOW_FAILED_MESSAGE,
      payload: { message: errorMessage }
    });
  }
}

export function* recitalCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createNewRecital
  );
}

function* updateRecital(action) {
  try {
    const payload = yield call(updateRecitalDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* recitalUpdateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: UPDATE, action }),
    updateRecital
  );
}
