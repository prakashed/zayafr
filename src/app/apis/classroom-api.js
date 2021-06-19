import { constructQueryString } from '../helpers';
import { listApi, detailsApi, createApi, updateApi, deleteApi } from './index';

const subdomain = 'classrooms';

const CLASSROOM_TEACHERS_SUBDOMAIN = 'classroom-teachers';

export const fetchClassroomList = payload =>
  listApi({ subdomain, query: constructQueryString(payload) });

// export const searchClassrooms = ({ search }) => searchApi({ subdomain, search });

// export const filterClassrooms = ({ school, grade, division }) =>
//   listApi({ subdomain, query: `?school=${school}&grade=${grade}&division=${division}` });

export const filterClassrooms = payload =>
  listApi({ subdomain, query: constructQueryString(payload) });

export const fetchClassroomDetails = id => detailsApi({ subdomain, id });

export const addNewClassroom = classroom => createApi({ subdomain, payload: classroom });

export const updateClassroomDetails = classroom => updateApi({ subdomain, payload: classroom });

export const removeClassroom = id => deleteApi({ subdomain, id });

export const assignTeacherToClassroom = payload =>
  createApi({ subdomain: CLASSROOM_TEACHERS_SUBDOMAIN, payload });

export const deleteTeacherFromClassroom = id =>
  deleteApi({ subdomain: CLASSROOM_TEACHERS_SUBDOMAIN, id });
