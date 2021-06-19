import { takeLatest, put, call } from 'redux-saga/effects';

import { DOMAIN as SCHOOL_DOMAIN } from '../reducers/schools';

import { DOMAIN as CLUSTER_DOMAIN } from '../reducers/clusters';

import { DOMAIN as CLASSROOM_DOMAIN } from '../reducers/classrooms';

import {
  // SHOW_REQUESTED_MESSAGE,
  // SHOW_SUCCESS_MESSAGE,
  SHOW_FAILED_MESSAGE
} from '../reducers/general';

import { DEFAULT_ERROR_MESSAGE } from '../helpers';

import {
  fetchSchoolList,
  searchSchools,
  addNewSchool,
  updateSchoolDetails,
  removeSchool,
  fetchSchoolDetails
} from '../apis/school-api';

import {
  fetchClusterList,
  fetchFilteredClusterList,
  fetchClusterDetails,
  addNewCluster,
  updateClusterDetails,
  removeCluster
} from '../apis/cluster-api';

import {
  fetchClassroomList,
  fetchClassroomDetails,
  filterClassrooms,
  addNewClassroom,
  updateClassroomDetails,
  removeClassroom
} from '../apis/classroom-api';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  createAPIFailAction,
  isThisRequestActionMine
} from '../helpers/reduxActionUtils';
import { getApi } from '../apis';

const { LIST, SEARCH, UPDATE, NEW, DELETE, DETAILS, NEXT_BATCH } = ACTION_TYPES;

/**
 * School Sagas
 */

function* getSchoolList(action) {
  try {
    const apiResponse = yield call(fetchSchoolList);
    const { results: data } = apiResponse;
    const payload = { ...apiResponse, data };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* schoolListSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: SCHOOL_DOMAIN, type: LIST, action }),
    getSchoolList
  );
}

function* getSchoolDetails(action) {
  try {
    const payload = yield call(fetchSchoolDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* schoolDetailsSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: SCHOOL_DOMAIN, type: DETAILS, action }),
    getSchoolDetails
  );
}

function* getSchoolNextBatchList(action) {
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

export function* schoolNextBatchSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({
        domain: SCHOOL_DOMAIN,
        type: NEXT_BATCH,
        action
      }),
    getSchoolNextBatchList
  );
}

function* searchForSchools(action) {
  try {
    const { results, count } = yield call(searchSchools, action.payload);
    const payload = { data: results, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* schoolSearchSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: SCHOOL_DOMAIN, type: SEARCH, action }),
    searchForSchools
  );
}

function* createNewSchool(action) {
  try {
    const payload = yield call(addNewSchool, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
    const { data } = err.response;
    const { nonFieldErrors } = data;
    if (nonFieldErrors) {
      yield put({
        type: SHOW_FAILED_MESSAGE,
        payload: { message: 'A school with same name already exists!' }
      });
    } else {
      yield put({
        type: SHOW_FAILED_MESSAGE,
        payload: { message: DEFAULT_ERROR_MESSAGE }
      });
    }
  }
}

export function* schoolCreateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: SCHOOL_DOMAIN, type: NEW, action }),
    createNewSchool
  );
}

function* updateSchool(action) {
  try {
    const school = yield call(updateSchoolDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload: school }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* schoolUpdateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: SCHOOL_DOMAIN, type: UPDATE, action }),
    updateSchool
  );
}

function* deleteSchool(action) {
  try {
    yield call(removeSchool, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* schoolDeleteSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: SCHOOL_DOMAIN, type: DELETE, action }),
    deleteSchool
  );
}

/**
 * Cluster Sagas
 */

function* getClusterList(action) {
  try {
    const { results, count } = yield call(fetchClusterList);
    const payload = { data: results, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* clusterListSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: CLUSTER_DOMAIN, type: LIST, action }),
    getClusterList
  );
}

function* getClusterNextBatchList(action) {
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

export function* clusterNextBatchSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({
        domain: CLUSTER_DOMAIN,
        type: NEXT_BATCH,
        action
      }),
    getClusterNextBatchList
  );
}

function* searchForClusters(action) {
  try {
    const { results, count } = yield call(
      fetchFilteredClusterList,
      action.payload
    );
    const payload = { data: results, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* searchClustersSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: CLUSTER_DOMAIN, type: SEARCH, action }),
    searchForClusters
  );
}

function* createNewCluster(action) {
  try {
    const payload = yield call(addNewCluster, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* clusterCreateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: CLUSTER_DOMAIN, type: NEW, action }),
    createNewCluster
  );
}

function* getClusterDetails(action) {
  try {
    const payload = yield call(fetchClusterDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* clusterDetailsSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({
        domain: CLUSTER_DOMAIN,
        type: DETAILS,
        action
      }),
    getClusterDetails
  );
}

function* updateCluster(action) {
  try {
    const payload = yield call(updateClusterDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* clusterUpdateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: CLUSTER_DOMAIN, type: UPDATE, action }),
    updateCluster
  );
}

function* deleteCluster(action) {
  try {
    yield call(removeCluster, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* clusterDeleteSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: CLUSTER_DOMAIN, type: DELETE, action }),
    deleteCluster
  );
}

/**
 * Classrooms Sagas
 */

function* getClassroomsList(action) {
  try {
    const { results, count } = yield call(fetchClassroomList, action.payload);
    const payload = { data: results, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* classroomListSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: CLASSROOM_DOMAIN, type: LIST, action }),
    getClassroomsList
  );
}

function* filterForClassrooms(action) {
  try {
    const { results, count } = yield call(filterClassrooms, action.payload);
    const payload = { data: results, count };
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* filterClassroomsSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({
        domain: CLASSROOM_DOMAIN,
        type: SEARCH,
        action
      }),
    filterForClassrooms
  );
}

function* createNewClassroom(action) {
  try {
    const payload = yield call(addNewClassroom, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
    yield put({
      type: SHOW_FAILED_MESSAGE,
      payload: {
        message: 'A classroom with same grade and division already exists!'
      }
    });
  }
}

export function* classroomCreateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: CLASSROOM_DOMAIN, type: NEW, action }),
    createNewClassroom
  );
}

function* getClassroomDetails(action) {
  try {
    const payload = yield call(fetchClassroomDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* classroomDetailsSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({
        domain: CLASSROOM_DOMAIN,
        type: DETAILS,
        action
      }),
    getClassroomDetails
  );
}

function* updateClassroom(action) {
  try {
    const payload = yield call(updateClassroomDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* classroomUpdateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({
        domain: CLASSROOM_DOMAIN,
        type: UPDATE,
        action
      }),
    updateClassroom
  );
}

function* deleteClassroom(action) {
  try {
    yield call(removeClassroom, action.payload);
    yield put(createAPISuccessAction(action));
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* classroomDeleteSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({
        domain: CLASSROOM_DOMAIN,
        type: DELETE,
        action
      }),
    deleteClassroom
  );
}
