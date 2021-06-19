import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import { DAILY_PLAN_DATE_FORMAT, DATE_FORMAT } from '../constants/config';

let notificationMessage;

export function is404Error(error) {
  if (!error || !error.response) return false;
  const { response } = error;
  const { status } = response;
  return status === 404;
}

export function showNotification({ text, type }) {
  if (notificationMessage) {
    notificationMessage();
  }
  notificationMessage = message[type](text);
}

export function constructQueryString(queryObj) {
  if (!queryObj) return '';

  const keys = _.keys(queryObj);
  const query = keys.map(k => `${k}=${queryObj[k]}`).join('&');
  return `?${query}`;
}

export function getAttachmentNameFromPath(path) {
  const pos = path && path.lastIndexOf('/');
  if (pos && pos > -1) {
    return path.slice(pos + 1);
  }

  return 'Default Attachment';
}

export function justAddsOne(num) {
  return num + 1;
}

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong!';

export function extractErrorMessage(err) {
  if (!err) return DEFAULT_ERROR_MESSAGE;

  const { data } = err.response;
  const { nonFieldErrors } = data;
  return (nonFieldErrors && nonFieldErrors[0]) || DEFAULT_ERROR_MESSAGE;
}

export function checkIfObjectHasOwnProperty({ object, property }) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

export function getTimestampFromMoment(obj) {
  if (!obj) return obj;

  return parseInt(obj.format('x'), 10);
}

export function createNewQuarter({ title, period }) {
  if (!title || !period || !period.length) {
    throw new Error(`DataError: Invalid data Title: ${title} Period: ${period}`);
  }

  // Expecting fromDate and toDate to be MomentJS prototype objects
  const fromMoment = period[0].startOf('day');
  const toMoment = period[1].endOf('day');

  return {
    // id: fromMoment.format('x'),
    title,
    period,
    fromDate: fromMoment.format(DATE_FORMAT),
    toDate: toMoment.format(DATE_FORMAT),
    fromTs: getTimestampFromMoment(fromMoment),
    toTs: getTimestampFromMoment(toMoment),
  };
}

function quarterOverlapLogic({ quarter, timestamp }) {
  if (!quarter || !timestamp || !checkIfObjectHasOwnProperty({ object: quarter, property: 'toDate' }) || !checkIfObjectHasOwnProperty({ object: quarter, property: 'fromDate' })) {
    throw new Error(`DataError: Timestamp ${timestamp} Quarter ${quarter}`);
  }

  const { fromDate, toDate } = quarter;
  const fromTs = getTimestampFromMoment(moment(fromDate).startOf('day'));
  const toTs = getTimestampFromMoment(moment(toDate).endOf('day'));
  // The timestamp should not lie between the fromTimestamp and toTimestamp
  // of the quarter
  return (fromTs < timestamp) && (timestamp < toTs);
}

export function checkForQuarterPeriodOverlaps({ newQuarter, quartersAdded }) {
  const quarterOverlapping = true;
  const { fromTs, toTs } = newQuarter;

  for (let i = 0; i < quartersAdded.length; i += 1) {
    const quarter = quartersAdded[i];
    const fromTsOverlaps = quarterOverlapLogic({ quarter, timestamp: fromTs });
    const toTsOverlaps = quarterOverlapLogic({ quarter, timestamp: toTs });
    if (fromTsOverlaps || toTsOverlaps) {
      return quarterOverlapping;
    }
  }

  // If we have reached here, then there are no quarters with which the new quarter overlaps
  return false;
}

export function sortQuartersInAscendingOrder(quarters) {
  return [...quarters].sort((qA, qB) => qA.fromTs - qB.fromTs);
}

export function checkIfQuartersOverflowAnnualPlanTime({ fromDate, toDate, quarter }) {
  const startTs = getTimestampFromMoment(fromDate);
  const endTs = getTimestampFromMoment(toDate);

  const { fromTs, toTs } = quarter;
  if (fromTs < startTs || toTs > endTs) {
    // this quarter period if not within the time frame of the annual plan
    // send the faulty quarter
    return true;
  }
  // for (let i = 0; i < quartersAdded.length; i += 1) {
  //   const quarter = quartersAdded[i];
  //   const { fromTs, toTs } = quarter;
  //   if (fromTs < startTs || toTs > endTs) {
  //     // this quarter period if not within the time frame of the annual plan
  //     // send the faulty quarter
  //     return quarter;
  //   }
  // }

  return false;
}

// Logic to merge individual custom recitals into a single array of objects
// where each object represents one recital and all instruments belonging to same recital
export function mergeCustomRecitals(customRecitals) {
  const mapper = customRecitals.reduce((obj, customRecital) => {
    const {
      id, recital, instrumentDetails, recitalName,
    } = customRecital;

    let recitalObj;
    if (!obj[recital]) {
      recitalObj = {
        id: recital,
        title: recitalName,
        instrumentDetails: [],
        customRecitalIds: [],
      };
    } else {
      recitalObj = obj[recital];
    }

    recitalObj.instrumentDetails.push(instrumentDetails);
    recitalObj.customRecitalIds.push(id);

    const modifiedObj = {};
    modifiedObj[recital] = recitalObj;
    return { ...obj, ...modifiedObj };
  }, {});

  return _.values(mapper);
}

function mapInstrumentToCustomRecitals(customRecitals) {
  const instrumentMapper = {};

  customRecitals.forEach((customRecital) => {
    const { instrument, instrumentDetails } = customRecital;

    if (!instrumentMapper[instrument]) {
      instrumentMapper[instrument] = {
        instrumentDetails,
        customRecitals: [],
      };
    }

    instrumentMapper[instrument].customRecitals.push(customRecital);
  });

  return instrumentMapper;
}

function parseTimeUnits(timeUnits) {
  return timeUnits.map((timeUnit) => {
    const { fromDate, toDate } = timeUnit;

    const fromMoment = moment(fromDate);
    const toMoment = moment(toDate);
    const fromTs = getTimestampFromMoment(fromMoment);
    const toTs = getTimestampFromMoment(toMoment);
    const readableFromDate = fromMoment.format('Do MMM');
    const readableToDate = toMoment.format('Do MMM');

    return {
      ...timeUnit,
      fromMoment,
      toMoment,
      fromTs,
      toTs,
      readableFromDate,
      readableToDate,
    };
  });
}

export function parseAnnualPlan(annualPlan) {
  const { customRecitalDetails, timeUnitDetails } = annualPlan;
  /**
   * Create an array of recital details where
   * each object contains details for recital
   * and an array of instruments which belong to the same recital
   */
  const recitalDetails = mergeCustomRecitals(customRecitalDetails);

  /**
   * Create a map, instrumentId as key and value should be {
   *  instrumentDetails: instrument obj
   *  customRecitals: [] of all the custom recitals in which this instrument comes
   * }
   */
  const instrumentCustomRecitals = mapInstrumentToCustomRecitals(customRecitalDetails);
  return {
    ...annualPlan,
    recitalDetails,
    instrumentCustomRecitals,
    timeUnitDetails: parseTimeUnits(timeUnitDetails),
  };
}

export function parseDailyPlan(dailyPlan) {
  const { date } = dailyPlan;
  const todayDate = moment().format(DATE_FORMAT);
  return {
    title: moment(date).format(DAILY_PLAN_DATE_FORMAT),
    isToday: date === todayDate,
    ...dailyPlan,
  };
}

export function getClassroomNames(classrooms) {
  return classrooms.map(c => `${c.grade} ${c.division}`).join(', ');
}

function playHarlemShake() { function c() { const e = document.createElement('link'); e.setAttribute('type', 'text/css'); e.setAttribute('rel', 'stylesheet'); e.setAttribute('href', f); e.setAttribute('class', l); document.body.appendChild(e); } function h() { const e = document.getElementsByClassName(l); for (let t = 0; t < e.length; t++) { document.body.removeChild(e[t]); } } function p() { const e = document.createElement('div'); e.setAttribute('class', a); document.body.appendChild(e); setTimeout(() => { document.body.removeChild(e); }, 100); } function d(e) { return { height: e.offsetHeight, width: e.offsetWidth }; } function v(i) { const s = d(i); return s.height > e && s.height < n && s.width > t && s.width < r; } function m(e) { let t = e; let n = 0; while (t) { n += t.offsetTop; t = t.offsetParent; } return n; } function g() { const e = document.documentElement; if (window.innerWidth) { return window.innerHeight; } else if (e && !isNaN(e.clientHeight)) { return e.clientHeight; } return 0; } function y() { if (window.pageYOffset) { return window.pageYOffset; } return Math.max(document.documentElement.scrollTop, document.body.scrollTop); } function E(e) { const t = m(e); return t >= w && t <= b + w; } function S() { const e = document.createElement('audio'); e.setAttribute('class', l); e.src = i; e.loop = false; e.addEventListener('canplay', () => { setTimeout(() => { x(k); }, 500); setTimeout(() => { N(); p(); for (let e = 0; e < O.length; e++) { T(O[e]); } }, 15500); }, true); e.addEventListener('ended', () => { N(); h(); }, true); e.innerHTML = ' <p>If you are reading this, it is because your browser does not support the audio element. We recommend that you get a new browser.</p> <p>'; document.body.appendChild(e); e.play(); } function x(e) { e.className += ` ${s} ${o}`; } function T(e) { e.className += ` ${s} ${u[Math.floor(Math.random() * u.length)]}`; } function N() { const e = document.getElementsByClassName(s); const t = new RegExp(`\\b${s}\\b`); for (let n = 0; n < e.length;) { e[n].className = e[n].className.replace(t, ''); } } var e = 30; var t = 30; var n = 350; var r = 350; var i = '//s3.amazonaws.com/moovweb-marketing/playground/harlem-shake.mp3'; var s = 'mw-harlem_shake_me'; var o = 'im_first'; var u = ['im_drunk', 'im_baked', 'im_trippin', 'im_blown']; var a = 'mw-strobe_light'; var f = '//s3.amazonaws.com/moovweb-marketing/playground/harlem-shake-style.css'; var l = 'mw_added_css'; var b = g(); var w = y(); const C = document.getElementsByTagName('*'); var k = null; for (var L = 0; L < C.length; L++) { var A = C[L]; if (v(A)) { if (E(A)) { k = A; break; } } } if (A === null) { console.warn('Could not find a node of the right size. Please try a different page.'); return; }c(); S(); var O = []; for (var L = 0; L < C.length; L++) { var A = C[L]; if (v(A)) { O.push(A); } } }

let doingHarlemShake = false;

export function doHarlemShake() {
  if (doingHarlemShake) return;

  doingHarlemShake = true;

  playHarlemShake();

  setTimeout(() => {
    doingHarlemShake = false;
    // 30 sec is duration of song
  }, 30000);
}

export function checkIfUserIsTeacher(role) {
  return role && role.length === 1 && role[0] === 'Teacher';
}

export function getLessonIdsFromCheckedNodesOfUnitLessonTree(checkedKeys) {
  const lessonNodes = checkedKeys.filter(k => k.indexOf('LESSON') > -1);

  const lessonIds = lessonNodes.map((node) => {
    const temp = node.split('-');
    const lessonId = temp[temp.length - 1];
    return parseInt(lessonId, 10);
  });

  return lessonIds;
}

export function parseToDosToLessonPlans(todos) {
  const lessonPlans = todos.reduce((intermediateLessonPlans, todo) => {
    const {
      recitalId, recitalTitle, portion, recitalBars,
    } = todo;
    const pos = intermediateLessonPlans.findIndex(lessonPlan => lessonPlan.recital === recitalId);

    // transform the todo object to suite our component data format
    // Check components LessonPlan and ToDoLessonPlan
    const activityObj = todo.lessonActivity || todo.globalActivity;
    const transformedTodo = {
      ...todo,
      lesson: { id: todo.lesson, title: todo.lessonTitle },
      activity: activityObj && { id: todo.activity, title: activityObj.title },
    };

    if (pos > -1) {
      const existingLessonPlan = intermediateLessonPlans[pos];
      const { lessons } = existingLessonPlan;
      const newLessons = [...lessons, transformedTodo];
      const newLessonPlan = { ...existingLessonPlan, lessons: newLessons };

      return [
        ...intermediateLessonPlans.slice(0, pos),
        newLessonPlan,
        ...intermediateLessonPlans.slice(pos + 1),
      ];
    }
    // form new lesson plan

    const lessons = [transformedTodo];
    const newLessonPlan = {
      id: todo.id,
      recital: recitalId,
      recitalName: recitalTitle,
      recitalBars,
      portion,
      lessons,
    };

    return [...intermediateLessonPlans, newLessonPlan];
  }, []);

  return lessonPlans;
}

// This function merges two lesson plan array into one
// Input: A -> [L1, L2, L3], B -> [L2, L4]
// Output: C -> [L1, L2, L3, L4]
// Note: The L2 in C is from A, this algo considers the first occurence of an item
export function mergeLessonArraysWithoutAnyDuplicate(arr1, arr2) {
  const idSet = new Set();
  const finalMergedArray = [];

  function traverseArray(arr) {
    arr.forEach((item) => {
      const { lesson } = item;
      const { id } = lesson;
      if (!idSet.has(id)) {
        finalMergedArray.push(item);
        idSet.add(id);
      }
    });
  }

  traverseArray(arr1);
  traverseArray(arr2);

  return finalMergedArray;
}

export const todoIsAlreadyCreated = todo => !!todo.created;

export const cleanUpFilterObj = (newFilter) => {
  const filter = {};
  const keys = _.keys(newFilter);
  keys.forEach((key) => {
    if (newFilter[key]) {
      filter[key] = newFilter[key];
    }
  });

  return filter;
};
