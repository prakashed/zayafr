import { detailsApi, createApi } from './index';

const conductTheory = 'conduct-theory';

const subdomain = conductTheory;

export const fetchTheoryProgress = id => detailsApi({ subdomain, id });
export const createTheoryProgress = payload =>
  createApi({ subdomain: 'sessions', payload });
