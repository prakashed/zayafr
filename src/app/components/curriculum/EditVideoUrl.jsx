import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Icon, Input, Button, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import {
  createLessonVideoAction,
  deleteLessonVideoAction
} from '../../reducers/lessons';
import { addNewLessonVideo, removeLessonVideo } from '../../apis/lessons-api';
import { getCurriculumsDetailsAction } from '../../reducers/curriculums';
import { createDetailsAction } from '../../helpers/reduxActionUtils';

// parent -> category, lesson or objective
// curriculum -> theory or recital

class EditVideoUrl extends Component {
  static propTypes = {
    videos: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    deleteVideo: PropTypes.func.isRequired,
    addVideo: PropTypes.func.isRequired,
    parent: PropTypes.string.isRequired,
    curriculum: PropTypes.string.isRequired
  };

  state = {
    newUrl: ''
  };

  handleChange = videos => {
    console.log('VIDEOS CHANGED');
    this.setState({ videos });
  };

  remove = (id, index) => {
    const { deleteVideo, curriculum } = this.props;
    // TODO:- Remove video from popup
    deleteVideo({ id, curriculum });
  };

  handleChange = event => {
    this.setState({ newUrl: event.target.value });
  };

  add = () => {
    const { newUrl } = this.state;
    const { addVideo, parent, curriculum } = this.props;
    addVideo({ url: newUrl, parent, curriculum });
    this.setState({ newUrl: '' });
  };

  deleteUrlButton = (id, index) => (
    <Icon
      className="dynamic-delete-button"
      type="minus-circle-o"
      onClick={() => this.remove(id, index)}
    />
  );

  render() {
    const { parent, videos } = this.props;
    const { newUrl } = this.state;

    return (
      <div>
        {videos.map((x, index) => {
          const { id, url } = x;
          return (
            <Row>
              <Col span={8} className="ant-form-item-label">
                Video {index + 1}: &nbsp;
              </Col>
              <Col span={12}>
                <Input
                  value={url}
                  addonAfter={this.deleteUrlButton(id, index)}
                  disabled
                />
              </Col>
            </Row>
          );
        })}
        <Row>
          <Col span={9} offset={8}>
            <input
              className="ant-input"
              placeholder="Add URL..."
              value={newUrl}
              onChange={this.handleChange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={3} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => this.add()}>
              <Icon type="save" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      addVideo: ownProps.createVideoAction,
      deleteVideo: ownProps.deleteVideoAction,
      updateDetails: createDetailsAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(EditVideoUrl);
