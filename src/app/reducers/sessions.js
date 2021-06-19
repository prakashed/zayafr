import { Map } from 'immutable';
import _ from 'lodash';

const initialState = Map({
  data: null
});

export const SESSION_ADD = 'SESSION/ADD';
export const SESSION_READ = 'SESSION/READ';

export default function auth(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SESSION_ADD:
      return state.set('data', payload);

    default:
      return state;
  }
}

export function createSessionAction(payload) {
  return {
    type: SESSION_ADD,
    payload: payload
  };
}

export function getSessionAction() {
  return {
    type: SESSION_READ
  };
}
