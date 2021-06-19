import axios from 'axios';
import { listApi, detailsApi, createApi, updateApi, deleteApi } from './index';

const subdomain = 'curriculums';

export const fetchCurriculumList = () => listApi({ subdomain });

export function fetchFilteredCurriculumList({ search, childType }) {
  console.log('\n \n \n here')
  const url = `${process.env.SERVER_URL}/${subdomain}/?search=${search}&child_type=${childType}`;
  return axios.get(url).then(res => res.data);
}

export const fetchCurriculumDetails = id => detailsApi({ subdomain, id });

// export const addNewCurriculum = payload => createApi({ subdomain, payload });

export const updateCurriculumDetails = payload => updateApi({ subdomain, payload });

export const removeCurriculum = id => deleteApi({ subdomain, id });

// export const addCustomUnit = payload => createApi({ subdomain: 'custom-units', payload });

// export const addNewUnitsToRecital = payload => createApi({ subdomain: 'recital-units', payload });
