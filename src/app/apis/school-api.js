import {
  listApi,
  searchApi,
  createApi,
  updateApi,
  deleteApi,
  detailsApi
} from './index';

const subdomain = 'centers';

export const fetchSchoolList = () => listApi({ subdomain });

export const fetchSchoolDetails = id => detailsApi({ subdomain, id });

export const searchSchools = ({ search }) => searchApi({ subdomain, search });

export const addNewSchool = school => createApi({ subdomain, payload: school });

export const updateSchoolDetails = school =>
  updateApi({ subdomain, payload: school });

export const removeSchool = id => deleteApi({ subdomain, id });
