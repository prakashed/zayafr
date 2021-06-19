import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Table } from 'antd';

import ViewDetailsTable from '../misc/ViewDetailsTable';
import ViewOptions from '../misc/ViewOptions';
import './BookDetails.less';
import bookTypes from '../../constants/book-types.json';

const { Panel } = Collapse;

function getColumns(bookType) {
  let columns = [];
  switch (bookType) {
    case bookTypes.definedBook:
      columns = [{
        title: 'Lessons',
        dataIndex: 'lessons',
        key: 'lessons',
        width: '200px',
      }, {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
      }];
      break;

    case bookTypes.customBook:
      columns = [{
        title: 'Lessons',
        dataIndex: 'lessons',
        key: 'lessons',
        width: '200px',
      }, {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
      }];
      break;

    case bookTypes.bookWithActivities:
      columns = [{
        title: 'Lessons',
        dataIndex: 'lessons',
        key: 'lessons',
        width: '200px',
      }, {
        title: 'Activities',
        dataIndex: 'activities',
        key: 'activities',
      }, {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
      }];
      break;

    default:
  }
  return columns;
}

function getColumnData(bookType, lessons) {
  let columnData = [];
  switch (bookType) {
    case bookTypes.definedBook:
      columnData = lessons.map((lesson) => {
        const { id, title, categoryTitle } = lesson;

        return {
          key: id,
          lessons: title,
          category: categoryTitle,
        };
      });
      break;

    case bookTypes.customBook:
      columnData = lessons.map((lesson) => {
        const { id, title, tagsDetails } = lesson;
        // const tagsText = tagsDetails.map(t => t.title).join();
        const tagsText = tagsDetails.map(t => <li key={t.id}>{t.title}</li>);

        return {
          key: id,
          lessons: title,
          tags: (<ul>{tagsText}</ul>),
        };
      });
      break;

    case bookTypes.bookWithActivities:
      columnData = lessons.map((lesson) => {
        const {
          id, title, tagsDetails, activitiesDetail,
        } = lesson;
        const tagsText = tagsDetails.map(t => <li key={t.id}>{t.title}</li>);
        const activitiesText = activitiesDetail.map(a => <li key={a.id}>{a.title}</li>);

        return {
          key: id,
          lessons: title,
          tags: (<ul>{tagsText}</ul>),
          activities: (<ul>{activitiesText}</ul>),
        };
      });
      break;

    default:
  }

  return columnData;
}

export default function BookDetails(props) {
  const { book } = props;

  const {
    title,
    instrumentDetails,
    musicalGradesDetails,
    bookUnitsDetails,
  } = book;

  const { bookType, title: instrumentName } = instrumentDetails;

  const dataTable = [
    {
      title: 'Instrument',
      value: instrumentName,
    },
    {
      title: 'Grades',
      value: (
        <ul>
          {
            musicalGradesDetails.map(grade => <li key={grade.id}>{grade.title}</li>)
          }
        </ul>
      ),
    },
  ];

  return (
    <div className="book-details-view details-view">
      <div className="book-title title">
        <h1>{ title }</h1>
        <ViewOptions entity="activity" deleteFunction={props.deleteBook} />
      </div>
      <div className="book-details details">
        <ViewDetailsTable dataTable={dataTable} />
        {
          bookUnitsDetails ? (
            <div className="units">
              <h2>Units</h2>
              <Collapse>
                {
                  bookUnitsDetails.map(unit => (
                    <Panel header={unit.title} key={unit.id}>
                      <Table
                        bordered
                        pagination={false}
                        columns={getColumns(bookType)}
                        dataSource={getColumnData(bookType, unit.lessons)}
                      />
                    </Panel>
                  ))
                }
              </Collapse>
            </div>
          ) : 'Fetching book details...'
        }
      </div>
    </div>
  );
}

BookDetails.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string,
  }),
  deleteBook: PropTypes.func,
};

BookDetails.defaultProps = {
  book: null,
  deleteBook: () => {},
};
