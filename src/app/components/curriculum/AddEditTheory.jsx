import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { Form, Input, Button, Select, Icon } from "antd";
import { Link } from "react-router-dom";

import { getAttachmentNameFromPath } from "../../helpers";
import routes from "../../constants/routes.json";
import "../core/CoreLayout.less";

const FormItem = Form.Item;
const { Option } = Select;

const RenderOptions = dataList =>
  dataList &&
  dataList.map(data => (
    <Option key={data.id} value={data.id}>
      {data.title}
    </Option>
  ));

class AddEditTheory extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    onSubmit: PropTypes.func,
    curriculumToEdit: PropTypes.shape({}),
    editingCurriculum: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    types: PropTypes.array
  };

  static defaultProps = {
    onSubmit: () => {},
    curriculumToEdit: null,
    editingCurriculum: false,
    resetForm: false,
    formResetted: () => {},
    types: [
      {
        id: "generic",
        title: "Generic"
      },
      {
        id: "quaver",
        title: "Quaver"
      },
      {
        id: "trinity",
        title: "Trinity"
      }
    ]
  };

  constructor(props) {
    super(props);

    const { curriculumToEdit } = props;

    this.state = {
      submittingForm: false,
      titleDisabled: true,
      alreadyAddedAttachments:
        curriculumToEdit && curriculumToEdit.attachmentDetails
          ? curriculumToEdit.attachmentDetails
          : [],
      attachmentsAdded: []
    };
  }

  componentDidMount() {
    const { editingCurriculum, curriculumToEdit } = this.props;

    if (editingCurriculum) {
      // debugger
      const { title } = curriculumToEdit;

      const { type } = curriculumToEdit.properties;

      this.props.form.setFieldsValue({
        title,
        type
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { resetForm } = nextProps;
    if (resetForm) {
      this.props.form.resetFields();
      this.props.formResetted();
    }
  }

  setTitleDisabled(flag) {
    this.setState({
      titleDisabled: flag
    });
  }

  getSubmitButtonText() {
    const { submittingForm } = this.state;
    const { editingCurriculum } = this.props;

    if (submittingForm && editingCurriculum) {
      return "Updating...";
    }

    if (submittingForm && !editingCurriculum) {
      return "Saving...";
    }

    if (editingCurriculum) {
      return "Update";
    }

    return "Save";
  }

  handleSubmit = e => {
    e.preventDefault();

    const { form, onSubmit, editingCurriculum, curriculumToEdit } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submittingForm: true
        });

        let newCurriculum = {};

        if (editingCurriculum) {
          newCurriculum = { ...curriculumToEdit };
        }

        const updatedValues = {
          ...values,
          bars: values.bars && parseInt(values.bars, 10),
          description: "",
          childType: "theory"
        };

        onSubmit({ ...newCurriculum, ...updatedValues });
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };

    const { getFieldDecorator } = this.props.form;

    const { editingCurriculum, curriculumToEdit, types } = this.props;

    const { alreadyAddedAttachments } = this.state;

    const cancelRedirectUrl = editingCurriculum
      ? `${routes.curriculums}/${curriculumToEdit.id}`
      : `${routes.curriculums}`;

    return (
      <div className="add-curriculum-container add-new-container details details-view">
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="Theory Type" {...formItemLayout}>
              {getFieldDecorator("type", {
                rules: [
                  {
                    required: true,
                    message: "Please choose a type for this Theory!"
                  }
                ]
              })(
                <Select placeholder="Select a theory type">
                  {RenderOptions(types)}
                </Select>
              )}
            </FormItem>
            <FormItem label="Theory Name" {...formItemLayout}>
              {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "Please give a title to this Theory!"
                  }
                ]
              })(
                <Input
                  className={`${this.state.titleDisabled ? "disabled" : ""}`}
                  onBlur={() => this.setTitleDisabled(true)}
                  onClick={() => this.setTitleDisabled(false)}
                  placeholder="Enter Theory Title..."
                  autoComplete="off"
                />
              )}
            </FormItem>
            <FormItem>
              <Link to={cancelRedirectUrl}>
                <Button type="default">Cancel</Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                // disabled={this.state.submittingForm}
              >
                {/* {this.getSubmitButtonText()} */}
                Save
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddEditTheory);
