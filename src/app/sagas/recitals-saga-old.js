import { takeLatest, put, call } from 'redux-saga/effects';

import {
  RECITAL_ADD_UNITS_REQUESTED,
  RECITAL_ADD_UNITS_FAILED,
  RECITAL_ADD_CUSTOM_UNIT_REQUESTED,
  RECITAL_ADD_CUSTOM_UNIT_SUCCEEDED,
  RECITAL_ADD_CUSTOM_UNIT_FAILED,
  DOMAIN,
} from '../reducers/recitals';

import {
  SHOW_REQUESTED_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_FAILED_MESSAGE,
} from '../reducers/general';

import {
  fetchRecitalList,
  fetchFilteredRecitalList,
  fetchRecitalDetails,
  addNewRecital,
  removeRecital,
  updateRecitalDetails,
  addNewUnitsToRecital,
  addCustomUnit,
} from '../apis/recitals-api';

import { getApi } from '../apis';

import { extractErrorMessage } from '../helpers';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  createAPIFailAction,
  isThisRequestActionMine,
  createDetailsAction,
} from '../helpers/reduxActionUtils';

const {
  LIST, SEARCH, NEW, DETAILS, UPDATE, DELETE, NEXT_BATCH,
} = ACTION_TYPES;

function* getRecitalList(action) {
  try {
    const apiResponse = yield call(fetchRecitalList);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* recitalListSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN, type: LIST, action }),
    getRecitalList,
  );
}

function* getNextBatchList(action) {
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

export function* recitalNextBatchSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN, type: NEXT_BATCH, action }),
    getNextBatchList,
  );
}

function* searchForRecitals(action) {
  try {
    const apiResponse = yield call(fetchFilteredRecitalList, action.payload);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* searchRecitalsSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: SEARCH, action }),
    searchForRecitals,
  );
}

function* getRecitalDetails(action) {
  try {
    const payload = yield call(fetchRecitalDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* recitalDetailsSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: DETAILS, action }),
    getRecitalDetails,
  );
}

function* createNewRecital(action) {
  try {
    yield put({ type: SHOW_REQUESTED_MESSAGE, payload: { message: 'Creating New Recital' } });
    const payload = yield call(addNewRecital, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({ type: SHOW_SUCCESS_MESSAGE, payload: { message: 'New Recital Added!' } });
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
    yield put({ type: SHOW_FAILED_MESSAGE, payload: { message: errorMessage } });
  }
}

export function* recitalCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createNewRecital,
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
    updateRecital,
  );
}

function* deleteRecital(action) {
  try {
    yield call(removeRecital, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* recitalDeleteSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: DELETE, action }),
    deleteRecital,
  );
}

function* addUnitsToRecital({ payload }) {
  try {
    yield put({ type: SHOW_REQUESTED_MESSAGE, payload: { message: 'Adding lessons to recital..' } });
    const response = yield call(addNewUnitsToRecital, payload);
    yield put({ type: SHOW_SUCCESS_MESSAGE, payload: { message: 'Lessons added to recital!' } });
    const recitalId = response ? response[0].recital : null;
    if (recitalId) {
      // yield put({ type: RECITAL_DETAILS_REQUESTED, payload: recitalId });
      yield put(createDetailsAction({ domain: DOMAIN, payload: recitalId }));
    }
  } catch (err) {
    yield put({ type: RECITAL_ADD_UNITS_FAILED, payload: { err } });
    yield put({ type: SHOW_FAILED_MESSAGE, payload: { message: 'Error while adding lessons!' } });
  }
}

export function* addUnitsToRecitalSaga() {
  yield takeLatest(RECITAL_ADD_UNITS_REQUESTED, addUnitsToRecital);
}

function* addCustomUnitToRecital({ payload }) {
  try {
    const { recitalId, instrumentId, customUnit } = payload;
    const updatedRecital = yield call(addCustomUnit, customUnit);
    yield put({ type: RECITAL_ADD_CUSTOM_UNIT_SUCCEEDED, payload: updatedRecital });
    const addUnitData = [{
      unit: updatedRecital.id,
      recital: recitalId,
      instrument: instrumentId,
    }];
    yield put({ type: RECITAL_ADD_UNITS_REQUESTED, payload: addUnitData });
  } catch (err) {
    yield put({ type: RECITAL_ADD_CUSTOM_UNIT_FAILED, payload: { err } });
  }
}

export function* addCustomUnitToRecitalSaga() {
  yield takeLatest(RECITAL_ADD_CUSTOM_UNIT_REQUESTED, addCustomUnitToRecital);
}
