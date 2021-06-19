import { detailsApi, listApi, createApi } from './index';

const conductRecital = 'conduct-recital';
const subdomain = conductRecital;

export const fetchRecitalProgress = id => detailsApi({ subdomain, id });
export const fetchRecitalPieces = id =>
  listApi({ subdomain: 'recital-piece', query: '?recitalId=' + id });

export const createRecitalProgress = payload =>
  createApi({ subdomain: 'sessions', payload });

export const createAssignRecitalPiece = payload =>
  createApi({ subdomain: 'assign-recital-piece', payload });
