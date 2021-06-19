import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon, Tree, Tooltip } from 'antd';

import AttachmentList from '../misc/AttachmentList';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import ViewOptions from '../misc/ViewOptions';
import routes from '../../constants/routes.json';
import './RecitalDetails.less';

const { TreeNode, DirectoryTree } = Tree;

const instrumentIdNodeIdentifier = 'instrumentId#';

function InstrumentLessonTree({ instrumentLessons, addNewLesson }) {
  function treeNodeSelected(node) {
    if (node && node.length) {
      const lastNodeSelected = node[node.length - 1];
      if (lastNodeSelected.indexOf(instrumentIdNodeIdentifier) > -1) {
        const instrumentId = lastNodeSelected.slice(instrumentIdNodeIdentifier.length);
        const instrument = instrumentLessons.find(i => i.id === parseInt(instrumentId, 10));
        addNewLesson(instrument);
      }
    }
  }

  return (
    <DirectoryTree showIcon className="instrument-lesson-tree" onSelect={treeNodeSelected}>
      {
        instrumentLessons.map(instrument => (
          <TreeNode icon selectable={false} title={instrument.title} key={`${instrument.id}-${instrument.type}`} dataRef={instrument}>
            {
              instrument.units.map(unit => (
                <TreeNode icon selectable={false} title={unit.title} key={`${instrument.id}-${unit.id}-${unit.type}`} dataRef={unit}>
                  {
                    unit.categories.map(category => (
                      <TreeNode icon selectable={false} className="category" title={category.title} key={`${instrument.id}-${unit.id}-${category.id}-${category.type}`} dataRef={category}>
                        {
                          category.lessons.map(lesson => (
                            <TreeNode icon {...lesson} selectable={false} title={<Tooltip placement="rightTop" title={`Book: ${lesson.bookName}`}>{lesson.title}</Tooltip>} className="lesson" key={`${instrument.id}-${unit.id}-${lesson.id}-${lesson.id}-${lesson.type}`} />
                          ))
                        }
                      </TreeNode>
                    ))
                  }
                </TreeNode>
              ))
            }
            <TreeNode className="add-new-lesson" key={`${instrumentIdNodeIdentifier}${instrument.id}`} title="Add New Lesson" icon={<Icon type="plus-circle-o" />} />
          </TreeNode>
        ))
      }
    </DirectoryTree>
  );
}

InstrumentLessonTree.propTypes = {
  instrumentLessons: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  addNewLesson: PropTypes.func,
};

InstrumentLessonTree.defaultProps = {
  addNewLesson: () => {},
};

function parseRecitalUnits(recitalUnits) {
  return recitalUnits.map((recital) => {
    const { id, title, unitDetails } = recital;

    const units = unitDetails.map((u, index) => {
      const { title: unitTitle, categories } = u;

      const parsedCategories = categories.map((c, categoryIndex) => {
        const lessons = c.lessons.map(l => (
          {
            ...l,
            type: 'lesson',
          }
        ));

        return {
          ...c,
          id: categoryIndex,
          type: 'category',
          title: c.title,
          lessons,
        };
      });

      return {
        ...u,
        id: index,
        title: unitTitle,
        type: 'unit',
        categories: parsedCategories,
      };
    });

    return {
      ...recital,
      id,
      title,
      type: 'instrumentRecital',
      units,
    };
  });
}

export default function RecitalDetails(props) {
  const { recital, showAddNewLesson } = props;

  if (_.isNull(recital)) {
    return (
      <p>Recital not found</p>
    );
  }

  const {
    id: recitalId,
    title,
    bars,
    recitalUnits,
    attachmentDetails,
    url,
    musicalGradeTitle,
  } = recital;

  const dataTable = [
    {
      title: 'Suggested Grade',
      value: musicalGradeTitle,
    },
    {
      title: 'URL',
      value: (
        url && url.length ? <a href={url} target="_blank">{url}</a> : 'No Url Added'
      ),
    },
    {
      title: 'Bars',
      value: bars || 'No Bars',
    },
    {
      title: 'Attachments',
      value: (<AttachmentList attachments={attachmentDetails} />),
    },
  ];

  const editUrl = `${routes.recitals}/${recitalId}${routes.edit}`;

  return (
    <div className="recital-details-view details-view">
      <div className="recital-title title">
        <h1>{ title }</h1>
        <ViewOptions entity="recital" editUrl={editUrl} deleteFunction={props.deleteRecital} />
      </div>
      <div className="activity-details details">
        <ViewDetailsTable dataTable={dataTable} />
      </div>
      {
        recitalUnits ? <InstrumentLessonTree
          instrumentLessons={parseRecitalUnits(recitalUnits)}
          addNewLesson={instrument => showAddNewLesson(instrument)}
        /> : 'Fetching Recital Data..'
      }
    </div>
  );
}

RecitalDetails.propTypes = {
  recital: PropTypes.shape({}),
  showAddNewLesson: PropTypes.func,
  deleteRecital: PropTypes.func,
};

RecitalDetails.defaultProps = {
  recital: null,
  showAddNewLesson: () => {},
  deleteRecital: () => {},
};
