import axios from 'axios';
import { listApi, detailsApi, createApi, updateApi, deleteApi } from './index';

const subdomain = 'objectives';
const subdomainVideo = 'objective-videos';

// export const fetchCurriculumList = () => listApi({ subdomain });

// export function fetchFilteredCurriculumList({ search, childType }) {
//   console.log('\n \n \n here')
//   const url = `${process.env.SERVER_URL}/${subdomain}/?search=${search}&child_type=${childType}`;
//   return axios.get(url).then(res => res.data);
// }

// export const fetchCurriculumDetails = id => detailsApi({ subdomain, id });

export const addNewObjective = payload => createApi({ subdomain, payload });

export const updateObjectiveDetails = payload =>
  updateApi({ subdomain, payload });

export const removeObjective = payload =>
  deleteApi({ subdomain, id: payload.id, payload });

export const addNewObjectiveVideo = payload =>
  createApi({ subdomain: subdomainVideo, payload });

export const removeObjectiveVideo = payload =>
  deleteApi({ subdomain: subdomainVideo, id: payload.id, payload });
