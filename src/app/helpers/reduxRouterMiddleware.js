import history from './history';
import { API_ACTION, STATUS_TYPES, ACTION_TYPES } from './reduxActionUtils';
import { DOMAIN as CLUSTER_DOMAIN } from '../reducers/clusters';
import { DOMAIN as SCHOOL_DOMAIN } from '../reducers/schools';
import { DOMAIN as RECITAL_DOMAIN } from '../reducers/recitals';
import { DOMAIN as THEORY_DOMAIN } from '../reducers/theories';
import { DOMAIN as CURRICULUM_DOMAIN } from '../reducers/curriculums';
import { DOMAIN as ACTIVITY_DOMAIN } from '../reducers/activities';
import { DOMAIN as CLASSROOM_DOMAIN } from '../reducers/classrooms';
import { DOMAIN as ANNUAL_PLAN_DOMAIN } from '../reducers/annual-plans';
import { DOMAIN as DAILY_PLAN_DOMAIN } from '../reducers/daily-plans';
import routes from '../constants/routes.json';

const { SUCCESS } = STATUS_TYPES;
const { NEW, UPDATE } = ACTION_TYPES;

const getDomainUrl = domain => {
  switch (domain) {
    case CLUSTER_DOMAIN:
      return `${routes.clusters}`;
    case SCHOOL_DOMAIN:
      return `${routes.schools}`;
    case RECITAL_DOMAIN:
      return `${routes.recitals}`;
    case CURRICULUM_DOMAIN:
      return `${routes.curriculums}`;
    case ACTIVITY_DOMAIN:
      return `${routes.activities}`;
    case CLASSROOM_DOMAIN:
      return `${routes.classrooms}`;
    case ANNUAL_PLAN_DOMAIN:
      return `${routes.schools}`;
    case DAILY_PLAN_DOMAIN:
      return `${routes.daily_plans}`;
    default:
      return '/';
  }
};

const getRedirectUrl = ({ domain, payload, type }) => {
  console.log(payload);

  const { id } = payload;
  const domainUrl = getDomainUrl(domain);

  // Only weird case,
  // redirect to edit page when new annual plan is created or new classroom is created
  if (
    (domain === ANNUAL_PLAN_DOMAIN || domain === CLASSROOM_DOMAIN) &&
    type === NEW
  ) {
    const { school } = payload;
    return `${domainUrl}/${school}`;
  }

  // More special cases
  // redirect to edit page when curriculum (recital or theory) is created
  if (
    (domain === RECITAL_DOMAIN || domain === THEORY_DOMAIN) &&
    (type === NEW || type === UPDATE)
  ) {
    const curriculumDomainUrl = getDomainUrl(CURRICULUM_DOMAIN);
    // return `${curriculumDomainUrl}/${id}${routes.edit}`;
    return `${curriculumDomainUrl}/${id}`;
  }

  return `${domainUrl}/${id}`;
  // switch (domain) {
  //   case CLUSTER_DOMAIN:
  //     return `${routes.clusters}/${id}`;
  //   case SCHOOL_DOMAIN:
  //     return `${routes.schools}/${id}`;
  //   case RECITAL_DOMAIN:
  //     return `${routes.recitals}/${id}`;
  //   case ACTIVITY_DOMAIN:
  //     return `${routes.activities}/${id}`;
  //   case CLASSROOM_DOMAIN:
  //     return `${routes.classrooms}/${id}`;
  //   case ANNUAL_PLAN_DOMAIN:
  //     return `${routes.annual_plans}/${id}${routes.edit}`;
  //   default:
  //     return '/';
  // }
};

const doWeHaveToDirect = action => {
  const { subtype, type, status } = action;

  const redirect = false;

  // only check for successful API requests
  if (status !== SUCCESS || subtype !== API_ACTION) return redirect;

  // considering the cases only when something NEW is created or something is updated
  if (type !== NEW && type !== UPDATE) return redirect;

  return true;
};

const routerMiddleware = store => next => action => {
  const { domain, payload, type } = action;

  const haveToRedirect = doWeHaveToDirect(action);

  if (haveToRedirect) {
    const url = getRedirectUrl({ type, domain, payload });
    history.push(url);
  }

  next(action);
};

export default routerMiddleware;
