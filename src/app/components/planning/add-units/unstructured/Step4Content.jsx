import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Tag } from 'antd';

export default class Step4Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingCustomMessage: {},
    };
  }

  showCustomMessage = (property) => {
    const oldAddingCustomMessage = this.state.addingCustomMessage;
    oldAddingCustomMessage[property] = true;
    this.setState({
      addingCustomMessage: oldAddingCustomMessage,
    });
  }

  renderPieces = pieces => (
    _.values(pieces).map((piece) => {
      const {
        title,
      } = piece;
      // const tagsTitle = tags.map(tag => tag.title);
      return <li key={piece.id}>{title}</li>;
    })
  )

  render() {
    const {
      category, pieces, unitName,
    } = this.props;

    return (
      <div className="step-content review step-4">
        <p>Review the following -</p>
        <div className="section title">
          <span>Unit Name</span>
          <p>{ unitName }</p>
        </div>
        <div className="section category">
          <span>Category</span>
          <Tag color="red">{ category.title }</Tag>
        </div>
        <div className="review-section-container">
          <div className="review-section">
            <div className="section-title">Lessons</div>
            <ul>
              { this.renderPieces(pieces) }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Step4Content.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  unitName: PropTypes.string,
  pieces: PropTypes.shape({}).isRequired,
};

Step4Content.defaultProps = {
  unitName: 'Default Unit Name',
};
