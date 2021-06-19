import { listApi, detailsApi, searchApi } from './index';

// const teacherSubdomain = 'teachers';
const userSubdomain = 'user-role-accounts';

export const fetchTeacherList = () => listApi({ subdomain: userSubdomain });

export const fetchTeacherDetails = id => detailsApi({ subdomain: userSubdomain, id });

export const searchTeachers = ({ search, school }) => searchApi({ subdomain: userSubdomain, query: `${school ? `schools=${school}` : ''}`, search });

export const fetchUserList = () => listApi({ subdomain: userSubdomain });

export const fetchUserDetails = id => detailsApi({ subdomain: userSubdomain, id });

export const searchUsers = ({ search }) => searchApi({ subdomain: userSubdomain, search });
