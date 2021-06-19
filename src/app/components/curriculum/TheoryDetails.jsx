import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon, Tree, Tooltip, Collapse, Button } from 'antd';

import AttachmentList from '../misc/AttachmentList';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import ViewOptions from '../misc/ViewOptions';
import routes from '../../constants/routes.json';
import Activities from './Acivities';
import Categories from './Categories';
import './RecitalDetails.less';
import './CurriculumCommon.less';
import Can from '../permissions/Can';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity } = permissionConfig;
const { action: permissionAction } = permissionConfig;
const Panel = Collapse.Panel;

export default function TheoryDetails(props) {
  const { curriculum, showAddEditCategory } = props;

  if (_.isNull(curriculum)) {
    return <p>Not found</p>;
  }

  const { id: curriculumId, title, createdByName } = curriculum;

  const { categoriesDetails, type, categoryCount } = curriculum.properties;

  const dataTable = [
    {
      title: 'Type',
      value: _.capitalize(type)
    },
    {
      title: 'Created by',
      value: createdByName
    },
    {
      title: 'No. of categories',
      value: categoryCount
    },
    {
      title: 'Categories:',
      value: ''
    }
  ];

  const editUrl = `${routes.curriculums}/${curriculumId}${routes.edit_theory}`;

  return (
    <div className="recital-details-view details-view">
      <div className="recital-title title">
        <h1>{title}</h1>
        <ViewOptions
          entity="curriculum"
          editUrl={editUrl}
          deleteFunction={props.deleteCurriculum}
        />
      </div>
      <div className="activity-details details">
        <ViewDetailsTable dataTable={dataTable} />
      </div>

      <Can I={permissionAction.add} a={permissionEntity.curriculum}>
        <Button
          type="secondary"
          icon="plus-circle-o"
          size="small"
          onClick={() => showAddEditCategory()}
        >
          Add Category
        </Button>
        <br />
        <br />
      </Can>
      <Categories
        categoriesDetails={categoriesDetails}
        showAddEditCategory={category => showAddEditCategory(category)}
      />
      {/* </Card> */}
    </div>
  );
}

TheoryDetails.propTypes = {
  curriculum: PropTypes.shape({}),
  showAddEditCategory: PropTypes.func,
  deleteCurriculum: PropTypes.func
};

TheoryDetails.defaultProps = {
  curriculum: null,
  showAddEditCategory: () => {},
  deleteCurriculum: () => {}
};
