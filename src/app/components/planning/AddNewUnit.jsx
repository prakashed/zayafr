import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

class AddNewUnit extends Component {
  static propTypes = {
    addNewUnit: PropTypes.func.isRequired,
    annualPlanId: PropTypes.string.isRequired,
  }

  onClickAddNew = () => {
    const { addNewUnit, annualPlanId } = this.props;
    addNewUnit({ title: 'New Unit', annual_plan: annualPlanId });
  }

  render() {
    return (
      <div
        className="lesson-plan-item add-new-index"
        onClick={this.onClickAddNew}
        role="presentation"
      >
        <Icon type="plus" />
        <span>&nbsp;&nbsp;Add New Unit</span>
      </div>
    );
  }
}

export default AddNewUnit;

