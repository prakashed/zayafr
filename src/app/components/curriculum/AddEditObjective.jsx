import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { debounce } from "lodash";
import { Modal, Button, Form, Input, InputNumber, Select } from "antd";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  createObjectiveAction,
  updateObjectiveAction,
  createObjectiveVideoAction,
  deleteObjectiveVideoAction
} from "../../reducers/objectives";

import { searchActivities } from "../../apis/master-api";

import AddVideoUrl from "./AddVideoUrl";
import EditVideoUrl from "./EditVideoUrl";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select;

class AddEditObjective extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    onSubmit: PropTypes.func,
    objectiveToEdit: PropTypes.shape({}),
    lesson: PropTypes.shape({}),
    editingObjective: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    hideModal: PropTypes.func,
    addObjective: PropTypes.func,
    updateObjective: PropTypes.func
  };

  static defaultProps = {
    onSubmit: () => {},
    addObjective: () => {},
    updateObjective: () => {},
    objectiveToEdit: null,
    lesson: null,
    editingObjective: false,
    resetForm: false,
    formResetted: () => {},
    hideModal: () => {}
  };

  constructor(props) {
    super(props);
    this.searchForActivities = debounce(this.searchForActivities, 750);
  }

  componentWillMount() {
    if (this.props.editingObjective) {
      this.setState({
        activities: this.props.objectiveToEdit.activitiesDetails
      });
    }
  }

  state = {
    submittingForm: false,
    titleDisabled: true,
    searchingActivities: false,
    activities: []
  };

  hideAddEditObjectiveModal = () => {
    this.props.hideModal();
  };

  setTitleDisabled(flag) {
    this.setState({
      titleDisabled: flag
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const {
      form,
      onSubmit,
      editingObjective,
      objectiveToEdit,
      recitalId,
      lesson
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submittingForm: true
        });

        const urls = [];
        if (values.urls) {
          values.urls.map(url => {
            if (url && url.length > 0) {
              urls.push(url);
            }
          });
        }

        const updatedValues = {
          ...values,
          urls,
          lesson: lesson.id,
          description: ""
        };

        if (editingObjective) {
          const { id } = objectiveToEdit;
          const {
            title,
            order,
            reference,
            class_flow,
            duration_in_minutes,
            activities
          } = {
            ...updatedValues
          };
          this.props.updateObjective({
            id,
            title,
            order,
            reference,
            class_flow,
            activities,
            duration_in_minutes,
            lesson: lesson.id,
            recital: recitalId
          });
        } else {
          this.props.addObjective({ ...updatedValues });
        }

        this.hideAddEditObjectiveModal();
        this.setState({
          submittingForm: false
        });
      }
    });
  };

  searchForActivities = value => {
    this.setState({
      activities: [],
      searchingActivities: true
    });

    searchActivities({ search: value }).then(response => {
      const { results } = response;
      this.setState({
        activities: results,
        searchingActivities: false
      });
    });
  };

  render() {
    const { lesson, objectiveToEdit, editingObjective, recitalId } = this.props;

    const { activities, searchingActivities } = this.state;
    const { getFieldDecorator } = this.props.form;

    let objectiveId;
    let objectiveVideos = [];

    if (objectiveToEdit) {
      const { id, objectiveVideosDetails } = objectiveToEdit;
      objectiveVideos = objectiveVideosDetails;
      objectiveId = id;
    }

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };

    return (
      <Modal
        title="Add Objective for Lesson"
        visible={this.props.showAddObjectiveModal}
        onCancel={this.hideAddEditObjectiveModal}
        footer={null}
        destroyOnClose
        className="add-new-objective"
        width="60%"
      >
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="Title" {...formItemLayout}>
              {getFieldDecorator("title", {
                initialValue: (objectiveToEdit && objectiveToEdit.title) || "",
                rules: [
                  {
                    required: true,
                    message: "Please give a title for the Objective."
                  }
                ]
              })(
                <Input
                  placeholder="Enter Objective title..."
                  autoComplete="off"
                />
              )}
            </FormItem>
            <FormItem label="Order" {...formItemLayout}>
              {getFieldDecorator("order", {
                initialValue:
                  (objectiveToEdit && parseInt(objectiveToEdit.order)) || "",
                rules: [
                  {
                    required: true,
                    message: "Please provide an order for this objective.",
                    max: 100,
                    min: 1,
                    type: "number"
                  }
                ]
              })(
                <InputNumber placeholder="Order in which the objectives are to be taught" />
              )}
            </FormItem>
            <FormItem label="Minutes" {...formItemLayout}>
              {getFieldDecorator("duration_in_minutes", {
                initialValue:
                  (objectiveToEdit &&
                    parseInt(objectiveToEdit.durationInMinutes)) ||
                  "",
                rules: [
                  {
                    required: true,
                    message: "Please provide duration in minutes. (Max: 120)",
                    max: 120,
                    min: 1,
                    type: "number"
                  }
                ]
              })(
                <InputNumber placeholder="Total minutes for this sessions. (Max: 120)" />
              )}
            </FormItem>

            <FormItem label="Class flow" {...formItemLayout}>
              {getFieldDecorator("class_flow", {
                initialValue:
                  (objectiveToEdit && objectiveToEdit.classFlow) || "",
                rules: [
                  {
                    required: true,
                    message: "Please provide class flow."
                  }
                ]
              })(
                <TextArea
                  placeholder="Please provide class flow."
                  type="text"
                />
              )}
            </FormItem>
            <FormItem label="Reference" {...formItemLayout}>
              {getFieldDecorator("reference", {
                initialValue:
                  (objectiveToEdit && objectiveToEdit.reference) || "",
                rules: [{ required: false }]
              })(<Input placeholder="Reference" />)}
            </FormItem>

            {editingObjective ? (
              <FormItem label="Activities" {...formItemLayout}>
                {getFieldDecorator("activities", {
                  initialValue: objectiveToEdit.activities || [],
                  rules: [{ required: false }]
                })(
                  <Select
                    mode="multiple"
                    placeholder="Add Activities"
                    notFoundContent={
                      searchingActivities
                        ? "Searching"
                        : "No Such Activity Found."
                    }
                    filterOption={false}
                    onSearch={value => this.searchForActivities(value)}
                    style={{ width: "100%" }}
                  >
                    {activities.map(activity => (
                      <Option key={activity.id} value={activity.id}>
                        {activity.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            ) : (
              <FormItem label="Activities" {...formItemLayout}>
                {getFieldDecorator("activities", {
                  rules: [{ required: false }]
                })(
                  <Select
                    mode="multiple"
                    placeholder="Add Activities"
                    notFoundContent={
                      searchingActivities
                        ? "Searching"
                        : "No Such Activity Found."
                    }
                    filterOption={false}
                    onSearch={value => this.searchForActivities(value)}
                    style={{ width: "100%" }}
                  >
                    {activities.map(activity => (
                      <Option key={activity.id} value={activity.id}>
                        {activity.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}

            {editingObjective ? (
              <EditVideoUrl
                curriculum={recitalId}
                parent={objectiveId}
                videos={objectiveVideos}
                createVideoAction={createObjectiveVideoAction}
                deleteVideoAction={deleteObjectiveVideoAction}
              />
            ) : (
              <AddVideoUrl form={this.props.form} />
            )}
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.state.submittingForm}
                style={{ float: "right" }}
              >
                {/* {this.getSubmitButtonText()} */}
                Save
              </Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addObjective: createObjectiveAction,
      updateObjective: updateObjectiveAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Form.create()(AddEditObjective));
// export default AddNewObjective
