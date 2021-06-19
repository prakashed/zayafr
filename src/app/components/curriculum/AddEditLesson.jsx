import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import _ from "lodash";
import { Modal, Button, Form, Input, Icon } from "antd";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  createLessonAction,
  updateLessonAction,
  createLessonVideoAction,
  deleteLessonVideoAction
} from "../../reducers/lessons";
import AddVideoUrl from "./AddVideoUrl";
import EditVideoUrl from "./EditVideoUrl";
// const { Step } = Steps;

const FormItem = Form.Item;
// const { Option } = Select;

class AddEditLesson extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    onSubmit: PropTypes.func,
    lessonToEdit: PropTypes.shape({}),
    editingLesson: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    hideModal: PropTypes.func,
    addLesson: PropTypes.func,
    updateLesson: PropTypes.func,
    recitalTitle: PropTypes.string.isRequired
  };

  static defaultProps = {
    onSubmit: () => {},
    addLesson: () => {},
    updateLesson: () => {},
    lessonToEdit: null,
    editingLesson: false,
    resetForm: false,
    formResetted: () => {},
    hideModal: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      submittingForm: false,
      titleDisabled: true
    };
  }

  setTitleDisabled(flag) {
    this.setState({
      titleDisabled: flag
    });
  }

  hideAddEditLessonModal = () => {
    this.props.hideModal();
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      form,
      onSubmit,
      editingLesson,
      lessonToEdit,
      recitalId,
      instrument
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submittingForm: true
        });

        let newLesson = {};
        const urls = [];
        if (values.urls) {
          values.urls.map(url => {
            if (url && url.length > 0) {
              urls.push(url);
            }
          });
        }

        if (editingLesson) {
          newLesson = { ...lessonToEdit };
        }

        const updatedValues = {
          ...values,
          urls,
          instrument: instrument.id,
          description: "",
          recital: recitalId
        };

        if (editingLesson) {
          const { id, title } = { ...newLesson, ...updatedValues };
          this.props.updateLesson({
            id,
            title,
            instrument: instrument.id,
            recital: recitalId
          });
        } else {
          this.props.addLesson({ ...updatedValues, ...newLesson });
        }

        this.hideAddEditLessonModal();
        this.setState({
          submittingForm: false
        });
      }
    });
  };

  render() {
    const {
      recitalTitle,
      recitalId,
      instrument,
      lessonToEdit,
      editingLesson
    } = this.props;
    const instrumentName =
      instrument && instrument.title ? instrument.title : "No Instrument";

    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };

    let lessonTitle;
    let lessonId;
    let lessonVideos = [];
    if (lessonToEdit) {
      const { id, title, lessonVideosDetails } = lessonToEdit;
      lessonTitle = title;
      lessonVideos = lessonVideosDetails;
      lessonId = id;
    }

    return (
      <Modal
        title={`${recitalTitle} - ${
          editingLesson ? "Edit" : "Add"
        } Lesson for: ${instrumentName}`}
        visible={this.props.showAddLessonModal}
        onCancel={this.hideAddEditLessonModal}
        footer={null}
        destroyOnClose
        className="add-new-lesson"
        width="60%"
      >
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="Title" {...formItemLayout}>
              {getFieldDecorator("title", {
                initialValue: lessonTitle || "",
                rules: [
                  {
                    required: true,
                    message: "Please give a title for the Lesson!"
                  }
                ]
              })(
                <Input placeholder="Enter Lesson title..." autoComplete="off" />
              )}
            </FormItem>
            {/* <FormItem label="URL" {...formItemLayout}>
              {getFieldDecorator('url', {
                rules: [{ required: false }]
              })(<Input placeholder="URL" />)}
            </FormItem> */}
            {editingLesson ? (
              <EditVideoUrl
                curriculum={recitalId}
                parent={lessonId}
                videos={lessonVideos}
                createVideoAction={createLessonVideoAction}
                deleteVideoAction={deleteLessonVideoAction}
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
      addLesson: createLessonAction,
      updateLesson: updateLessonAction
    },
    dispatch
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Form.create()(AddEditLesson));
// export default AddNewLesson
