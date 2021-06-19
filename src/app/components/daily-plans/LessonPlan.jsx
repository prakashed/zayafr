import React from 'react';
import PropTypes from 'prop-types';
import ToDoLessonPlan from './ToDoLessonPlan';

import './LessonPlan.less';

const LessonPlan = ({
  lessonPlan, removeToDo, toggleToDoStatus, ...props
}) => {
  const { lessons, recitalName, id } = lessonPlan;
  return (
    <div className="lesson-plan">
      <div className="heading">
        <div className="recital-name">{ recitalName }</div>
      </div>
      <ToDoLessonPlan
        toDos={lessons}
        {...props}
        removeToDo={toDoId => removeToDo({ toDoId, lessonPlanId: id })}
        toggleToDoStatus={toDoId => toggleToDoStatus({ toDoId, lessonPlanId: id })}
      />
    </div>
  );
};

LessonPlan.propTypes = {
  lessonPlan: PropTypes.shape({
    recitalName: PropTypes.string,
    lessons: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  removeToDo: PropTypes.func,
  toggleToDoStatus: PropTypes.func,
};

LessonPlan.defaultProps = {
  removeToDo: () => {},
  toggleToDoStatus: () => {},
};

export default LessonPlan;
