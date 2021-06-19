import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';

import UploadAttachment from '../misc/UploadAttachment';
import { getAttachmentNameFromPath } from '../../helpers';
import routes from '../../constants/routes.json';

const FormItem = Form.Item;
const { TextArea } = Input;

class AddActivity extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    onSubmit: PropTypes.func,
    entityToEdit: PropTypes.shape({}),
    editing: PropTypes.bool,
    setSubmitFormStatus: PropTypes.func,
    getSubmitButtonText: PropTypes.func,
    submittingForm: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func
  };

  static defaultProps = {
    onSubmit: () => {},
    entityToEdit: null,
    editing: false,
    setSubmitFormStatus: () => {},
    getSubmitButtonText: () => {},
    submittingForm: false,
    resetForm: false,
    formResetted: () => {}
  };

  constructor(props) {
    super(props);

    const { entityToEdit } = props;

    this.state = {
      titleDisabled: true,
      alreadyAddedAttachments:
        entityToEdit && entityToEdit.attachmentDetails
          ? entityToEdit.attachmentDetails
          : [],
      attachmentsAdded: []
    };
  }

  getInitialState = () => {
    const { entityToEdit } = this.props;

    return {
      titleDisabled: true,
      alreadyAddedAttachments:
        entityToEdit && entityToEdit.attachmentDetails
          ? entityToEdit.attachmentDetails
          : [],
      attachmentsAdded: []
    };
  };

  componentDidMount() {
    const { editing, entityToEdit } = this.props;

    if (editing) {
      this.populateAddEditForm(entityToEdit);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { resetForm, entityToEdit } = nextProps;
    if (resetForm && !this.props.resetForm) {
      this.props.form.resetFields();
      this.props.formResetted();
      this.setState(this.getInitialState());
    }

    if (!this.props.entityToEdit && entityToEdit) {
      this.props.setSubmitFormStatus(false);

      this.populateAddEditForm(entityToEdit);
    }
  }

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
      setSubmitFormStatus,
      editing,
      entityToEdit
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const { attachmentsAdded, alreadyAddedAttachments } = this.state;

        let newActivity = {};

        if (editing) {
          newActivity = { ...entityToEdit };
        }

        setSubmitFormStatus(true);

        const updatedValues = {
          ...values,
          attachments: [
            ...attachmentsAdded.map(a => a.id),
            ...alreadyAddedAttachments.map(a => a.id)
          ]
        };

        onSubmit({ ...newActivity, ...updatedValues });
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

  populateAddEditForm = activity => {
    const {
      title,
      description,
      // instruments,
      // musicalGrade,
      // bars,
      url
    } = activity;

    this.props.form.setFieldsValue({
      title,
      description,
      // instruments,
      // musicalGrade,
      // bars,
      url
    });
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
      editing,
      entityToEdit,
      getSubmitButtonText,
      submittingForm
    } = this.props;

    const cancelRedirectUrl = editing
      ? `${routes.activities}/${entityToEdit.id}`
      : `${routes.activities}`;

    const { alreadyAddedAttachments } = this.state;

    return (
      <div className="add-cluster-container add-new-container details details-view">
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="Title" {...formItemLayout}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please give a name for Activity!'
                  }
                ]
              })(
                <Input
                  className={`${this.state.titleDisabled ? 'disabled' : ''}`}
                  onBlur={() => this.setTitleDisabled(true)}
                  onClick={() => this.setTitleDisabled(false)}
                  placeholder="Enter Activity Name"
                />
              )}
            </FormItem>
            <FormItem label="Description" {...formItemLayout}>
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'Please give a description for Activity!'
                  }
                ]
              })(
                <TextArea
                  className="description"
                  placeholder="Description about Activity"
                  autosize
                />
              )}
            </FormItem>
            {editing && alreadyAddedAttachments.length ? (
              <div style={{ display: 'flex' }}>
                <div style={{ fontWeight: 'bold' }}>Existing Attachments</div>
                <ul style={{ listStyle: 'none' }}>
                  {alreadyAddedAttachments.map(attach => (
                    <li style={{ marginBottom: '5px' }} key={attach.id}>
                      <Icon style={{ marginRight: '12px' }} type="paper-clip" />
                      {attach.name || getAttachmentNameFromPath(attach.path)}
                      <Icon
                        title="Remove Attachment"
                        style={{ cursor: 'pointer', marginLeft: '18px' }}
                        onClick={() => this.removeExistingAttachment(attach)}
                        type="close-circle-o"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ''
            )}
            <FormItem label="Attachments" {...formItemLayout}>
              {getFieldDecorator('attachments', {
                rules: [{ required: false }]
              })(
                <UploadAttachment
                  multiple
                  uploadType="activity"
                  afterUpload={res => this.attachmentUploaded(res)}
                  onRemove={this.attachmentRemoved}
                />
              )}
            </FormItem>
            <FormItem label="URL" {...formItemLayout}>
              {getFieldDecorator('url', {
                rules: [
                  {
                    required: false,
                    pattern:
                      '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?',
                    message: 'Please give a valid url.'
                  }
                ]
              })(<Input className="url" placeholder="Additional URL" />)}
            </FormItem>
            <FormItem>
              <Link to={cancelRedirectUrl}>
                <Button type="default">Cancel</Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                disabled={submittingForm}
              >
                {getSubmitButtonText()}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddActivity);
