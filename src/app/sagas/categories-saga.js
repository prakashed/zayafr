import { takeLatest, put, call } from 'redux-saga/effects';

import { DOMAIN, DOMAIN_VIDEO } from '../reducers/categories';

import {
  SHOW_REQUESTED_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_FAILED_MESSAGE
} from '../reducers/general';

import {
  addNewCategory,
  removeCategory,
  updateCategoryDetails,
  removeCategoryVideo,
  addNewCategoryVideo
} from '../apis/categories-api';

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

function* createNewCategory(action) {
  try {
    yield put({
      type: SHOW_REQUESTED_MESSAGE,
      payload: { message: 'Creating New Category' }
    });
    const payload = yield call(addNewCategory, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({
      type: SHOW_SUCCESS_MESSAGE,
      payload: { message: 'New Category Added!' }
    });

    const theoryId = payload ? payload.theory : null;
    if (theoryId) {
      yield put(
        createDetailsAction({ domain: 'CURRICULUMS', payload: theoryId })
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

export function* categoryCreateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: NEW, action }),
    createNewCategory
  );
}

function* updateCategory(action) {
  try {
    yield put({
      type: SHOW_REQUESTED_MESSAGE,
      payload: { message: 'Updating Category' }
    });
    const payload = yield call(updateCategoryDetails, action.payload);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put({
      type: SHOW_SUCCESS_MESSAGE,
      payload: { message: 'Category Updated!' }
    });

    const theoryId = payload ? payload.theory : null;
    if (theoryId) {
      yield put(
        createDetailsAction({ domain: 'CURRICULUMS', payload: theoryId })
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

export function* categoryUpdateSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: UPDATE, action }),
    updateCategory
  );
}

function* deleteCategory(action) {
  try {
    yield call(removeCategory, action.payload);
    yield put(createAPISuccessAction(action));
    const theoryId = action.payload.theory ? action.payload.theory : null;
    if (theoryId) {
      yield put(
        createDetailsAction({ domain: 'CURRICULUMS', payload: theoryId })
      );
    }
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* categoryDeleteSaga() {
  yield takeLatest(
    action => isThisRequestActionMine({ domain: DOMAIN, type: DELETE, action }),
    deleteCategory
  );
}

function* deleteCategoryVideo(action) {
  try {
    yield call(removeCategoryVideo, action.payload);
    yield put(createAPISuccessAction(action));
    const theoryId = action.payload.curriculum
      ? action.payload.curriculum
      : null;
    if (theoryId) {
      yield put(
        createDetailsAction({ domain: 'CURRICULUMS', payload: theoryId })
      );
    }
  } catch (err) {
    const payload = { err };
    yield put(createAPIFailAction({ ...action, payload }));
  }
}

export function* categoryVideoDeleteSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN_VIDEO, type: DELETE, action }),
    deleteCategoryVideo
  );
}

function* createNewCategoryVideo(action) {
  try {
    const { url, parent, curriculum } = action.payload;
    const theoryId = curriculum;
    const data = { url, category: parent };
    const payload = yield call(addNewCategoryVideo, data);
    yield put(createAPISuccessAction({ ...action, payload }));
    yield put(
      createDetailsAction({ domain: 'CURRICULUMS', payload: theoryId })
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

export function* categoryVideoCreateSaga() {
  yield takeLatest(
    action =>
      isThisRequestActionMine({ domain: DOMAIN_VIDEO, type: NEW, action }),
    createNewCategoryVideo
  );
}
