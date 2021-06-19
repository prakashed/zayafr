import { Map, List } from 'immutable';
import { message } from 'antd';

import { LOGOUT_SUCCEEDED } from './auth';

export const INSTRUMENTS_LIST_REQUESTED = 'INSTRUMENTS/LIST_REQUESTED';
export const INSTRUMENTS_LIST_SUCCEEDED = 'INSTRUMENTS/LIST_SUCCEEDED';
export const INSTRUMENTS_LIST_FAILED = 'INSTRUMENTS/LIST_FAILED';

export const MUSICAL_GRADES_LIST_REQUESTED = 'MUSICAL_GRADES/LIST_REQUESTED';
export const MUSICAL_GRADES_LIST_SUCCEEDED = 'MUSICAL_GRADES/LIST_SUCCEEDED';
export const MUSICAL_GRADES_LIST_FAILED = 'MUSICAL_GRADES/LIST_FAILED';

export const SCHOOL_GRADES_LIST_REQUESTED = 'SCHOOL_GRADES/LIST_REQUESTED';
export const SCHOOL_GRADES_LIST_SUCCEEDED = 'SCHOOL_GRADES/LIST_SUCCEEDED';
export const SCHOOL_GRADES_LIST_FAILED = 'SCHOOL_GRADES/LIST_FAILED';

export const DIVISION_LIST_REQUESTED = 'DIVISION/LIST_REQUESTED';
export const DIVISION_LIST_SUCCEEDED = 'DIVISION/LIST_SUCCEEDED';
export const DIVISION_LIST_FAILED = 'DIVISION/LIST_FAILED';

export const DIVISION_CREATE_REQUESTED = 'DIVISION/CREATE_REQUESTED';
export const DIVISION_CREATE_SUCCEEDED = 'DIVISION/CREATE_SUCCEEDED';
export const DIVISION_CREATE_FAILED = 'DIVISION/CREATE_FAILED';

export const CATEGORIES_LIST_REQUESTED = 'CATEGORIES/LIST_REQUESTED';
export const CATEGORIES_LIST_SUCCEEDED = 'CATEGORIES/LIST_SUCCEEDED';
export const CATEGORIES_LIST_FAILED = 'CATEGORIES/LIST_FAILED';

export const FILTERED_UNIT_LIST_REQUESTED = 'FILTERED_UNIT/LIST_REQUESTED';
export const FILTERED_UNIT_LIST_SUCCEEDED = 'FILTERED_UNIT/LIST_SUCCEEDED';
export const FILTERED_UNIT_LIST_FAILED = 'FILTERED_UNIT/LIST_FAILED';

export const FILTERED_UNIT_CLEAR_LIST = 'FILTERED_UNIT/CLEAR_LIST';

export const CLASS_LIST_REQUESTED = 'CLASS/LIST_REQUESTED';
export const CLASS_LIST_SUCCEEDED = 'CLASS/LIST_SUCCEEDED';
export const CLASS_LIST_FAILED = 'CLASS/LIST_FAILED';

export const BOOK_FOR_INSTRUMENT_REQUESTED = 'BOOK/INSTRUMENT_REQUESTED';
export const BOOK_FOR_INSTRUMENT_SUCCEEDED = 'BOOK/INSTRUMENT_SUCCEEDED';
export const BOOK_FOR_INSTRUMENT_FAILED = 'BOOK/INSTRUMENT_FAILED';

export const SHOW_REQUESTED_MESSAGE = 'MESSAGE/REQUESTED';
export const SHOW_SUCCESS_MESSAGE = 'MESSAGE/SUCCESS';
export const SHOW_FAILED_MESSAGE = 'MESSAGE/FAILED';

export const GLOBAL_REASON_REQUESTED = 'GLOBAL_REASON/LIST_REQUESTED';
export const GLOBAL_REASON_SUCCEEDED = 'GLOBAL_REASON/LIST_SUCCEEDED';
export const GLOBAL_REASON_FAILED = 'GLOBAL_REASON/LIST_FAILED';

export const TOGGLE_SIDEBAR = 'TOGGLE/SIDEBAR';

const initialState = Map({
  instruments: List(),
  musicalGrades: List(),
  schoolGrades: List(),
  divisions: List(),
  categories: List(),
  filteredUnits: null,
  classes: List(),
  globalReasons: [],
  instrumentBooks: {},
  sidebarOpen: false,
});

let messageNotificationCallback = null;

function hidePreviousMessageNotification() {
  if (messageNotificationCallback) {
    messageNotificationCallback();
  }
}

export default function indicesReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case INSTRUMENTS_LIST_SUCCEEDED: {
      const { instruments } = payload;
      const instrumentsList = List(instruments);
      const instrumentsMap = Map({ instruments: instrumentsList });
      return state.merge(instrumentsMap);
    }
    case MUSICAL_GRADES_LIST_SUCCEEDED: {
      const { data } = payload;
      const dataList = List(data);
      const updatedMap = Map({ musicalGrades: dataList });
      return state.merge(updatedMap);
    }
    case SCHOOL_GRADES_LIST_SUCCEEDED: {
      const { data } = payload;
      const dataList = List(data);
      const updatedMap = Map({ schoolGrades: dataList });
      return state.merge(updatedMap);
    }
    case DIVISION_LIST_SUCCEEDED: {
      const { data } = payload;
      const dataList = List(data);
      const updatedMap = Map({ divisions: dataList });
      return state.merge(updatedMap);
    }
    case DIVISION_CREATE_SUCCEEDED: {
      const oldDataList = state.get('divisions');
      const newDataList = oldDataList.push(payload);
      const updatedMap = Map({ divisions: newDataList });
      return state.merge(updatedMap);
    }
    case CATEGORIES_LIST_SUCCEEDED: {
      const { categories } = payload;
      const categoryList = List(categories);
      const categoryMap = Map({ categories: categoryList });
      return state.merge(categoryMap);
    }
    case FILTERED_UNIT_LIST_SUCCEEDED: {
      const { units } = payload;
      const unitList = List(units);
      const unitMap = Map({ filteredUnits: unitList });
      return state.merge(unitMap);
    }
    case FILTERED_UNIT_CLEAR_LIST: {
      return state.set('filteredUnits', null);
    }
    case CLASS_LIST_SUCCEEDED: {
      const { classes } = payload;
      const classList = List(classes);
      const classMap = Map({ classes: classList });
      return state.merge(classMap);
    }
    case BOOK_FOR_INSTRUMENT_SUCCEEDED: {
      const { instrumentId, books } = payload;
      const oldBooks = state.get('instrumentBooks');
      const updatedInstrument = {};
      updatedInstrument[parseInt(instrumentId, 10)] = books;
      const newBookMap = { ...oldBooks, ...updatedInstrument };
      const bookMap = Map({ instrumentBooks: newBookMap });
      return state.merge(bookMap);
    }
    case SHOW_REQUESTED_MESSAGE: {
      hidePreviousMessageNotification();

      const { message: msg } = payload;
      messageNotificationCallback = message.loading(msg);
      return state;
    }
    case SHOW_SUCCESS_MESSAGE: {
      hidePreviousMessageNotification();

      const { message: msg } = payload;
      messageNotificationCallback = message.success(msg);
      return state;
    }
    case SHOW_FAILED_MESSAGE: {
      hidePreviousMessageNotification();

      const { message: msg } = payload;
      messageNotificationCallback = message.error(msg);
      return state;
    }
    case LOGOUT_SUCCEEDED: {
      return initialState;
    }
    case TOGGLE_SIDEBAR: {
      const sidebarOpen = state.get('sidebarOpen');
      return state.set('sidebarOpen', !sidebarOpen);
    }
    case GLOBAL_REASON_SUCCEEDED: {
      return state.set('globalReasons', payload);
    }
    default:
      return state;
  }
}

export function toggleSidebarAction() {
  return {
    type: TOGGLE_SIDEBAR,
  };
}

export function getInstrumentsListAction(payload) {
  return {
    type: INSTRUMENTS_LIST_REQUESTED,
    payload,
  };
}

export function getMusicalGradesListAction() {
  return {
    type: MUSICAL_GRADES_LIST_REQUESTED,
  };
}

export function getSchoolGradesListAction() {
  return {
    type: SCHOOL_GRADES_LIST_REQUESTED,
  };
}

export function getDivisionsListAction(payload) {
  return {
    type: DIVISION_LIST_REQUESTED,
    payload,
  };
}

export function addNewDivisionAction(payload) {
  return {
    type: DIVISION_CREATE_REQUESTED,
    payload,
  };
}

export function getCategoryListAction() {
  return {
    type: CATEGORIES_LIST_REQUESTED,
  };
}

export function getFilteredUnitListAction(payload) {
  return {
    type: FILTERED_UNIT_LIST_REQUESTED,
    payload,
  };
}

export function getClassListAction(payload) {
  return {
    type: CLASS_LIST_REQUESTED,
    payload,
  };
}

export function clearFilteredUnitsAction() {
  return {
    type: FILTERED_UNIT_CLEAR_LIST,
  };
}

export function getBooksForInstrumentAction(payload) {
  return {
    type: BOOK_FOR_INSTRUMENT_REQUESTED,
    payload,
  };
}

export function showRequestedMessageAction(payload) {
  return {
    type: SHOW_REQUESTED_MESSAGE,
    payload,
  };
}

export function showSuccessMessageAction(payload) {
  return {
    type: SHOW_SUCCESS_MESSAGE,
    payload,
  };
}

export function showFailedMessageAction(payload) {
  return {
    type: SHOW_FAILED_MESSAGE,
    payload,
  };
}

export function getGlobalReasonsAction() {
  return { type: GLOBAL_REASON_REQUESTED };
}
