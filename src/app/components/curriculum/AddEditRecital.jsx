import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Form, Input, InputNumber, Button, Select, Icon } from 'antd';
import { Link } from 'react-router-dom';

import { getAttachmentNameFromPath } from '../../helpers';
import routes from '../../constants/routes.json';
import '../core/CoreLayout.less';
import UploadAttachment from '../misc/UploadAttachment';

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
    curriculumToEdit: PropTypes.shape({}),
    editingCurriculum: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    types: PropTypes.array
  };

  static defaultProps = {
    onSubmit: () => {},
    instruments: null,
    musicalGrades: null,
    types: [
      {
        id: 'generic',
        title: 'Generic'
      },
      {
        id: 'specific',
        title: 'Specific'
      },
      {
        id: 'trinity',
        title: 'Trinity'
      },
      {
        id: 'custom',
        title: 'Custom'
      }
    ],
    curriculumToEdit: null,
    editingCurriculum: false,
    resetForm: false,
    formResetted: () => {}
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
      const { title } = curriculumToEdit;

      const {
        instruments,
        type,
        musicalGrade,
        bars,
        url
      } = curriculumToEdit.properties;

      this.props.form.setFieldsValue({
        title,
        instruments,
        type,
        musicalGrade,
        bars,
        type,
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
    const { editingCurriculum } = this.props;

    if (submittingForm && editingCurriculum) {
      return 'Updating...';
    }

    if (submittingForm && !editingCurriculum) {
      return 'Saving...';
    }

    if (editingCurriculum) {
      return 'Update';
    }

    return 'Save';
  }

  handleSubmit = e => {
    e.preventDefault();

    const { form, onSubmit, editingCurriculum, curriculumToEdit } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submittingForm: true
        });

        const { attachmentsAdded, alreadyAddedAttachments } = this.state;

        let newCurriculum = {};

        if (editingCurriculum) {
          newCurriculum = { ...curriculumToEdit };
        }

        const updatedValues = {
          ...values,
          bars: values.bars && parseInt(values.bars, 10),
          description: '',
          childType: 'recital',
          attachments: [
            ...attachmentsAdded.map(a => a.id),
            ...alreadyAddedAttachments.map(a => a.id)
          ]
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

    const {
      instruments,
      types,
      musicalGrades,
      editingCurriculum,
      curriculumToEdit
    } = this.props;

    const { alreadyAddedAttachments } = this.state;

    const cancelRedirectUrl = editingCurriculum
      ? `${routes.curriculums}/${curriculumToEdit.id}`
      : `${routes.curriculums}`;

    return (
      <div className="add-curriculum-container add-new-container details details-view">
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="Recital Type" {...formItemLayout}>
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: 'Please choose a type for this Recital!'
                  }
                ]
              })(
                <Select placeholder="Select a recital type">
                  {RenderOptions(types)}
                </Select>
              )}
            </FormItem>
            <FormItem label="Recital Name" {...formItemLayout}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please give a title for the Recital!'
                  }
                ]
              })(
                <Input
                  className={`${this.state.titleDisabled ? 'disabled' : ''}`}
                  onBlur={() => this.setTitleDisabled(true)}
                  onClick={() => this.setTitleDisabled(false)}
                  placeholder="Enter Recital title..."
                  autoComplete="off"
                />
              )}
            </FormItem>
            <FormItem label="Instrument" {...formItemLayout}>
              {getFieldDecorator('instruments', {
                rules: [
                  { required: true, message: 'Select atleast one instrument!' }
                ]
              })(
                <Select mode="multiple" placeholder="Select an instrument">
                  {RenderOptions(instruments)}
                </Select>
              )}
            </FormItem>
            <FormItem label="Suggested Grade" {...formItemLayout}>
              {getFieldDecorator('musicalGrade', {
                rules: [
                  {
                    required: true,
                    message: 'Please give the grade for Curriculum!'
                  }
                ]
              })(
                <Select placeholder="Select a grade">
                  {RenderOptions(musicalGrades)}
                </Select>
              )}
            </FormItem>
            <FormItem label="MuseScore URL" {...formItemLayout}>
              {getFieldDecorator('url', {
                rules: [
                  {
                    required: false,
                    pattern:
                      '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
                  }
                ]
              })(<Input placeholder="URL" />)}
            </FormItem>
            <FormItem label="Bar" {...formItemLayout}>
              {getFieldDecorator('bars', {
                rules: [
                  {
                    required: true,
                    message:
                      'Please give a count of Bars in the Recital (Max: 240)',
                    min: 1,
                    max: 240,
                    type: 'number'
                  }
                ]
              })(
                <InputNumber
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
                // disabled={this.state.submittingForm}
              >
                Save
                {/* {this.getSubmitButtonText()} */}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddEditRecital);
