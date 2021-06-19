import { listApi, createApi, detailsApi, deleteApi, updateApi } from './index';
import { constructQueryString } from '../helpers';

const dailyPlanSubdomain = 'daily-plans';
const todosSubdomain = 'todos';
const reflectionSubdomain = 'reflections';

export const fetchDailyPlans = payload => listApi({
  subdomain: dailyPlanSubdomain,
  query: constructQueryString(payload),
});

export const fetchDailyPlanDetails = id =>
  detailsApi({ subdomain: dailyPlanSubdomain, id });

export const addNewDailyLessonPlan = payload =>
  createApi({ subdomain: dailyPlanSubdomain, payload });

export const updateDailyPlan = payload =>
  updateApi({ subdomain: dailyPlanSubdomain, payload });

export const removeDailyPlan = id => deleteApi({ subdomain: dailyPlanSubdomain, id });

export const createToDos = payload => createApi({ subdomain: todosSubdomain, payload });

export const removeToDo = id => deleteApi({ subdomain: todosSubdomain, id });

export const createReflection = payload => createApi({ subdomain: reflectionSubdomain, payload });
