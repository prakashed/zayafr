import { Map } from 'immutable';
import _ from 'lodash';
import cookie from 'js-cookie';

const token = cookie.get('token');
const school = localStorage.getItem('school');
const savedUserRoleAccountId = localStorage.getItem('userRoleAccountId');
const initialState = Map({
  token: _.isUndefined(token) ? null : token,
  school: _.isUndefined(school) ? null : school,
  schoolName: null,
  userName: null,
  error: false,
  permissionsData: null,
  role: null,
  userRoleAccountId: _.isUndefined(savedUserRoleAccountId) ? null : savedUserRoleAccountId,
});

export const LOGIN_REQUESTED = 'AUTH/LOGIN_REQUESTED';
export const LOGIN_SUCCEEDED = 'AUTH/LOGIN_SUCCEEDED';
export const LOGIN_FAILED = 'AUTH/LOGIN_FAILED';
export const LOGOUT_REQUESTED = 'AUTH/LOGOUT_REQUESTED';
export const LOGOUT_SUCCEEDED = 'AUTH/LOGOUT_SUCCEEDED';
export const LOGOUT_FAILED = 'AUTH/LOGOUT_FAILED';
export const SET_SCHOOL = 'AUTH/SET_SCHOOL';
export const RESET_SCHOOL = 'AUTH/RESET_SCHOOL';
export const PERMISSIONS_REQUESTED = 'AUTH/PERMISSIONS_REQUESTED';
export const PERMISSIONS_SUCCEEDED = 'AUTH/PERMISSIONS_SUCCEEDED';
export const PERMISSIONS_FAILED = 'AUTH/PERMISSIONS_FAILED';

export default function auth(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_REQUESTED:
      return state.set('error', false);

    case LOGIN_SUCCEEDED: {
      const { key, userRoleAccount } = payload;
      const { uraId: userRoleAccountId } = userRoleAccount;
      return state.set('token', key).set('userRoleAccountId', userRoleAccountId).set('error', false);
    }

    case LOGIN_FAILED:
      return state.set('error', true);

    case LOGOUT_SUCCEEDED:
      return state.set('token', null).set('school', null);

    case PERMISSIONS_SUCCEEDED: {
      const {
        permissions, user, school: schoolName, role,
      } = payload;
      const permissionsData = new Set(permissions);
      return state
        .set('permissionsData', permissionsData)
        .set('schoolName', schoolName)
        .set('userName', user)
        .set('role', role);
    }

    case SET_SCHOOL:
      localStorage.setItem('school', payload);
      return state.set('school', payload);

    case RESET_SCHOOL:
      localStorage.removeItem('school');
      return state.set('school', null);

    default:
      return state;
  }
}

export function requestLogin(username, password) {
  return {
    type: LOGIN_REQUESTED,
    payload: { username, password },
  };
}

export function requestLogout() {
  return {
    type: LOGOUT_REQUESTED,
  };
}

export function setSchoolAction(payload) {
  return {
    type: SET_SCHOOL,
    payload,
  };
}

export function resetSchoolAction() {
  return {
    type: RESET_SCHOOL,
  };
}

export function getPermissionsAction() {
  return {
    type: PERMISSIONS_REQUESTED,
  };
}
