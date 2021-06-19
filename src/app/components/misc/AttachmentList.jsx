import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getAttachmentNameFromPath } from '../../helpers';

export default function AttachmentList({ attachments }) {
  if (_.isNull(attachments)) return <p>Fetching Attachment Data..</p>;

  return attachments.length === 0 ? 'No Attachments' : (
    <ul>
      {
        attachments.map(attach => <li key={attach.id}><a href={attach.path} target="_blank" rel="noopener noreferrer">{ attach.name || getAttachmentNameFromPath(attach.path) }</a></li>)
      }
    </ul>
  );
}

AttachmentList.propTypes = {
  attachments: PropTypes.arrayOf(PropTypes.shape({})),
};

AttachmentList.defaultProps = {
  attachments: null,
};
