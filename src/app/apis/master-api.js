import axios from 'axios';
import { listApi, detailsApi, createApi, updateApi, deleteApi, searchApi } from './index';

const bookSubdomain = 'books';
const activitySubdomain = 'activities';

export function fetchBooksForInstrument(instrumentId) {
  const url = `${process.env.SERVER_URL}/books/?instrument=${instrumentId}`;
  return axios.get(url).then(res => res.data);
}

export const fetchBookDetails = id => detailsApi({ subdomain: bookSubdomain, id });

export const fetchBooks = () => listApi({ subdomain: bookSubdomain });

export const deleteBook = id => deleteApi({ subdomain: bookSubdomain, id });

export const searchBooks = ({ search }) => searchApi({ subdomain: bookSubdomain, search });

export const fetchActivityDetails = id => detailsApi({ subdomain: activitySubdomain, id });

export const fetchActivities = () => listApi({ subdomain: activitySubdomain });

export const searchActivities = ({ search }) => searchApi({ subdomain: activitySubdomain, search });

export const addNewActivity = payload => createApi({ subdomain: activitySubdomain, payload });

export const deleteActivity = id => deleteApi({ subdomain: activitySubdomain, id });

export const updateActivityDetails = payload =>
  updateApi({ subdomain: activitySubdomain, payload });
