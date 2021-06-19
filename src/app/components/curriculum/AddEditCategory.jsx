import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import _ from "lodash";
import { debounce } from "lodash";
import { Modal, Button, Form, Input, Select } from "antd";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  createCategoryAction,
  updateCategoryAction,
  createCategoryVideoAction,
  deleteCategoryVideoAction
} from "../../reducers/categories";

import { searchActivities } from "../../apis/master-api";
import AddVideoUrl from "./AddVideoUrl";
import EditVideoUrl from "./EditVideoUrl";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select;

class AddEditCategory extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    onSubmit: PropTypes.func,
    categoryToEdit: PropTypes.shape({}),
    editingCategory: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    hideModal: PropTypes.func,
    addCategory: PropTypes.func,
    updateCategory: PropTypes.func,
    theoryTitle: PropTypes.string.isRequired
  };

  static defaultProps = {
    onSubmit: () => {},
    addCategory: () => {},
    updateCategory: () => {},
    categoryToEdit: null,
    editingCategory: false,
    resetForm: false,
    formResetted: () => {},
    hideModal: () => {}
  };

  constructor(props) {
    super(props);

    this.searchForActivities = debounce(this.searchForActivities, 750);

    this.state = {
      submittingForm: false,
      titleDisabled: true,
      activities: []
    };
  }

  componentWillMount() {
    if (this.props.editingCategory) {
      this.setState({
        activities: this.props.categoryToEdit.activitiesDetails
      });
    }
  }

  hideAddEditCategoryModal = () => {
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
      editingCategory,
      categoryToEdit,
      theoryId
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submittingForm: true
        });

        let newCategory = {};

        const urls = [];
        if (values.urls) {
          values.urls.map(url => {
            if (url && url.length > 0) {
              urls.push(url);
            }
          });
        }

        if (editingCategory) {
          newCategory = { ...categoryToEdit };
        }

        const updatedValues = {
          ...values,
          urls,
          theory: theoryId
        };

        if (editingCategory) {
          const { id } = categoryToEdit;
          const { title, learningOutcome, assessment, activities } = {
            ...updatedValues
          };
          this.props.updateCategory({
            id,
            title,
            learningOutcome,
            assessment,
            activities,
            theory: theoryId
          });
        } else {
          this.props.addCategory({ ...updatedValues });
        }

        this.hideAddEditCategoryModal();
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
    const {
      theoryTitle,
      theoryId,
      categoryToEdit,
      editingCategory
    } = this.props;

    var { activities, searchingActivities } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };

    let categoryTitle;
    let categoryId;
    let categoryLearningOutcome;
    let categoryAssessment;
    let categoryVideos = [];
    let categoryActivities = [];

    if (categoryToEdit) {
      const {
        id,
        title,
        learningOutcome,
        assessment,
        activitiesDetails,
        categoryVideosDetails
      } = categoryToEdit;

      categoryTitle = title;
      categoryVideos = categoryVideosDetails;
      categoryId = id;
      categoryLearningOutcome = learningOutcome;
      categoryAssessment = assessment;
      categoryActivities = activitiesDetails;
    }

    return (
      <Modal
        title={`${theoryTitle} - ${editingCategory ? "Edit" : "Add"}`}
        visible={this.props.showAddCategoryModal}
        onCancel={this.hideAddEditCategoryModal}
        footer={null}
        destroyOnClose
        className="add-new-category"
        width="60%"
      >
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="Title" {...formItemLayout}>
              {getFieldDecorator("title", {
                initialValue: categoryTitle || "",
                rules: [
                  {
                    required: true,
                    message: "Please give a title for the Category!"
                  }
                ]
              })(
                <Input
                  placeholder="Enter Category title..."
                  autoComplete="off"
                />
              )}
            </FormItem>
            <FormItem label="Learning Outcome" {...formItemLayout}>
              {getFieldDecorator("learningOutcome", {
                initialValue: categoryLearningOutcome || "",
                rules: [
                  {
                    required: true,
                    message: "Please provide learning outcome."
                  }
                ]
              })(<TextArea placeholder="Learning outcome" type="text" />)}
            </FormItem>
            <FormItem label="Assessment" {...formItemLayout}>
              {getFieldDecorator("assessment", {
                initialValue: categoryAssessment || "",
                rules: [
                  {
                    required: true,
                    message: "Please provide Assessment."
                  }
                ]
              })(<TextArea placeholder="Assessment" type="text" />)}
            </FormItem>
            {editingCategory ? (
              <FormItem label="Activities" {...formItemLayout}>
                {getFieldDecorator("activities", {
                  rules: [{ required: false, type: "array" }],
                  initialValue: categoryToEdit.activities || []
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
                  rules: [{ required: false, type: "array" }]
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
            {editingCategory ? (
              <EditVideoUrl
                curriculum={theoryId}
                parent={categoryId}
                videos={categoryVideos}
                createVideoAction={createCategoryVideoAction}
                deleteVideoAction={deleteCategoryVideoAction}
              />
            ) : (
              <AddVideoUrl form={this.props.form} />
            )}

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: "right" }}
                disabled={this.state.submittingForm}
              >
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
      addCategory: createCategoryAction,
      updateCategory: updateCategoryAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Form.create()(AddEditCategory));
// export default AddNewCategory
