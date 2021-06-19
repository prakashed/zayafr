import { takeLatest, put, call } from 'redux-saga/effects';

import { DOMAIN, DOMAIN_VIDEO } from '../reducers/lessons';

import {
  SHOW_REQUESTED_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_FAILED_MESSAGE
} from '../reducers/general';

import {
  addNewLesson,
  removeLesson,
  updateLessonDetails,
  removeLessonVideo,
  addNewLessonVideo
} from '../apis/lessons-api';

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

function* createNewLesson(action) {
  try {
    yield put({
      type: SHOW_REQUESTED_MESSAGE,
      payload: { message: 'Creating New Lesson' }
    });
    const payload = yield call(addNewLesson, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({
      type: SHOW_SUCCESS_MESSAGE,
      payload: { message: 'New Lesson Added!' }
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

function* updateLesson(action) {
  try {
    yield put({
      type: SHOW_REQUESTED_MESSAGE,
      payload: { message: 'Updating Lesson' }
    });
    const payload = yield call(updateLessonDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({
      type: SHOW_SUCCESS_MESSAGE,
      payload: { message: 'Lesson Updated!' }
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

export function* lessonCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createNewLesson
  );
}

export function* lessonUpdateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: UPDATE, action }),
    updateLesson
  );
}

function* deleteLesson(action) {
  try {
    yield call(removeLesson, action.payload);
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

export function* lessonDeleteSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: DELETE, action }),
    deleteLesson
  );
}

function* deleteLessonVideo(action) {
  try {
    yield call(removeLessonVideo, action.payload);
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

export function* lessonVideoDeleteSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN_VIDEO, type: DELETE, action }),
    deleteLessonVideo
  );
}

function* createNewLessonVideo(action) {
  try {
    const { url, parent, curriculum } = action.payload;
    const recitalId = curriculum;
    const data = { url, lesson: parent };
    const payload = yield call(addNewLessonVideo, data);
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

export function* lessonVideoCreateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN_VIDEO, type: NEW, action }),
    createNewLessonVideo
  );
}
