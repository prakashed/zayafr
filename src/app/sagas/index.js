import _ from 'lodash';

import {
  // school sagas
  schoolListSaga,
  schoolNextBatchSaga,
  schoolCreateSaga,
  schoolUpdateSaga,
  schoolDeleteSaga,
  schoolSearchSaga,
  schoolDetailsSaga,
  // clearSchoolSearchSaga,
  // cluster sagas
  clusterListSaga,
  clusterNextBatchSaga,
  searchClustersSaga,
  clusterCreateSaga,
  clusterDetailsSaga,
  clusterUpdateSaga,
  clusterDeleteSaga,
  // classroom sagas
  classroomListSaga,
  filterClassroomsSaga,
  classroomCreateSaga,
  classroomDetailsSaga,
  classroomUpdateSaga,
  classroomDeleteSaga
} from './organization-sagas';

// import {
//   recitalListSaga,
//   recitalNextBatchSaga,
//   searchRecitalsSaga,
//   recitalDetailsSaga,
//   recitalCreateSaga,
//   recitalUpdateSaga,
//   recitalDeleteSaga,
//   addUnitsToRecitalSaga,
//   addCustomUnitToRecitalSaga,
// } from './recitals-saga';

import {
  curriculumListSaga,
  curriculumNextBatchSaga,
  searchCurriculumsSaga,
  curriculumDetailsSaga,
  // recitalCreateSaga,
  // theoryCreateSaga,
  // curriculumUpdateSaga,
  curriculumDeleteSaga
  // addUnitsToCurriculumSaga,
  // addCustomUnitToCurriculumSaga,
} from './curriculums-saga';

import {
  recitalCreateSaga,
  recitalUpdateSaga
  // theoryCreateSaga,
} from './recitals-saga';

import {
  // recitalCreateSaga,
  theoryCreateSaga,
  theoryUpdateSaga
} from './theories-saga';

import {
  annualLessonPlanListSaga,
  annualLessonPlanCreateSaga,
  annualLessonPlanDetailsSaga,
  annualLessonPlanDeleteSaga,
  annualLessonPlanUpdateSaga,
  searchAnnualPlansSaga
  // timeUnitCreateSaga,
  // patchIndexesToUnitSaga,
} from './annual-lesson-plans-saga';

import {
  dailyPlanListSaga,
  dailyPlanFilterSaga,
  dailyPlanCreateSaga,
  dailyPlanDetailsSaga,
  dailyPlanDeleteSaga,
  dailyPlanUpdateSaga,
  toDoDeleteSaga,
  toDosCreateSaga,
  reflectionCreateSaga
} from './daily-plan-saga';

import {
  instrumentsListSaga,
  musicalGradesListSaga,
  schoolGradesListSaga,
  divisionsListSaga,
  addNewDivisionSaga,
  categoriesListSaga,
  filteredUnitListByTagAndInstrumentSaga,
  classListSaga,
  booksForInstrumentSaga,
  globalReasonsSaga
} from './general-saga';
import { authSaga, logoutSaga, permissionsSaga } from './auth-sagas';

import {
  bookDetailsSaga,
  booksSaga,
  booksNextBatchSaga,
  deleteBookSaga,
  searchBooksSaga,
  activitiesSaga,
  activitiesNextBatchSaga,
  searchActivitiesSaga,
  activityDetailsSaga,
  createActivitySaga,
  updateActivitySaga,
  deleteActivitySaga
} from './master-saga';

import {
  teacherListSaga,
  teacherDetailsSaga,
  userListSaga,
  userDetailsSaga
} from './people-saga';

import { portionCreateSaga, portionFilterSaga } from './portion-saga';

import {
  lessonCreateSaga,
  lessonUpdateSaga,
  lessonDeleteSaga,
  lessonVideoDeleteSaga,
  lessonVideoCreateSaga
} from './lessons-sagas';

import {
  objectiveCreateSaga,
  objectiveUpdateSaga,
  objectiveDeleteSaga,
  objectiveVideoCreateSaga,
  objectiveVideoDeleteSaga
} from './objectives-sagas';

import {
  categoryCreateSaga,
  categoryDeleteSaga,
  categoryUpdateSaga,
  categoryVideoDeleteSaga,
  categoryVideoCreateSaga
} from './categories-saga';

import { sessionCreateSaga } from './sessions-saga';

const sagas = {
  // School Saga
  schoolListSaga,
  schoolNextBatchSaga,
  schoolCreateSaga,
  schoolUpdateSaga,
  schoolDeleteSaga,
  schoolSearchSaga,
  schoolDetailsSaga,
  // clearSchoolSearchSaga,
  // Cluster Saga
  clusterListSaga,
  clusterNextBatchSaga,
  searchClustersSaga,
  clusterCreateSaga,
  clusterDetailsSaga,
  clusterUpdateSaga,
  clusterDeleteSaga,
  // Classroom Saga
  classroomListSaga,
  filterClassroomsSaga,
  classroomCreateSaga,
  classroomDetailsSaga,
  classroomUpdateSaga,
  classroomDeleteSaga,
  // Recitals Saga
  // recitalListSaga,
  // recitalNextBatchSaga,
  // searchRecitalsSaga,
  // recitalDetailsSaga,
  // recitalCreateSaga,
  // recitalUpdateSaga,
  // recitalDeleteSaga,
  // addUnitsToRecitalSaga,
  // addCustomUnitToRecitalSaga,
  // Curriculums Saga
  curriculumListSaga,
  curriculumNextBatchSaga,
  searchCurriculumsSaga,
  curriculumDetailsSaga,
  // curriculumCreateSaga,
  // curriculumUpdateSaga,
  curriculumDeleteSaga,
  recitalCreateSaga,
  recitalUpdateSaga,
  theoryCreateSaga,
  theoryUpdateSaga,
  // Annual Lesson Plans Saga
  annualLessonPlanListSaga,
  annualLessonPlanCreateSaga,
  annualLessonPlanDetailsSaga,
  annualLessonPlanDeleteSaga,
  annualLessonPlanUpdateSaga,
  searchAnnualPlansSaga,
  // Daily Plan Saga
  dailyPlanCreateSaga,
  dailyPlanListSaga,
  dailyPlanFilterSaga,
  dailyPlanDetailsSaga,
  dailyPlanUpdateSaga,
  dailyPlanDeleteSaga,
  toDoDeleteSaga,
  toDosCreateSaga,
  reflectionCreateSaga,
  // Portion Saga
  portionCreateSaga,
  portionFilterSaga,
  // General Saga
  musicalGradesListSaga,
  schoolGradesListSaga,
  divisionsListSaga,
  addNewDivisionSaga,
  instrumentsListSaga,
  categoriesListSaga,
  filteredUnitListByTagAndInstrumentSaga,
  classListSaga,
  booksForInstrumentSaga,
  authSaga,
  logoutSaga,
  permissionsSaga,
  globalReasonsSaga,
  // Books Saga
  bookDetailsSaga,
  booksSaga,
  booksNextBatchSaga,
  deleteBookSaga,
  searchBooksSaga,
  // Activities Saga
  activitiesSaga,
  activitiesNextBatchSaga,
  searchActivitiesSaga,
  activityDetailsSaga,
  createActivitySaga,
  updateActivitySaga,
  deleteActivitySaga,
  teacherListSaga,
  teacherDetailsSaga,
  userListSaga,
  userDetailsSaga,
  // Lesson Saga
  lessonCreateSaga,
  lessonUpdateSaga,
  lessonDeleteSaga,
  lessonVideoDeleteSaga,
  lessonVideoCreateSaga,
  // Objective saga
  objectiveCreateSaga,
  objectiveUpdateSaga,
  objectiveDeleteSaga,
  objectiveVideoCreateSaga,
  objectiveVideoDeleteSaga,
  categoryCreateSaga,
  categoryUpdateSaga,
  categoryDeleteSaga,
  categoryVideoCreateSaga,
  categoryVideoDeleteSaga,
  // session saga
  sessionCreateSaga
};

export function registerSagasWithMiddleware(middleware) {
  _.values(sagas).forEach(saga => {
    middleware.run(saga);
  });
}

export default {
  registerSagasWithMiddleware
};
