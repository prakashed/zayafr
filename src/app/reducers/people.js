import { Map } from 'immutable';
import _ from 'lodash';

import { LOGOUT_SUCCEEDED } from './auth';

export const TEACHER_LIST_REQUESTED = 'TEACHER/LIST_REQUESTED';
export const TEACHER_LIST_SUCCEEDED = 'TEACHER/LIST_SUCCEEDED';
export const TEACHER_LIST_FAILED = 'TEACHER/LIST_FAILED';

export const TEACHER_DETAILS_REQUESTED = 'TEACHER/DETAILS_REQUESTED';
export const TEACHER_DETAILS_SUCCEEDED = 'TEACHER/DETAILS_SUCCEEDED';
export const TEACHER_DETAILS_FAILED = 'TEACHER/DETAILS_FAILED';

export const USER_LIST_REQUESTED = 'USER/LIST_REQUESTED';
export const USER_LIST_SUCCEEDED = 'USER/LIST_SUCCEEDED';
export const USER_LIST_FAILED = 'USER/LIST_FAILED';

export const USER_DETAILS_REQUESTED = 'USER/DETAILS_REQUESTED';
export const USER_DETAILS_SUCCEEDED = 'USER/DETAILS_SUCCEEDED';
export const USER_DETAILS_FAILED = 'USER/DETAILS_FAILED';

const initialState = {
  teachers: null,
  users: null,
};

// const initialState = Map(stateData);

export default function usersReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case TEACHER_LIST_SUCCEEDED: {
      const { teachers } = payload;
      const teachersMap = Map(_.keyBy(teachers, 'id'));

      return {
        ...state,
        teachers: teachersMap,
      };
    }

    case USER_LIST_SUCCEEDED: {
      const { users } = payload;
      const usersMap = Map(_.keyBy(users, 'id'));

      return {
        ...state,
        users: usersMap,
      };
    }
    case LOGOUT_SUCCEEDED: {
      return initialState;
    }
    default:
      return state;
  }
}

export function getTeacherListAction() {
  return {
    type: TEACHER_LIST_REQUESTED,
  };
}

export function getTeacherDetailsAction(payload) {
  return {
    type: TEACHER_DETAILS_REQUESTED,
    payload,
  };
}

export function getUserListAction() {
  return {
    type: USER_LIST_REQUESTED,
  };
}

export function getUserDetailsAction(payload) {
  return {
    type: USER_DETAILS_REQUESTED,
    payload,
  };
}
