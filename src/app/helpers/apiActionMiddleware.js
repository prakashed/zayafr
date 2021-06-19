import { message } from 'antd';

import { API_ACTION, STATUS_TYPES, ACTION_TYPES } from './reduxActionUtils';
import { DEFAULT_ERROR_MESSAGE } from '.';
import { DOMAIN as ANNUAL_PLAN_DOMAIN } from '../reducers/annual-plans';

const { REQUESTED, SUCCESS, FAILED } = STATUS_TYPES;
const { NEW, UPDATE, DELETE } = ACTION_TYPES;

let notificationMessage = null;

const findErrorMessageBasedOnDomain = ({ data, domain, status }) => {
  if (status === 404) {
    return "Can't find the stuff you are looking for!";
  }

  switch (domain) {
    case ANNUAL_PLAN_DOMAIN: {
      if (data.classroom) {
        return "A classroom can't have more than one annual plan";
      }
      break;
    }
    default: {
      return DEFAULT_ERROR_MESSAGE;
    }
  }
  return DEFAULT_ERROR_MESSAGE;
};

const getErrorMessage = ({ error, domain }) => {
  try {
    const { response } = error;
    const { data, status } = response;
    return findErrorMessageBasedOnDomain({ data, domain, status });
  } catch (err) {
    return DEFAULT_ERROR_MESSAGE;
  }
};

const apiActionMiddleWare = store => next => (action) => {
  const { subtype, type } = action;

  if (subtype === API_ACTION) {
    const { status } = action;

    if (notificationMessage) {
      notificationMessage();
    }

    switch (status) {
      case REQUESTED:
        notificationMessage = message.loading('Loading..');
        break;

      case SUCCESS:
        switch (type) {
          case NEW:
            notificationMessage = message.success('Created!');
            break;
          case UPDATE:
            notificationMessage = message.success('Updated!');
            break;
          case DELETE:
            notificationMessage = message.success('Deleted!');
            break;
          default:
        }
        break;

      case FAILED: {
        const { payload, domain } = action;
        const errorMessage = getErrorMessage({ error: payload.err, domain });
        notificationMessage = message.error(errorMessage);
        break;
      }

      default:
    }
  }

  next(action);
};

export default apiActionMiddleWare;
