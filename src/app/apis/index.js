import axios from 'axios';

export function listApi({ subdomain, query }) {
  const url = `${process.env.SERVER_URL}/${subdomain}/${query || ''}`;
  return axios.get(url).then(res => res.data);
}

export function listPromiseApi({ subdomain, query }) {
  const url = `${process.env.SERVER_URL}/${subdomain}/${query || ''}`;
  return axios.get(url);
}

export function detailsApi({ subdomain, id }) {
  const url = `${process.env.SERVER_URL}/${subdomain}/${id}/`;
  return axios.get(url).then(res => res.data);
}

export function createApi({ subdomain, payload }) {
  const url = `${process.env.SERVER_URL}/${subdomain}/`;
  return axios.post(url, payload).then(res => res.data);
}

export function updateApi({ subdomain, payload }) {
  const { id } = payload;
  const url = `${process.env.SERVER_URL}/${subdomain}/${id}/`;
  return axios.put(url, payload).then(res => res.data);
}

export function deleteApi({ subdomain, id, payload }) {
  const url = `${process.env.SERVER_URL}/${subdomain}/${id}/`;
  return axios.delete(url).then(res => res.data);
}

export function searchApi({ subdomain, query, search }) {
  const url = `${
    process.env.SERVER_URL
  }/${subdomain}/?search=${search}&${query}/`;
  return axios.get(url).then(res => res.data);
}

export function getApi(url) {
  return axios.get(url).then(res => res.data);
}
