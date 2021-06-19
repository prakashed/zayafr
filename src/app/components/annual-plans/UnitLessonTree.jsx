import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Tree } from 'antd';

const { TreeNode, DirectoryTree } = Tree;

export default function UnitLessonTree({
  units,
  addingLesson,
  onCheck,
  preSelectedLessons,
  disabledLessons,
}) {
  if (_.isNull(units) || units.length === 0) {
    return (<p style={{ marginTop: 12, marginBottom: 12 }}>No Units added in the Recital</p>);
  }

  const checkedLessons = preSelectedLessons.map(lessonId => `LESSON-${lessonId}`);
  const disabledLessonIds = new Set(disabledLessons);

  const disabledUnitIds = new Set();
  const disabledCategoryIds = new Set();

  units.forEach((unit) => {
    const { categories } = unit;
    let noOfDisabledCategories = 0;
    const noOfCategories = categories.length;

    categories.forEach((category) => {
      const { lessons } = category;
      const noOfLessons = lessons.length;
      const disabledLessonsArr = lessons.filter(l => disabledLessonIds.has(l.id));
      const noOfDisabledLessons = disabledLessonsArr.length;
      if (noOfLessons === noOfDisabledLessons) {
        // mark category as disabled
        disabledCategoryIds.add(`UNIT-${unit.id}-CATEGORY-${category.title}`);
        noOfDisabledCategories += 1;
      }
    });

    if (noOfCategories === noOfDisabledCategories) {
      // mark unit as disabled
      disabledUnitIds.add(unit.id);
    }
  });

  return (
    <DirectoryTree
      checkable={addingLesson}
      showIcon
      className="unit-lesson-tree"
      onCheck={onCheck}
      defaultCheckedKeys={checkedLessons}
    >
      {
        units.map(unit => (
          <TreeNode icon selectable={false} title={unit.title} disabled={disabledUnitIds.has(unit.id)} key={`UNIT-${unit.id}`} dataRef={unit}>
            {
              unit.categories.map(category => (
                <TreeNode icon selectable={false} className="category" title={category.title} disabled={disabledCategoryIds.has(`UNIT-${unit.id}-CATEGORY-${category.title}`)} key={`UNIT-${unit.id}-CATEGORY-${category.title}`} dataRef={category}>
                  {
                    category.lessons.map(lesson => (
                      <TreeNode icon {...lesson} selectable={false} title={lesson.title} disabled={disabledLessonIds.has(lesson.id)} className="lesson" key={`LESSON-${lesson.id}`} />
                    ))
                  }
                </TreeNode>
              ))
            }
          </TreeNode>
        ))
      }
    </DirectoryTree>
  );
}

UnitLessonTree.propTypes = {
  units: PropTypes.arrayOf(PropTypes.shape({})),
  addingLesson: PropTypes.bool,
  onCheck: PropTypes.func,
  preSelectedLessons: PropTypes.arrayOf(PropTypes.number),
  disabledLessons: PropTypes.arrayOf(PropTypes.number),
};

UnitLessonTree.defaultProps = {
  units: null,
  addingLesson: false,
  onCheck: () => {},
  preSelectedLessons: [],
  disabledLessons: [],
};
