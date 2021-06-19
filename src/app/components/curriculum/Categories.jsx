import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon, Tree, Tooltip, Collapse, Button } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPlayer from 'react-player';

import AttachmentList from '../misc/AttachmentList';
import ViewDetailsTable from '../misc/ViewDetailsTable';
import ViewOptions from '../misc/ViewOptions';
import routes from '../../constants/routes.json';
import Activities from './Acivities';
import './RecitalDetails.less';
import './CurriculumCommon.less';
import { deleteCategoryAction } from '../../reducers/categories';
import { getCurriculumsDetailsAction } from '../../reducers/curriculums';
import Can from '../permissions/Can';
import permissionConfig from '../../constants/permission-config.json';

const { entity: permissionEntity } = permissionConfig;
const { action: permissionAction } = permissionConfig;
const Panel = Collapse.Panel;

class Categories extends Component {
  constructor(props) {
    super(props);
  }

  deleteCategory(categoryId, theoryId) {
    this.props.deleteCategory({ id: categoryId, theory: theoryId });
  }

  getExtra(category) {
    return (
      <div>
        <Can I={permissionAction.add} a={permissionEntity.curriculum}>
          <Icon
            type="edit"
            onClick={event => {
              event.stopPropagation();
              this.props.showAddEditCategory(category);
            }}
          />
          <Icon
            type="delete"
            onClick={event => {
              event.stopPropagation();
              this.deleteCategory(category.id, category.theory);
            }}
          />
        </Can>
      </div>
    );
  }

  render() {
    const { categoriesDetails } = this.props;

    if (_.isEmpty(categoriesDetails)) {
      return <p>No categories added yet.</p>;
    }

    return (
      <Collapse accordion>
        {categoriesDetails.map(category => (
          <Panel
            key={category.id}
            header={category.title}
            extra={this.getExtra(category)}
          >
            <div className="theory-details">
              <b>Title:</b> {category.title}
            </div>
            <div className="theory-details">
              <b>Learning Outcome:</b> {category.learningOutcome}
            </div>
            <div className="theory-details">
              <b>Assessment:</b> {category.assessment}
            </div>
            <div className="theory-details">
              <b>Activities: </b>
              <Activities activitiesDetails={category.activitiesDetails} />
            </div>

            <div className="theory-details">
              <b>Category Videos: </b>
              {category.categoryVideosDetails.length ? (
                category.categoryVideosDetails.map(video => (
                  <div key={video.id}>
                    <ReactPlayer
                      pip
                      width="100%"
                      height="300px"
                      url={video.url}
                    />
                    <br />
                  </div>
                ))
              ) : (
                <span>No videos added.</span>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>
    );
  }
}

Categories.defaultProps = {
  categoriesDetails: null
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deleteCategory: deleteCategoryAction,
      getCurriculumDetails: getCurriculumsDetailsAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Categories);
