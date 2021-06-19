import { listApi, detailsApi, createApi, updateApi, deleteApi, searchApi } from './index';

const subdomain = 'clusters';

export const fetchClusterList = () => listApi({ subdomain });

export const fetchFilteredClusterList = ({ search }) => searchApi({ subdomain, search });

export const fetchClusterDetails = id => detailsApi({ subdomain, id });

export const addNewCluster = payload => createApi({ subdomain, payload });

export const updateClusterDetails = payload => updateApi({ subdomain, payload });

export const removeCluster = id => deleteApi({ subdomain, id });
