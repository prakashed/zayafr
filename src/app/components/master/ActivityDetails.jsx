import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AttachmentList from '../misc/AttachmentList';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import ViewOptions from '../misc/ViewOptions';
import routes from '../../constants/routes.json';

export default function ActivityDetails(props) {
  const { activity } = props;

  if (_.isNull(activity)) {
    return <p>Activity Not Found</p>;
  }

  const {
    id: activityId,
    title,
    description,
    attachmentDetails,
    url
  } = activity;

  const dataTable = [
    {
      title: 'Description',
      value: description
    },
    {
      title: 'Attachments',
      value: <AttachmentList attachments={attachmentDetails} />
    },
    {
      title: 'URL',
      value:
        url && url.length ? (
          <a href={url} target="_blank">
            {url}
          </a>
        ) : (
          'No Url Added'
        )
    }
  ];

  const editUrl = `${routes.activities}/${activityId}${routes.edit}`;

  return (
    <div className="activity-details-view details-view">
      <div className="activity-title title">
        <h1>{title}</h1>
        <ViewOptions
          entity="activity"
          editUrl={editUrl}
          deleteFunction={props.deleteActivity}
        />
      </div>
      <div className="activity-details details">
        <ViewDetailsTable dataTable={dataTable} />
      </div>
    </div>
  );
}

ActivityDetails.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    attachmentsDetails: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  deleteActivity: PropTypes.func
};

ActivityDetails.defaultProps = {
  activity: null,
  deleteActivity: () => {}
};
