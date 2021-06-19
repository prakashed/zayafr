import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { Form, Input, Button, Select, Icon } from "antd";
import { Link } from "react-router-dom";

import { getAttachmentNameFromPath } from "../../helpers";
import routes from "../../constants/routes.json";
import "../core/CoreLayout.less";
import UploadAttachment from "../misc/UploadAttachment";

const FormItem = Form.Item;
const { Option } = Select;

const RenderOptions = dataList =>
  dataList &&
  dataList.map(data => (
    <Option key={data.id} value={data.id}>
      {data.title}
    </Option>
  ));

class AddEditRecital extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    onSubmit: PropTypes.func,
    instruments: ImmutablePropTypes.list,
    musicalGrades: ImmutablePropTypes.list,
    recitalToEdit: PropTypes.shape({}),
    editingRecital: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func
  };

  static defaultProps = {
    onSubmit: () => {},
    instruments: null,
    musicalGrades: null,
    recitalToEdit: null,
    editingRecital: false,
    resetForm: false,
    formResetted: () => {}
  };

  constructor(props) {
    super(props);

    const { recitalToEdit } = props;

    this.state = {
      submittingForm: false,
      titleDisabled: true,
      alreadyAddedAttachments:
        recitalToEdit && recitalToEdit.attachmentDetails
          ? recitalToEdit.attachmentDetails
          : [],
      attachmentsAdded: []
    };
  }

  componentDidMount() {
    const { editingRecital, recitalToEdit } = this.props;

    if (editingRecital) {
      const { title, instruments, musicalGrade, bars, url } = recitalToEdit;

      this.props.form.setFieldsValue({
        title,
        instruments,
        musicalGrade,
        bars,
        url
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
    const { editingRecital } = this.props;

    if (submittingForm && editingRecital) {
      return "Updating...";
    }

    if (submittingForm && !editingRecital) {
      return "Saving...";
    }

    if (editingRecital) {
      return "Update";
    }

    return "Save";
  }

  handleSubmit = e => {
    e.preventDefault();

    const { form, onSubmit, editingRecital, recitalToEdit } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submittingForm: true
        });

        const { attachmentsAdded, alreadyAddedAttachments } = this.state;

        let newRecital = {};

        if (editingRecital) {
          newRecital = { ...recitalToEdit };
        }

        const updatedValues = {
          ...values,
          bars: values.bars && parseInt(values.bars, 10),
          description: "",
          attachments: [
            ...attachmentsAdded.map(a => a.id),
            ...alreadyAddedAttachments.map(a => a.id)
          ]
        };

        onSubmit({ ...newRecital, ...updatedValues });
      }
    });
  };

  attachmentUploaded = uploadedAttachment => {
    const { attachmentsAdded } = this.state;

    this.setState({
      attachmentsAdded: [...attachmentsAdded, uploadedAttachment]
    });
  };

  attachmentRemoved = attachmentRemoved => {
    const { attachmentsAdded } = this.state;
    const { uid } = attachmentRemoved;
    const pos = attachmentsAdded.findIndex(a => a.uid === uid);
    const updatedAttachment = [
      ...attachmentsAdded.slice(0, pos),
      ...attachmentsAdded.slice(pos + 1)
    ];

    if (pos > -1) {
      this.setState({
        attachmentsAdded: updatedAttachment
      });
    }
  };

  removeExistingAttachment = attach => {
    const { alreadyAddedAttachments } = this.state;
    const attachPos = alreadyAddedAttachments.findIndex(
      a => a.id === attach.id
    );
    if (attachPos > -1) {
      const afterRemoving = [
        ...alreadyAddedAttachments.slice(0, attachPos),
        ...alreadyAddedAttachments.slice(attachPos + 1)
      ];

      this.setState({
        alreadyAddedAttachments: afterRemoving
      });
    }
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };

    const { getFieldDecorator } = this.props.form;

    const {
      instruments,
      musicalGrades,
      editingRecital,
      recitalToEdit
    } = this.props;

    const { alreadyAddedAttachments } = this.state;

    const cancelRedirectUrl = editingRecital
      ? `${routes.recitals}/${recitalToEdit.id}`
      : `${routes.recitals}`;

    return (
      <div className="add-recital-container add-new-container details details-view">
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "Please give a title for Recital!"
                  }
                ]
              })(
                <Input
                  className={`title-input ${
                    this.state.titleDisabled ? "disabled" : ""
                  }`}
                  onBlur={() => this.setTitleDisabled(true)}
                  onClick={() => this.setTitleDisabled(false)}
                  placeholder="Enter Recital Name..."
                  autoComplete="off"
                />
              )}
            </FormItem>
            <FormItem label="Instrument" {...formItemLayout}>
              {getFieldDecorator("instruments", {
                rules: [
                  { required: true, message: "Select atleast one instrument!" }
                ]
              })(
                <Select mode="multiple" placeholder="Select an instrument">
                  {RenderOptions(instruments)}
                </Select>
              )}
            </FormItem>
            <FormItem label="Suggested Grade" {...formItemLayout}>
              {getFieldDecorator("musicalGrade", {
                rules: [
                  {
                    required: true,
                    message: "Please give the grade for Recital!"
                  }
                ]
              })(
                <Select placeholder="Select a grade">
                  {RenderOptions(musicalGrades)}
                </Select>
              )}
            </FormItem>
            <FormItem label="URL" {...formItemLayout}>
              {getFieldDecorator("url", {
                rules: [{ required: false }]
              })(<Input placeholder="URL" />)}
            </FormItem>
            {editingRecital && alreadyAddedAttachments.length ? (
              <div style={{ display: "flex" }}>
                <div style={{ fontWeight: "bold" }}>Existing Attachments</div>
                <ul style={{ listStyle: "none" }}>
                  {alreadyAddedAttachments.map(attach => (
                    <li style={{ marginBottom: "5px" }} key={attach.id}>
                      <Icon style={{ marginRight: "12px" }} type="paper-clip" />
                      {attach.name || getAttachmentNameFromPath(attach.path)}
                      <Icon
                        title="Remove Attachment"
                        style={{ cursor: "pointer", marginLeft: "18px" }}
                        onClick={() => this.removeExistingAttachment(attach)}
                        type="close-circle-o"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
            <FormItem
              label={editingRecital ? "Add New Attachments" : "Attachments"}
              {...formItemLayout}
            >
              {getFieldDecorator("attachments", {
                rules: [{ required: false }]
              })(
                <UploadAttachment
                  multiple
                  uploadType="recital"
                  afterUpload={res => this.attachmentUploaded(res)}
                  onRemove={this.attachmentRemoved}
                />
              )}
            </FormItem>
            <FormItem label="Bar" {...formItemLayout}>
              {getFieldDecorator("bars", {
                rules: [
                  {
                    required: true,
                    message: "Please give a count of Bars in the Recital"
                  }
                ]
              })(
                <Input
                  placeholder="Number of Bars in the Recital"
                  type="number"
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
                disabled={this.state.submittingForm}
              >
                {this.getSubmitButtonText()}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddEditRecital);
