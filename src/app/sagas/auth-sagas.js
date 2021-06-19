import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import cookie from 'js-cookie';

import {
  loginToOCM,
  loginToFSM,
  login,
  fetchPermissions
} from '../apis/auth-api';

import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGOUT_REQUESTED,
  LOGOUT_SUCCEEDED,
  LOGOUT_FAILED,
  PERMISSIONS_REQUESTED,
  PERMISSIONS_SUCCEEDED,
  PERMISSIONS_FAILED
} from '../reducers/auth';

function* fetchTokenAndUser(action) {
  try {
    const { username, password, remember } = action.payload;
    // const ocmLoginResponse = yield call(loginToOCM, username, password);
    // const profileId = ocmLoginResponse.data.teacher.id;
    // const fsmLoginResponse = yield call(loginToFSM, profileId);

    const loginResponse = yield call(login, username, password);
    const { key, userRoleAccount } = loginResponse;
    const { uraId: userRoleAccountId } = userRoleAccount;
    localStorage.setItem('userRoleAccountId', userRoleAccountId);
    if (remember === true) {
      cookie.set('token', key, { expires: 2 });
    } else {
      cookie.set('token', key);
    }
    yield put({ type: LOGIN_SUCCEEDED, payload: loginResponse });
  } catch (err) {
    yield put({ type: LOGIN_FAILED, err });
  }
}

function* logoutUser() {
  try {
    cookie.remove('token');
    localStorage.removeItem('user');
    localStorage.removeItem('school');
    localStorage.removeItem('userRoleAccountId');
    yield put({ type: LOGOUT_SUCCEEDED });
  } catch (err) {
    yield put({ type: LOGOUT_FAILED, err });
  }
}

export function* authSaga() {
  yield takeEvery(LOGIN_REQUESTED, fetchTokenAndUser);
}

export function* logoutSaga() {
  yield takeLatest(LOGOUT_REQUESTED, logoutUser);
}

function* getPermissions() {
  try {
    const permissions = yield call(fetchPermissions);
    yield put({ type: PERMISSIONS_SUCCEEDED, payload: permissions });
  } catch (err) {
    cookie.remove('token');
    localStorage.removeItem('user');
    localStorage.removeItem('school');
    localStorage.removeItem('userRoleAccountId');
    yield put({ type: LOGOUT_SUCCEEDED });
    yield put({ type: PERMISSIONS_FAILED, err });
  }
}

export function* permissionsSaga() {
  yield takeLatest(PERMISSIONS_REQUESTED, getPermissions);
}
