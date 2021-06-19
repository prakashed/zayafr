import { takeLatest, put, call } from 'redux-saga/effects';

import { DOMAIN as BOOKS_DOMAIN } from '../reducers/books';

import { DOMAIN as ACTIVITIES_DOMAIN } from '../reducers/activities';

import {
  fetchBookDetails,
  fetchBooks,
  deleteBook,
  searchBooks,
  fetchActivities,
  fetchActivityDetails,
  searchActivities,
  addNewActivity,
  deleteActivity,
  updateActivityDetails,
} from '../apis/master-api';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  createAPIFailAction,
  isThisRequestActionMine,
} from '../helpers/reduxActionUtils';
import { getApi } from '../apis';

const {
  LIST, SEARCH, NEW, DETAILS, UPDATE, DELETE, NEXT_BATCH,
} = ACTION_TYPES;

// BOOKS SAGA

function* getBooksDetails(action) {
  try {
    const payload = yield call(fetchBookDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* bookDetailsSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: BOOKS_DOMAIN, type: DETAILS, action }),
    getBooksDetails,
  );
}

function* getBooks(action) {
  try {
    const apiResponse = yield call(fetchBooks);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* booksSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: BOOKS_DOMAIN, type: LIST, action }),
    getBooks,
  );
}

function* getBookNextBatchList(action) {
  try {
    const apiResponse = yield call(getApi, action.payload);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* booksNextBatchSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: BOOKS_DOMAIN, type: NEXT_BATCH, action }),
    getBookNextBatchList,
  );
}

function* searchForBooks(action) {
  try {
    const { results, count } = yield call(searchBooks, action.payload);
    const payload = { data: results, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* searchBooksSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: BOOKS_DOMAIN, type: SEARCH, action }),
    searchForBooks,
  );
}

function* callDeleteBook(action) {
  try {
    yield call(deleteBook, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* deleteBookSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: BOOKS_DOMAIN, type: DELETE, action }),
    callDeleteBook,
  );
}

// ACTIVITIES SAGA

function* getActivityDetails(action) {
  try {
    const payload = yield call(fetchActivityDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* activityDetailsSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: ACTIVITIES_DOMAIN, type: DETAILS, action }),
    getActivityDetails,
  );
}

function* getActivities(action) {
  try {
    const apiResponse = yield call(fetchActivities);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* activitiesSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: ACTIVITIES_DOMAIN, type: LIST, action }),
    getActivities,
  );
}

function* getActivityNextBatchList(action) {
  try {
    const apiResponse = yield call(getApi, action.payload);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* activitiesNextBatchSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: ACTIVITIES_DOMAIN, type: NEXT_BATCH, action }),
    getActivityNextBatchList,
  );
}

function* searchForActivities(action) {
  try {
    const { results, count } = yield call(searchActivities, action.payload);
    const payload = { data: results, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* searchActivitiesSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: ACTIVITIES_DOMAIN, type: SEARCH, action }),
    searchForActivities,
  );
}

function* createActivity(action) {
  try {
    const payload = yield call(addNewActivity, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* createActivitySaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: ACTIVITIES_DOMAIN, type: NEW, action }),
    createActivity,
  );
}

function* updateActivity(action) {
  try {
    const payload = yield call(updateActivityDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* updateActivitySaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: ACTIVITIES_DOMAIN, type: UPDATE, action }),
    updateActivity,
  );
}

function* callDeleteActivity(action) {
  try {
    yield call(deleteActivity, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* deleteActivitySaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: ACTIVITIES_DOMAIN, type: DELETE, action }),
    callDeleteActivity,
  );
}
