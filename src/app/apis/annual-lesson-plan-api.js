import axios from 'axios';
import { constructQueryString } from '../helpers';
import { listApi, createApi, detailsApi, deleteApi, updateApi } from './index';

const annualPlanSubdomain = 'annual-plans';
const timeUnitsSubdomain = 'time-units';
const customRecitalsSubdomain = 'custom-recitals';
const portionSubdomain = 'portions';

export const fetchAnnualLessonPlans = payload =>
  listApi({
    subdomain: annualPlanSubdomain,
    query: constructQueryString(payload)
  });

export const fetchAnnualLessonPlanDetails = id =>
  detailsApi({ subdomain: annualPlanSubdomain, id });

export const addNewAnnualLessonPlan = payload =>
  createApi({ subdomain: annualPlanSubdomain, payload });

export const updateAnnualPlan = payload =>
  updateApi({ subdomain: annualPlanSubdomain, payload });

export const removeAnnualPlan = id =>
  deleteApi({ subdomain: annualPlanSubdomain, id });

export const addTimeUnit = payload =>
  createApi({ subdomain: timeUnitsSubdomain, payload });

export const updateTimeUnit = payload =>
  updateApi({ subdomain: timeUnitsSubdomain, payload });

export const removeTimeUnit = id =>
  deleteApi({ subdomain: timeUnitsSubdomain, id });

export const fetchTimeUnitsForAnnualPlan = annualPlanId =>
  listApi({
    subdomain: timeUnitsSubdomain,
    query: constructQueryString({ annual_plan: annualPlanId })
  });

export function patchTimeUnitIndices({ id, indices }) {
  const url = `${process.env.SERVER_URL}/time-units/${id}/`;
  return axios.patch(url, { indices }).then(res => res.data);
}

export const createCustomRecital = payload =>
  createApi({ subdomain: customRecitalsSubdomain, payload });

export const updateCustomRecital = payload =>
  updateApi({ subdomain: customRecitalsSubdomain, payload });

export const removeCustomRecital = id =>
  deleteApi({ subdomain: customRecitalsSubdomain, id });

export const createNewPortion = payload =>
  createApi({ subdomain: portionSubdomain, payload });

export const filterPortions = ({ annualPlanId, instrumentId }) =>
  listApi({
    subdomain: portionSubdomain,
    query: `?custom_recital__annual_plan=${annualPlanId}&custom_recital__instrument=${instrumentId}`
  });

export const filterPortionsByQuarters = ({ quarterId, instrumentId }) =>
  listApi({
    subdomain: portionSubdomain,
    query: `?time_unit=${quarterId}&custom_recital__instrument=${instrumentId}`
  });

export const updatePortion = payload =>
  updateApi({ subdomain: portionSubdomain, payload });

export const deletePortion = id =>
  deleteApi({ subdomain: portionSubdomain, id });
