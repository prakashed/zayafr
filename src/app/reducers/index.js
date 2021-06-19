import { combineReducers } from 'redux';
import auth from './auth';
import people from './people';
import schools from './schools';
import clusters from './clusters';
import annualLessonPlans from './annual-plans';
import recitals_old from './recitals_old';
import recitals from './recitals';
import theories from './theories';
import curriculums from './curriculums';
import general from './general';
import dailyPlans from './daily-plans';
import activities from './activities';
import books from './books';
import classrooms from './classrooms';
import portions from './portions';
import lessons from './lessons';
import objectives from './objectives';
import categories from './categories';
import sessions from './sessions';

export default combineReducers({
  auth,
  people,
  schools,
  clusters,
  annualLessonPlans,
  recitals_old,
  curriculums,
  theories,
  recitals,
  general,
  dailyPlans,
  activities,
  books,
  classrooms,
  portions,
  lessons,
  objectives,
  categories,
  sessions
});
