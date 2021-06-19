import { takeLatest, put, call } from 'redux-saga/effects';

import { DOMAIN, SESSION_ADD, SESSION_READ } from '../reducers/sessions';

import { extractErrorMessage } from '../helpers';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  isThisRequestActionMine
} from '../helpers/reduxActionUtils';

const { NEW, DETAILS } = ACTION_TYPES;

function* createSession(action) {
  try {
    const payload = action.payload;
    yield put({ type: SESSION_ADD, payload: payload });
  } catch (err) {
    // yield put({ type: LOGIN_FAILED, err });
  }
}

export function* sessionCreateSaga() {
  yield put(SESSION_ADD, createSession);
}
