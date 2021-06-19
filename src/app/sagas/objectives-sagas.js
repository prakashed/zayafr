import { takeLatest, put, call } from 'redux-saga/effects';

import { DOMAIN, DOMAIN_VIDEO } from '../reducers/objectives';

import {
  SHOW_REQUESTED_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_FAILED_MESSAGE
} from '../reducers/general';

import {
  addNewObjective,
  removeObjective,
  updateObjectiveDetails,
  removeObjectiveVideo,
  addNewObjectiveVideo
} from '../apis/objectives-api';

// import {  addNewTheory} from '../apis/theories-api'

import { getApi } from '../apis';

import { extractErrorMessage } from '../helpers';

import {
  ACTION_TYPES,
  createAPISuccessAction,
  createAPIFailAction,
  isThisRequestActionMine,
  createDetailsAction
} from '../helpers/reduxActionUtils';

const { NEW, UPDATE, DELETE } = ACTION_TYPES;

function* createNewObjective(action) {
  try {
    yield put({
      type: SHOW_REQUESTED_MESSAGE,
      payload: { message: 'Creating New Objective' }
    });
    const payload = yield call(addNewObjective, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({
      type: SHOW_SUCCESS_MESSAGE,
      payload: { message: 'New Objective Added!' }
    });
    const recitalId = payload ? payload.recital : null;
    if (recitalId) {
      yield put(
        createDetailsAction({ domain: 'CURRICULUMS', payload: recitalId })
      );
    }
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

export function* objectiveCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createNewObjective
  );
}

function* deleteObjective(action) {
  try {
    yield call(removeObjective, action.payload);
    yield put(createAPISuccessAction(action));
    const recitalId = action.payload.recital ? action.payload.recital : null;
    if (recitalId) {
      yield put(
        createDetailsAction({ domain: 'CURRICULUMS', payload: recitalId })
      );
    }
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* objectiveDeleteSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: DELETE, action }),
    deleteObjective
  );
}

function* updateObjective(action) {
  try {
    yield put({
      type: SHOW_REQUESTED_MESSAGE,
      payload: { message: 'Updating Objective' }
    });
    const payload = yield call(updateObjectiveDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({
      type: SHOW_SUCCESS_MESSAGE,
      payload: { message: 'Objective Updated!' }
    });

    const recitalId = payload ? payload.recital : null;
    if (recitalId) {
      yield put(
        createDetailsAction({ domain: 'CURRICULUMS', payload: recitalId })
      );
    }
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

export function* objectiveUpdateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: UPDATE, action }),
    updateObjective
  );
}

function* deleteObjectiveVideo(action) {
  try {
    yield call(removeObjectiveVideo, action.payload);
    yield put(createAPISuccessAction(action));
    const recitalId = action.payload.curriculum
      ? action.payload.curriculum
      : null;
    if (recitalId) {
      yield put(
        createDetailsAction({ domain: 'CURRICULUMS', payload: recitalId })
      );
    }
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* objectiveVideoDeleteSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN_VIDEO, type: DELETE, action }),
    deleteObjectiveVideo
  );
}

function* createNewObjectiveVideo(action) {
  try {
    const { url, parent, curriculum } = action.payload;
    const recitalId = curriculum;
    const data = { url, objective: parent };
    const payload = yield call(addNewObjectiveVideo, data);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put(
      createDetailsAction({ domain: 'CURRICULUMS', payload: recitalId })
    );
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

export function* objectiveVideoCreateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN_VIDEO, type: NEW, action }),
    createNewObjectiveVideo
  );
}
