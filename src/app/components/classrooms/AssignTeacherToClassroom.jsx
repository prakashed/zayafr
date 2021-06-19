import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Form, Select, Modal } from 'antd';

import { TEACHER_TYPES } from '../../constants/config';

const FormItem = Form.Item;
const { Option } = Select;

class AssignTeacherToClassroom extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      getFieldValue: PropTypes.func,
      resetFields: PropTypes.func,
    }).isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    teachers: PropTypes.arrayOf(PropTypes.shape({})),
    visible: PropTypes.bool,
    instruments: ImmutablePropTypes.list,
    instrumentsAssignedToTeachers: PropTypes.shape({}),
  }

  static defaultProps = {
    teachers: [],
    onSubmit: () => {},
    onCancel: () => {},
    visible: false,
    instruments: null,
    instrumentsAssignedToTeachers: {},
  }

  shouldComponentUpdate(nextProps) {
    const { visible } = nextProps;

    if (visible && !this.props.visible) {
      this.props.form.resetFields();
    }

    return true;
  }

  getInstrumentForTeacher = () => {
    const {
      form,
      teachers,
      instruments,
      instrumentsAssignedToTeachers,
    } = this.props;
    const selectedTeacherId = form.getFieldValue('teacher');
    // console.log('selected teacher id --> ', selectedTeacherId);
    if (selectedTeacherId) {
      const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
      if (!selectedTeacher) return instruments;

      const instrumentsAlreadyAssigned = instrumentsAssignedToTeachers[selectedTeacherId];
      // console.log('selected teacher --> ', selectedTeacher);
      const { profileDetails } = selectedTeacher;
      const { instrumentDetails } = profileDetails;

      const instrumentsForTeacher = instrumentDetails || instruments;

      if (instrumentsAlreadyAssigned) {
        return instrumentsForTeacher.filter(i => !instrumentsAlreadyAssigned.has(i.id));
      }

      return instrumentsForTeacher;

      // if (instrumentDetails && instrumentDetails.length) {
      //   // remove the instruments which have already been assigned to the teacher
      //   if (instrumentsAlreadyAssigned) {
      //     return instrumentDetails.filter(i => !instrumentsAlreadyAssigned.has(i.id));
      //   }
      //   return instrumentDetails;
      // }

      // if ()
      // return instruments;
    }

    return instruments;
  }

  getInstrumentsAlreadyAssignedToTeacher = () => {
    const {
      form, instruments, instrumentsAssignedToTeachers, teachers,
    } = this.props;

    const defaultReturn = (<p />);

    const selectedTeacherId = form.getFieldValue('teacher');
    if (selectedTeacherId) {
      const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
      if (!selectedTeacher) return defaultReturn;

      const instrumentsAlreadyAssigned = instrumentsAssignedToTeachers[selectedTeacherId];

      if (!instrumentsAlreadyAssigned) return defaultReturn;

      const instrumentsAssigned = instruments
        .filter(i => instrumentsAlreadyAssigned.has(i.id))
        .map(i => i.title)
        .join();

      const { fullName } = selectedTeacher;

      return (<p>{fullName} has been already assigned <b>{instrumentsAssigned}</b></p>);
    }

    return defaultReturn;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {
      form, onSubmit, teachers, instruments,
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        // console.log('adding new teacher', values);
        const { type, teacher, instrument } = values;
        const teacherObject = teachers.find(t => t.id === teacher);
        const typeObject = TEACHER_TYPES.find(t => t.id === type);
        const instrumentObject = instruments.find(i => i.id === instrument);

        const addedTeacher = {
          ...teacherObject,
          type: typeObject,
          instrument: instrumentObject,
        };

        onSubmit(addedTeacher);
      }
    });
  }

  teacherFieldChanged = () => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const selectedInstrument = getFieldValue('instrument');
    if (!selectedInstrument) return;

    setFieldsValue({ instrument: '' });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { teachers, onCancel, visible } = this.props;

    const teacherSelected = !!getFieldValue('teacher');
    const instrumentsForTeacher = this.getInstrumentForTeacher();

    return (
      <Modal
        title="Add Teacher"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={onCancel}
      >
        <Form layout="horizontal" onSubmit={this.handleSubmit} style={{ textAlign: 'center' }}>
          <FormItem label="Teacher" {...formItemLayout} style={{ marginBottom: 6 }}>
            {
              getFieldDecorator('teacher', {
              rules: [{ required: true, message: 'Select a teacher!' }],
              })(<Select
                placeholder="Select Teacher"
                style={{ width: '200px' }}
                onChange={this.teacherFieldChanged}
              >
                {
                  teachers.map(teacher =>
                  (<Option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                   </Option>))}
                 </Select>)
            }
          </FormItem>
          { teacherSelected && this.getInstrumentsAlreadyAssignedToTeacher() }
          { teacherSelected &&
            <FormItem label="Type" {...formItemLayout}>
              {
              getFieldDecorator('type', {
              rules: [{ required: true, message: 'Choose the type!' }],
              })(<Select
                placeholder="Select type"
                style={{ width: '200px' }}
              >
                {
                  TEACHER_TYPES.map(type =>
                  (<Option key={type.id} value={type.id}>
                    { type.title }
                   </Option>))}
                 </Select>)
            }
            </FormItem>
          }
          { teacherSelected &&
            <FormItem label="Instrument" {...formItemLayout}>
              {
                getFieldDecorator('instrument', {
                rules: [{ required: true, message: 'Select an instrument!' }],
                })(<Select
                  placeholder="Select Instrument"
                  style={{ width: '200px' }}
                  notFoundContent="No instruments available"
                >
                  {
                    instrumentsForTeacher && instrumentsForTeacher.map(instrument =>
                    (<Option key={instrument.id} value={instrument.id}>
                      { instrument.title }
                    </Option>))}
                </Select>)
              }
            </FormItem>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AssignTeacherToClassroom);
