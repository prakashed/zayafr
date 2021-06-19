import axios from 'axios';
import { listApi, createApi } from './index';
import { constructQueryString } from '../helpers';

export const fetchInstrumentList = payload => listApi({ subdomain: 'instruments', query: constructQueryString(payload) });

export const filterInstrumentListByUser = ({ userName }) => listApi({ subdomain: 'instruments', query: `?teachers__user__username=${userName}` });

export const fetchMusicalGradeList = () => listApi({ subdomain: 'musical-grades' });

export const fetchSchoolGradeList = () => listApi({ subdomain: 'grades' });

export const fetchDivisionList = ({ school }) => listApi({ subdomain: 'divisions', query: `?school=${school}` });

export const addNewDivision = payload => createApi({ subdomain: 'divisions', payload });

export const fetchCategoryList = () => listApi({ subdomain: 'categories' });

export const fetchClassList = () => listApi({ subdomain: 'classes' });

export const fetchGlobalReasons = () => listApi({ subdomain: 'global-reasons' });

export function filterUnitByTagAndInstrument({ tag, instrumentId }) {
  const url = `${process.env.SERVER_URL}/book-units/?lessons__tags__title=${tag}`;
  return axios.get(url).then(res => res.data);
}

export function uploadAttachments({ file, type }) {
  const formData = new FormData();

  formData.append('path', file);
  formData.append('type', type);

  const url = `${process.env.SERVER_URL}/attachments/`;
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  return axios.post(url, formData, config).then(res => res.data);
}
