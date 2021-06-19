import axios from 'axios';
import cookie from 'js-cookie';
import isUndefined from 'lodash/isUndefined';
import merge from 'lodash/merge';
import _ from 'lodash';

function requestInterceptor(config) {
  const token = cookie.get('token');
  // const schoolId = localStorage.getItem('school');
  // const token = '01ed82c2db7b2b355684ea2c4a3fc16527aafa3d';
  // console.log('cookie', token);
  const headers = {};

  if (!isUndefined(token)) {
    headers.Authorization = `Token ${token}`;
  }

  // if (!_.isNull(schoolId)) {
  //   headers.School = schoolId;
  // }

  if (!_.isEmpty(headers)) {
    const mergedHeaders = merge({ headers }, config);
    return mergedHeaders;
  }
  return config;
}

function requestInterceptorError(err) {
  throw new Error(`Failed while intercepting request : ${err}`);
}

axios.interceptors.request.use(requestInterceptor, requestInterceptorError);
