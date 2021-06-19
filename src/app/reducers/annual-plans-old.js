import { Map } from 'immutable';
import _ from 'lodash';

import { LOGOUT_SUCCEEDED } from './auth';

const initialState = Map();

export const ANNUALPLANS_ADD_UNIT_REQUESTED = 'ANNUALPLANS/ADD_UNIT_REQUESTED';
export const ANNUALPLANS_ADD_UNIT_SUCCEEDED = 'ANNUALPLANS/ADD_UNIT_SUCCEEDED';
export const ANNUALPLANS_ADD_UNIT_FAILED = 'ANNUALPLANS/ADD_UNIT_FAILED';

export const ANNUALPLANS_ADD_INDEX = 'ANNUALPLANS/ANNUALPLANS_ADD_INDEX';
export const ANNUALPLANS_PATCH_INDEX_REQUESTED = 'ANNUALPLANS/PATCH_INDEX_REQUESTED';
export const ANNUALPLANS_PATCH_INDEX_SUCCEEDED = 'ANNUALPLANS/PATCH_INDEX_SUCCEEDED';
export const ANNUALPLANS_PATCH_INDEX_FAILED = 'ANNUALPLANS/PATCH_INDEX_FAILED';

export const ANNUAL_LESSON_PLAN_LIST_REQUESTED = 'ANNUAL_LESSON_PLAN/LIST_REQUESTED';
export const ANNUAL_LESSON_PLAN_LIST_SUCCEEDED = 'ANNUAL_LESSON_PLAN/LIST_SUCCEEDED';
export const ANNUAL_LESSON_PLAN_LIST_FAILED = 'ANNUAL_LESSON_PLAN/LIST_FAILED';

export const ANNUAL_LESSON_PLAN_CREATE_REQUESTED = 'ANNUAL_LESSON_PLAN/CREATE_REQUESTED';
export const ANNUAL_LESSON_PLAN_CREATE_SUCCEEDED = 'ANNUAL_LESSON_PLAN/CREATE_SUCCEEDED';
export const ANNUAL_LESSON_PLAN_CREATE_FAILED = 'ANNUAL_LESSON_PLAN/CREATE_FAILED';

export default function annualLessonPlansReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ANNUAL_LESSON_PLAN_LIST_SUCCEEDED: {
      const { annualLessonPlans } = action.payload;
      const annualLessonPlansMap = Map(_.keyBy(annualLessonPlans, 'id'));
      return state.merge(annualLessonPlansMap);
    }
    case ANNUAL_LESSON_PLAN_CREATE_SUCCEEDED: {
      const { annualLessonPlan } = action.payload;
      return state.set(annualLessonPlan.id, annualLessonPlan);
    }
    case ANNUALPLANS_ADD_INDEX: {
      const annualPlan = _.cloneDeep(state.get(payload.annualPlanId));
      const unitIndex = _.findIndex(annualPlan.timeUnits, ['id', payload.unitId]);
      const indicesIndex = _.findIndex(annualPlan.timeUnits[unitIndex].indices, ['id', payload.newIndex.id]);
      if (_.isNull(annualPlan.timeUnits[unitIndex].indices)) {
        annualPlan.timeUnits[unitIndex].indices = [];
      }
      if (indicesIndex === -1) {
        annualPlan.timeUnits[unitIndex].indices.splice((payload.destinationIndex || 0), 0, payload.newIndex);
      }
      return state.set(payload.annualPlanId, annualPlan);
    }
    case ANNUALPLANS_PATCH_INDEX_SUCCEEDED: {
      const { annualLessonPlanId, timeUnit } = payload;
      const annualPlan = state.get(annualLessonPlanId);
      const existingTimeUnits = annualPlan.timeUnits;
      const unitIndex = existingTimeUnits.findIndex(u => u.id === timeUnit.id);

      if (unitIndex > -1) {
        const newTimeUnits = [...existingTimeUnits.slice(0, unitIndex), timeUnit, ...existingTimeUnits.slice(unitIndex + 1)];
        const newAnnualPlan = { ...annualPlan, timeUnits: newTimeUnits };
        return state.set(annualLessonPlanId, newAnnualPlan);
      }

      return state;
    }
    case ANNUALPLANS_ADD_UNIT_SUCCEEDED: {
      const { timeUnit } = payload;
      const { annualPlan: annualPlanId } = timeUnit;
      const annualPlan = state.get(annualPlanId);
      const { timeUnits } = annualPlan;
      const newTimeUnits = [...timeUnits, timeUnit];
      const newAnnualPlan = { ...annualPlan, timeUnits: newTimeUnits };
      return state.set(annualPlanId, newAnnualPlan);
    }
    case LOGOUT_SUCCEEDED: {
      return initialState;
    }
    default:
      return state;
  }
}

export function addUnitToAnnualPlanAction({ annual_plan, title }) {
  return {
    type: ANNUALPLANS_ADD_UNIT_REQUESTED,
    payload: { annual_plan, title },
  };
}

export function addIndexToUnitAction(annualPlanId, unitId, newIndex, destinationIndex) {
  return {
    type: ANNUALPLANS_ADD_INDEX,
    payload: {
      annualPlanId, unitId, newIndex, destinationIndex,
    },
  };
}

export function getAnnualLessonPlansListAction() {
  return {
    type: ANNUAL_LESSON_PLAN_LIST_REQUESTED,
  };
}

export function createAnnualLessonPlanAction(annualLessonPlan) {
  return {
    type: ANNUAL_LESSON_PLAN_CREATE_REQUESTED,
    payload: annualLessonPlan,
  };
}

export function patchIndexesToUnitAction(payload) {
  return {
    type: ANNUALPLANS_PATCH_INDEX_REQUESTED,
    payload,
  };
}
