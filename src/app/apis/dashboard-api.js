import {
  listApi,
  listPromiseApi,
  detailsApi,
  createApi,
  updateApi,
  deleteApi
} from "./index";
import axios from "axios";

const mySchools = "my-schools";
const myTodaysSession = "my-todays-session";
const classroomCurrentStatus = "classroom-current-status";
const sessions = "sessions";
const recitalLogs = "recital-logs";
const recitalReflections = "recital-reflections";

const theoryLogs = "theory-logs";
const theoryReflections = "theory-reflections";

export const fetchMySchools = () => listApi({ subdomain: mySchools });
export const fetchMyTodaysSession = () =>
  listApi({ subdomain: myTodaysSession });

export const fetchClassroomCurrentStatus = id =>
  detailsApi({ subdomain: classroomCurrentStatus, id });

export const createProgress = (api, payload) =>
  createApi({ subdomain: api, payload });

// export const fetchSessionList = (search) => listApi({ subdomain: sessions });

export function fetchSessionList(search, limit, offset) {
  const url = `${
    process.env.SERVER_URL
  }/${sessions}/?search=${search}&limit=${limit}&offset=${offset}`;
  return axios.get(url).then(res => res.data);
}

// Recital logs and reflection apis

export function fetchRecitalLogs(sessionId) {
  const url = `${process.env.SERVER_URL}/${recitalLogs}/?session=${sessionId}`;
  return axios.get(url).then(res => res.data);
}

export function fetchRecitalReflections(sessionId) {
  const url = `${
    process.env.SERVER_URL
  }/${recitalReflections}/?session=${sessionId}`;
  return axios.get(url).then(res => res.data);
}

export const createRecitalReflection = payload =>
  createApi({ subdomain: recitalReflections, payload });

// Theory logs and reflection apis
export function fetchTheoryLogs(sessionId) {
  const url = `${process.env.SERVER_URL}/${theoryLogs}/?session=${sessionId}`;
  return axios.get(url).then(res => res.data);
}

export function fetchTheoryReflections(sessionId) {
  const url = `${
    process.env.SERVER_URL
  }/${theoryReflections}/?session=${sessionId}`;
  return axios.get(url).then(res => res.data);
}

export const createTheoryReflection = payload =>
  createApi({ subdomain: theoryReflections, payload });
