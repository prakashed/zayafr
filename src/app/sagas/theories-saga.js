import { takeLatest, put, call } from 'redux-saga/effects';

import { DOMAIN } from '../reducers/theories';

import {
  SHOW_REQUESTED_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_FAILED_MESSAGE
} from '../reducers/general';

import { addNewTheory, updateTheoryDetails } from '../apis/theories-api';

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

function* createNewTheory(action) {
  try {
    yield put({
      type: SHOW_REQUESTED_MESSAGE,
      payload: { message: 'Creating New Theory' }
    });
    const payload = yield call(addNewTheory, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({
      type: SHOW_SUCCESS_MESSAGE,
      payload: { message: 'New Theory Added!' }
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

export function* theoryCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createNewTheory
  );
}

function* updateTheory(action) {
  try {
    const payload = yield call(updateTheoryDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* theoryUpdateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: UPDATE, action }),
    updateTheory
  );
}
