import axios from 'axios';
import { createApi, updateApi, searchApi } from './index';

const subdomain = 'theories';

export const addNewTheory = payload => createApi({ subdomain, payload });

export const updateTheoryDetails = payload => updateApi({ subdomain, payload });

export const searchTheories = ({ search }) =>
  searchApi({ subdomain: subdomain, search });
