import axios from 'axios';
import { listApi, detailsApi, createApi, updateApi, deleteApi } from './index';

const subdomain = 'lessons';
const subdomainVideo = 'lesson-videos';

// export const fetchCurriculumList = () => listApi({ subdomain });

// export function fetchFilteredCurriculumList({ search, childType }) {
//   console.log('\n \n \n here')
//   const url = `${process.env.SERVER_URL}/${subdomain}/?search=${search}&child_type=${childType}`;
//   return axios.get(url).then(res => res.data);
// }

// export const fetchCurriculumDetails = id => detailsApi({ subdomain, id });

export const addNewLesson = payload => createApi({ subdomain, payload });

export const updateLessonDetails = payload => updateApi({ subdomain, payload });

export const removeLesson = payload =>
  deleteApi({ subdomain, id: payload.id, payload });

export const addNewLessonVideo = payload =>
  createApi({ subdomain: subdomainVideo, payload });

export const removeLessonVideo = payload =>
  deleteApi({ subdomain: subdomainVideo, id: payload.id, payload });

// export const addCustomUnit = payload => createApi({ subdomain: 'custom-units', payload });

// export const addNewUnitsToRecital = payload => createApi({ subdomain: 'recital-units', payload });
