import { takeLatest, put, call } from 'redux-saga/effects';

import {
  //   RECITAL_ADD_UNITS_REQUESTED,
  //   RECITAL_ADD_UNITS_FAILED,
  //   RECITAL_ADD_CUSTOM_UNIT_REQUESTED,
  //   RECITAL_ADD_CUSTOM_UNIT_SUCCEEDED,
  //   RECITAL_ADD_CUSTOM_UNIT_FAILED,
  DOMAIN
} from '../reducers/curriculums';

import {
  SHOW_REQUESTED_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_FAILED_MESSAGE
} from '../reducers/general';

import {
  fetchCurriculumList,
  fetchFilteredCurriculumList,
  fetchCurriculumDetails,
  addNewCurriculum,
  removeCurriculum,
  updateCurriculumDetails
  //   addNewUnitsToCurriculum,
  //   addCustomUnit,
} from '../apis/curriculums-api';

import { addNewRecital } from '../apis/recitals-api';

import { addNewTheory } from '../apis/theories-api';

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

const { LIST, SEARCH, NEW, DETAILS, UPDATE, DELETE, NEXT_BATCH } = ACTION_TYPES;

function* getCurriculumList(action) {
  try {
    const apiResponse = yield call(fetchCurriculumList);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* curriculumListSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: LIST, action }),
    getCurriculumList
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

export function* curriculumNextBatchSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN, type: NEXT_BATCH, action }),
    getNextBatchList
  );
}

function* searchForCurriculums(action) {
  try {
    const apiResponse = yield call(fetchFilteredCurriculumList, action.payload);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* searchCurriculumsSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: SEARCH, action }),
    searchForCurriculums
  );
}

function* getCurriculumDetails(action) {
  try {
    const payload = yield call(fetchCurriculumDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* curriculumDetailsSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN, type: DETAILS, action }),
    getCurriculumDetails
  );
}

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

function* updateCurriculum(action) {
  try {
    const payload = yield call(updateCurriculumDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* curriculumUpdateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: UPDATE, action }),
    updateCurriculum
  );
}

function* deleteCurriculum(action) {
  try {
    yield call(removeCurriculum, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* curriculumDeleteSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: DELETE, action }),
    deleteCurriculum
  );
}

// function* addUnitsToRecital({ payload }) {
//   try {
//     yield put({ type: SHOW_REQUESTED_MESSAGE, payload: { message: 'Adding lessons to recital..' } });
//     const response = yield call(addNewUnitsToRecital, payload);
//     yield put({ type: SHOW_SUCCESS_MESSAGE, payload: { message: 'Lessons added to recital!' } });
//     const recitalId = response ? response[0].recital : null;
//     if (recitalId) {
//       // yield put({ type: RECITAL_DETAILS_REQUESTED, payload: recitalId });
//       yield put(createDetailsAction({ domain: DOMAIN, payload: recitalId }));
//     }
//   } catch (err) {
//     yield put({ type: RECITAL_ADD_UNITS_FAILED, payload: { err } });
//     yield put({ type: SHOW_FAILED_MESSAGE, payload: { message: 'Error while adding lessons!' } });
//   }
// }

// export function* addUnitsToRecitalSaga() {
//   yield takeLatest(RECITAL_ADD_UNITS_REQUESTED, addUnitsToRecital);
// }

// function* addCustomUnitToRecital({ payload }) {
//   try {
//     const { recitalId, instrumentId, customUnit } = payload;
//     const updatedRecital = yield call(addCustomUnit, customUnit);
//     yield put({ type: RECITAL_ADD_CUSTOM_UNIT_SUCCEEDED, payload: updatedRecital });
//     const addUnitData = [{
//       unit: updatedRecital.id,
//       recital: recitalId,
//       instrument: instrumentId,
//     }];
//     yield put({ type: RECITAL_ADD_UNITS_REQUESTED, payload: addUnitData });
//   } catch (err) {
//     yield put({ type: RECITAL_ADD_CUSTOM_UNIT_FAILED, payload: { err } });
//   }
// }

// export function* addCustomUnitToRecitalSaga() {
//   yield takeLatest(RECITAL_ADD_CUSTOM_UNIT_REQUESTED, addCustomUnitToRecital);
// }
