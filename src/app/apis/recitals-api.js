import axios from 'axios';
import { listApi, detailsApi, createApi, updateApi, deleteApi } from './index';

const subdomain = 'recitals';

// export const fetchCurriculumList = () => listApi({ subdomain });

export function fetchFilteredRecitalList({ search }) {
  const url = `${process.env.SERVER_URL}/${subdomain}/?search=${search}`;
  return axios.get(url).then(res => res.data);
}

// export const fetchCurriculumDetails = id => detailsApi({ subdomain, id });

export const addNewRecital = payload => createApi({ subdomain, payload });

export const updateRecitalDetails = payload =>
  updateApi({ subdomain, payload });

// export const removeCurriculum = id => deleteApi({ subdomain, id });

// export const addCustomUnit = payload => createApi({ subdomain: 'custom-units', payload });

// export const addNewUnitsToRecital = payload => createApi({ subdomain: 'recital-units', payload });
