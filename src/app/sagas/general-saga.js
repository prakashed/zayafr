import { takeLatest, put, call } from 'redux-saga/effects';

import {
  INSTRUMENTS_LIST_REQUESTED,
  INSTRUMENTS_LIST_SUCCEEDED,
  INSTRUMENTS_LIST_FAILED,
  DIVISION_LIST_REQUESTED,
  DIVISION_LIST_SUCCEEDED,
  DIVISION_LIST_FAILED,
  DIVISION_CREATE_REQUESTED,
  DIVISION_CREATE_SUCCEEDED,
  DIVISION_CREATE_FAILED,
  CATEGORIES_LIST_REQUESTED,
  CATEGORIES_LIST_SUCCEEDED,
  CATEGORIES_LIST_FAILED,
  FILTERED_UNIT_LIST_REQUESTED,
  FILTERED_UNIT_LIST_SUCCEEDED,
  FILTERED_UNIT_LIST_FAILED,
  CLASS_LIST_REQUESTED,
  CLASS_LIST_SUCCEEDED,
  CLASS_LIST_FAILED,
  BOOK_FOR_INSTRUMENT_REQUESTED,
  BOOK_FOR_INSTRUMENT_SUCCEEDED,
  BOOK_FOR_INSTRUMENT_FAILED,
  MUSICAL_GRADES_LIST_REQUESTED,
  MUSICAL_GRADES_LIST_SUCCEEDED,
  MUSICAL_GRADES_LIST_FAILED,
  SCHOOL_GRADES_LIST_REQUESTED,
  SCHOOL_GRADES_LIST_SUCCEEDED,
  SCHOOL_GRADES_LIST_FAILED,
  GLOBAL_REASON_REQUESTED,
  GLOBAL_REASON_SUCCEEDED,
  GLOBAL_REASON_FAILED,
} from '../reducers/general';

import {
  fetchInstrumentList,
  fetchMusicalGradeList,
  fetchSchoolGradeList,
  fetchDivisionList,
  addNewDivision,
  fetchCategoryList,
  filterUnitByTagAndInstrument,
  fetchClassList,
  fetchGlobalReasons,
} from '../apis/general-api';
import { fetchBooksForInstrument } from '../apis/master-api';

function* getInstrumentsList(action) {
  try {
    const { results, count } = yield call(fetchInstrumentList, action.payload);
    yield put({ type: INSTRUMENTS_LIST_SUCCEEDED, payload: { instruments: results, count } });
  } catch (err) {
    yield put({ type: INSTRUMENTS_LIST_FAILED, payload: { err } });
  }
}

export function* instrumentsListSaga() {
  yield takeLatest(INSTRUMENTS_LIST_REQUESTED, getInstrumentsList);
}

function* getMusicalGradesList() {
  try {
    const { results, count } = yield call(fetchMusicalGradeList);
    yield put({ type: MUSICAL_GRADES_LIST_SUCCEEDED, payload: { data: results, count } });
  } catch (err) {
    yield put({ type: MUSICAL_GRADES_LIST_FAILED, payload: { err } });
  }
}

export function* musicalGradesListSaga() {
  yield takeLatest(MUSICAL_GRADES_LIST_REQUESTED, getMusicalGradesList);
}

function* getSchoolGradesList() {
  try {
    const { results, count } = yield call(fetchSchoolGradeList);
    yield put({ type: SCHOOL_GRADES_LIST_SUCCEEDED, payload: { data: results, count } });
  } catch (err) {
    yield put({ type: SCHOOL_GRADES_LIST_FAILED, payload: { err } });
  }
}

export function* schoolGradesListSaga() {
  yield takeLatest(SCHOOL_GRADES_LIST_REQUESTED, getSchoolGradesList);
}

function* getDivisionsList({ payload }) {
  try {
    const { results, count } = yield call(fetchDivisionList, payload);
    yield put({ type: DIVISION_LIST_SUCCEEDED, payload: { data: results, count } });
  } catch (err) {
    yield put({ type: DIVISION_LIST_FAILED, payload: { err } });
  }
}

export function* divisionsListSaga() {
  yield takeLatest(DIVISION_LIST_REQUESTED, getDivisionsList);
}

function* handleNewDivision({ payload }) {
  try {
    const division = yield call(addNewDivision, payload);
    yield put({ type: DIVISION_CREATE_SUCCEEDED, payload: division });
  } catch (err) {
    yield put({ type: DIVISION_CREATE_FAILED, payload: { err } });
  }
}

export function* addNewDivisionSaga() {
  yield takeLatest(DIVISION_CREATE_REQUESTED, handleNewDivision);
}

function* getCategoryList() {
  try {
    const categoriesData = yield call(fetchCategoryList);
    const { results, count } = categoriesData;
    yield put({ type: CATEGORIES_LIST_SUCCEEDED, payload: { categories: results, count } });
  } catch (err) {
    yield put({ type: CATEGORIES_LIST_FAILED, payload: { err } });
  }
}

export function* categoriesListSaga() {
  yield takeLatest(CATEGORIES_LIST_REQUESTED, getCategoryList);
}

function* getFilteredUnitListByTagAndInstrument(action) {
  try {
    const { payload } = action;
    const { results, count } = yield call(filterUnitByTagAndInstrument, payload);
    yield put({ type: FILTERED_UNIT_LIST_SUCCEEDED, payload: { units: results, count } });
  } catch (err) {
    yield put({ type: FILTERED_UNIT_LIST_FAILED, payload: { err } });
  }
}

export function* filteredUnitListByTagAndInstrumentSaga() {
  yield takeLatest(FILTERED_UNIT_LIST_REQUESTED, getFilteredUnitListByTagAndInstrument);
}

function* getClassList() {
  try {
    const { results, count } = yield call(fetchClassList);
    yield put({ type: CLASS_LIST_SUCCEEDED, payload: { classes: results, count } });
  } catch (err) {
    yield put({ type: CLASS_LIST_FAILED, payload: { err } });
  }
}

export function* classListSaga() {
  yield takeLatest(CLASS_LIST_REQUESTED, getClassList);
}

function* getBooksForInstrument({ payload }) {
  try {
    const { results } = yield call(fetchBooksForInstrument, payload);
    yield put({
      type: BOOK_FOR_INSTRUMENT_SUCCEEDED,
      payload: { instrumentId: payload, books: results },
    });
  } catch (err) {
    yield put({ type: BOOK_FOR_INSTRUMENT_FAILED, payload: { err } });
  }
}

export function* booksForInstrumentSaga() {
  yield takeLatest(BOOK_FOR_INSTRUMENT_REQUESTED, getBooksForInstrument);
}

function* getGlobalReasonsList() {
  try {
    const globalReasonsData = yield call(fetchGlobalReasons);
    console.log('got global reasons --> ', globalReasonsData);
    const { results } = globalReasonsData;
    yield put({ type: GLOBAL_REASON_SUCCEEDED, payload: results });
  } catch (err) {
    yield put({ type: GLOBAL_REASON_FAILED, payload: { err } });
  }
}

export function* globalReasonsSaga() {
  yield takeLatest(GLOBAL_REASON_REQUESTED, getGlobalReasonsList);
}
