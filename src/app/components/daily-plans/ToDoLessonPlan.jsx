import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Icon } from 'antd';

import { TableHeader, Columns, MarkDoneColumns, RemoveOptionColumns, TableBody } from './LessonAssessmentActivityTable';
import './LessonAssessmentActivityTable.less';

const getColumns = ({ canRemoveLesson, markAsDone }) => {
  if (canRemoveLesson) return RemoveOptionColumns;

  if (markAsDone) return MarkDoneColumns;

  return Columns;
};

const ToDoLessonPlan = ({
  toDos,
  canRemoveLesson,
  markAsDone,
  removeToDo,
  toggleToDoStatus,
  isToDoChecked,
}) => {
  const columns = getColumns({ canRemoveLesson, markAsDone });
  return (
    <div className="to-do-lesson-plan lesson-assessment-activity-table">
      <TableHeader columns={columns} />
      <TableBody>
        {
          toDos.map(toDo => (
            <div className="row" key={toDo.id}>
              <div className="column" style={{ width: `${columns[0].width}%` }}>
                { toDo.lesson.title }
              </div>
              <div className="column" style={{ width: `${columns[1].width}%` }}>
                { toDo.activity && toDo.activity.title }
                { !toDo.activity && '-' }
              </div>
              <div className="column" style={{ width: `${columns[2].width}%` }}>
                { toDo.assessment }
                { !toDo.assessment && '-' }
              </div>
              {
                markAsDone ? (
                  <div
                    className="column"
                    style={{ width: `${columns[3].width}%`, cursor: 'pointer' }}
                  >
                    <Checkbox
                      checked={isToDoChecked(toDo.id)}
                      onChange={e => toggleToDoStatus(toDo.id, e.target.checked)}
                    />
                  </div>
                ) : ''
              }
              {
                canRemoveLesson ? (
                  <div
                    className="column"
                    style={{ width: `${columns[3].width}%`, cursor: 'pointer' }}
                    onClick={() => removeToDo(toDo.id)}
                    role="presentation"
                  >
                    <Icon type="delete" />
                  </div>
                ) : ''
              }
            </div>
          ))
        }
      </TableBody>
    </div>
  );
};

ToDoLessonPlan.propTypes = {
  toDos: PropTypes.arrayOf(PropTypes.shape({
    lesson: PropTypes.shape({}),
    activity: PropTypes.shape({}),
    assessment: PropTypes.string,
  })),
  canRemoveLesson: PropTypes.bool,
  markAsDone: PropTypes.bool,
  removeToDo: PropTypes.func,
  toggleToDoStatus: PropTypes.func,
  isToDoChecked: PropTypes.func,
};

ToDoLessonPlan.defaultProps = {
  toDos: [],
  canRemoveLesson: false,
  markAsDone: false,
  removeToDo: () => {},
  toggleToDoStatus: () => {},
  isToDoChecked: () => {},
};

export default ToDoLessonPlan;
