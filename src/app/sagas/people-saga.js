import { takeLatest, put, call } from 'redux-saga/effects';

import {
  TEACHER_LIST_REQUESTED,
  TEACHER_LIST_SUCCEEDED,
  TEACHER_LIST_FAILED,
  TEACHER_DETAILS_REQUESTED,
  TEACHER_DETAILS_SUCCEEDED,
  TEACHER_DETAILS_FAILED,
  USER_LIST_REQUESTED,
  USER_LIST_SUCCEEDED,
  USER_LIST_FAILED,
  USER_DETAILS_REQUESTED,
  USER_DETAILS_SUCCEEDED,
  USER_DETAILS_FAILED,
} from '../reducers/people';

import {
  fetchTeacherList,
  fetchTeacherDetails,
  fetchUserList,
  fetchUserDetails,
} from '../apis/people-api';

function* getTeacherList() {
  try {
    const { results, count } = yield call(fetchTeacherList);
    yield put({ type: TEACHER_LIST_SUCCEEDED, payload: { teachers: results, count } });
  } catch (err) {
    yield put({ type: TEACHER_LIST_FAILED, payload: { err } });
  }
}

export function* teacherListSaga() {
  yield takeLatest(TEACHER_LIST_REQUESTED, getTeacherList);
}

function* getTeacherDetails({ payload }) {
  try {
    const teacher = yield call(fetchTeacherDetails, payload);
    yield put({ type: TEACHER_DETAILS_SUCCEEDED, payload: teacher });
  } catch (err) {
    yield put({ type: TEACHER_DETAILS_FAILED, payload: { err } });
  }
}

export function* teacherDetailsSaga() {
  yield takeLatest(TEACHER_DETAILS_REQUESTED, getTeacherDetails);
}


function* getUserList() {
  try {
    const { results, count } = yield call(fetchUserList);
    yield put({ type: USER_LIST_SUCCEEDED, payload: { users: results, count } });
  } catch (err) {
    yield put({ type: USER_LIST_FAILED, payload: { err } });
  }
}

export function* userListSaga() {
  yield takeLatest(USER_LIST_REQUESTED, getUserList);
}

function* getUserDetails({ payload }) {
  try {
    const user = yield call(fetchUserDetails, payload);
    yield put({ type: USER_DETAILS_SUCCEEDED, payload: user });
  } catch (err) {
    yield put({ type: USER_DETAILS_FAILED, payload: { err } });
  }
}

export function* userDetailsSaga() {
  yield takeLatest(USER_DETAILS_REQUESTED, getUserDetails);
}
