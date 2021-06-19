import axios from 'axios';
import { listApi } from './index';

const FSM_URL_LOGIN = `${process.env.SERVER_URL}/custom-login/`;

export function loginToOCM(emailid, password) {
  return axios
    .post(
      OCM_LOGIN,
      { emailid, password },
      { headers: { 'api-key': OCM_API_KEY } }
    )
    .then(res => res.data);
}

export function loginToFSM(uraOcmId) {
  return axios.post(FSM_URL_LOGIN, { uraOcmId }).then(res => res.data);
}

export function login(emailid, password) {
  return axios.post(FSM_URL_LOGIN, { emailid, password }).then(res => res.data);
}

export const fetchPermissions = () => listApi({ subdomain: 'my-permissions' });
