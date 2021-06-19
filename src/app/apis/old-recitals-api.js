import axios from 'axios';
import { listApi, detailsApi, createApi, updateApi, deleteApi } from './index';

const subdomain = 'recitals';

export const fetchRecitalList = () => listApi({ subdomain });

export function fetchFilteredRecitalList({ search, musicalGrade }) {
  const url = `${process.env.SERVER_URL}/${subdomain}/?search=${search}&musical_grade=${musicalGrade}`;
  return axios.get(url).then(res => res.data);
}

export const fetchRecitalDetails = id => detailsApi({ subdomain, id });

export const addNewRecital = payload => createApi({ subdomain, payload });

export const updateRecitalDetails = payload => updateApi({ subdomain, payload });

export const removeRecital = id => deleteApi({ subdomain, id });

export const addCustomUnit = payload => createApi({ subdomain: 'custom-units', payload });

export const addNewUnitsToRecital = payload => createApi({ subdomain: 'recital-units', payload });
