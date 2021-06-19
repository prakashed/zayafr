import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Form, Button, Select, Input, Icon, Row, Col, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
// import { debounce } from 'lodash';

import routes from '../../constants/routes.json';
// import { searchTeachers } from '../../apis/people-api';
import { assignTeacherToClassroom, deleteTeacherFromClassroom } from '../../apis/classroom-api';
import './AddEditClassroom.less';
import AssignTeacherToClassroom from './AssignTeacherToClassroom';
import { TEACHER_TYPES } from '../../constants/config';
import AssignedTeachersTable from './AssignedTeachersTable';

const FormItem = Form.Item;
const { Option } = Select;

const RenderOptions = dataList =>
  dataList && dataList.map(data => <Option key={data.id} value={data.id}>{data.title}</Option>);

class AddEditClassroom extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func,
    }).isRequired,
    onSubmit: PropTypes.func,
    classroomToEdit: PropTypes.shape({}),
    schoolGrades: ImmutablePropTypes.list,
    school: PropTypes.shape({}),
    schoolId: PropTypes.string.isRequired,
    divisions: ImmutablePropTypes.list,
    addNewDivision: PropTypes.func.isRequired,
    editingClassroom: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
    instruments: ImmutablePropTypes.list,
  };

  static defaultProps = {
    onSubmit: () => {},
    classroomToEdit: null,
    editingClassroom: false,
    schoolGrades: null,
    school: null,
    divisions: null,
    resetForm: false,
    formResetted: () => {},
    instruments: null,
  };

  // constructor(props) {
  //   super(props);

  //   // this.searchForTeachers = debounce(this.searchForTeachers, 750);
  // }


  state = {
    creatingClassroom: false,
    // titleDisabled: true,
    teachersAssigned: [],
    // searchingTeachers: false,
    divisionInputVisible: false,
    divisionInputValue: '',
    addingTeacher: false,
    updatingTeachersAssigned: false,
  }

  componentDidMount() {
    const {
      editingClassroom, classroomToEdit, school,
    } = this.props;

    if (editingClassroom) {
      const {
        grade,
        division,
        // teachers,
        classStrength,
        classroomTeachers,
      } = classroomToEdit;

      this.populateAssignedTeachers({
        assignedTeachers: classroomTeachers,
        allTeachers: school && school.teacherDetails,
      });

      this.props.form.setFieldsValue({
        grade,
        division,
        // teachers,
        classStrength,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      resetForm,
      editingClassroom,
      // classroomToEdit
    } = nextProps;
    const { resetForm: wasResetForm } = this.props;
    if (resetForm && !wasResetForm) {
      this.props.form.resetFields();
      this.props.formResetted();
    }

    if (editingClassroom && !this.props.editingClassroom) {
      this.setState({ creatingClassroom: false });
    }
    //  else if (editingClassroom) {
    //   const {
    //     teacherDetails,
    //   } = classroomToEdit;

    //   const { teachers } = this.state;
    //   // check if we are setting the teachers state only for the first time
    //   // not on subsequent prop updates
    //   if (teacherDetails && teacherDetails.length && teachers.length === 0) {
    //     this.setState({
    //       teachers: teacherDetails,
    //     });
    //   }
    // }
  }

  showInput = () => {
    this.setState({ divisionInputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ divisionInputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { divisionInputValue } = this.state;
    this.props.addNewDivision({ title: divisionInputValue, school: this.props.schoolId });
    this.hideDivisionInput();
  }

  hideDivisionInput = () => {
    this.setState({
      divisionInputVisible: false,
      divisionInputValue: '',
    });
  }

  saveInputRef = (input) => { this.input = input; }

  handleSubmit = (e) => {
    e.preventDefault();

    const {
      form, onSubmit, editingClassroom, classroomToEdit,
      schoolId,
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          creatingClassroom: true,
        });

        let newClassroom = {};

        if (editingClassroom) {
          newClassroom = {
            ...classroomToEdit,
          };
        }

        const classroom = {
          ...values,
          school: schoolId,
        };

        onSubmit({ ...newClassroom, ...classroom });
      }
    });
  }

  // searchForTeachers = (value) => {
  //   this.setState({
  //     teachers: [],
  //     searchingTeachers: true,
  //   });

  //   searchTeachers({ search: value, school: this.props.schoolId }).then((response) => {
  //     const { results } = response;

  //     this.setState({
  //       teachers: results,
  //       searchingTeachers: false,
  //     });
  //   });
  // }

  showOptionToAddTeacher = () => (
    <Button
      style={{ width: '100%' }}
      onClick={() => this.setState({ addingTeacher: true })}
      icon="plus"
    >
      Assign Teachers
    </Button>
  )

  populateAssignedTeachers = ({ assignedTeachers, allTeachers }) => {
    const { instruments } = this.props;

    const teacherData = assignedTeachers.map((teacherObj) => {
      const {
        id: classroomId, teacher: teacherId, type, instrument, instrumentTitle,
      } = teacherObj;
      const teacherInSchool = allTeachers.find(t => t.id === teacherId);
      const typeObject = TEACHER_TYPES.find(t => t.id === type);

      const instrumentObject = instruments.find(i => i.id === instrument)
                                || { id: instrument, title: instrumentTitle || 'None' };

      const addedTeacher = {
        ...teacherInSchool,
        type: typeObject,
        instrument: instrumentObject,
        classroomId,
      };

      return addedTeacher;
    });

    this.setState({ teachersAssigned: teacherData });
  }

  addTeacherToClassroom = (values) => {
    const { teachersAssigned } = this.state;
    const newArr = [...teachersAssigned, values];
    this.setState({
      addingTeacher: false,
      teachersAssigned: newArr,
      updatingTeachersAssigned: true,
    });

    const { classroomToEdit } = this.props;
    const { id: classroom } = classroomToEdit;
    const { id: teacherId, type: { id: typeId }, instrument: { id: instrumentId } } = values;

    const payload = {
      teacher: teacherId,
      classroom,
      instrument: instrumentId,
      type: typeId,
    };

    assignTeacherToClassroom(payload)
      .then((response) => {
        // console.log('got response for assigning teacher to classroom --> ', response);
        const { id: classroomId } = response;
        this.updateClassroomIdForAssignedTeacher({ classroomId, teacherId });
      })
      .catch(() => {
        // console.error('got error while assigning teacher to classroom --> ', err);
      })
      .finally(() => this.setState({ updatingTeachersAssigned: false }));
  }

  updateClassroomIdForAssignedTeacher = ({ classroomId, teacherId }) => {
    const { teachersAssigned } = this.state;
    const pos = teachersAssigned.findIndex(t => t.id === teacherId);
    if (pos > -1) {
      const teacherObj = teachersAssigned[pos];
      const updatedTeacherObj = {
        ...teacherObj,
        classroomId,
      };

      const updatedTeachersAssigned = [
        ...teachersAssigned.splice(0, pos),
        updatedTeacherObj,
        ...teachersAssigned.splice(pos + 1),
      ];

      this.setState({
        teachersAssigned: updatedTeachersAssigned,
      });
    }
  }

  unassignTeacherFromClassroom = (teacher) => {
    const { id } = teacher;
    const { teachersAssigned } = this.state;
    const pos = teachersAssigned.findIndex(t => t.id === id);
    if (pos > -1) {
      const newTeachers = [...teachersAssigned.splice(0, pos), ...teachersAssigned.splice(pos + 1)];
      this.setState({ teachersAssigned: newTeachers });
    }
  }

  removeTeacher = (teacher) => {
    // console.log('remove teacher --> ', teacher);
    const { classroomId } = teacher;
    if (!classroomId) return;

    this.setState({
      updatingTeachersAssigned: true,
    });

    deleteTeacherFromClassroom(classroomId)
      .then(() => {
        this.unassignTeacherFromClassroom(teacher);
      })
      .catch(() => {
        // console.error('error while deleting teacher from classroom --> ', err);
      })
      .finally(() => this.setState({ updatingTeachersAssigned: false }));
  }

  renderDeleteTeacherAction = (text, teacher) => (
    <Tooltip title={`Delete ${teacher.fullName}`}>
      <Icon style={{ cursor: 'pointer' }} type="delete" onClick={() => this.removeTeacher(teacher)} />
    </Tooltip>
  )

  renderTeachersAdded = () => {
    const { teachersAssigned, updatingTeachersAssigned } = this.state;

    if (teachersAssigned.length) {
      const columns = [{
        title: 'Name',
        dataIndex: 'fullName',
      }, {
        title: 'Type',
        dataIndex: 'type.title',
      }, {
        title: 'Instrument',
        dataIndex: 'instrument.title',
      }, {
        title: 'Delete',
        render: this.renderDeleteTeacherAction,
      }];

      const teachers = teachersAssigned.map(t => ({ ...t, key: t.id }));

      return (
        <AssignedTeachersTable
          teachers={teachers}
          loading={updatingTeachersAssigned}
          columns={columns}
        />
      );
    }

    return '';
  }

  renderAssignTeacherFunction = () => {
    const {
      instruments,
      school,
    } = this.props;

    const {
      addingTeacher,
      teachersAssigned,
    } = this.state;

    const teachers = school && school.teacherDetails;

    // const teachersNotAssigned = teachers.filter(t =>
    //   teachersAssigned.findIndex(teacher => teacher.id === t.id)
    //   === -1);

    const instrumentsAssignedToTeachers = teachersAssigned.reduce((mapper, teacher) => {
      const { id, instrument } = teacher;
      const { id: instrumentId } = instrument;
      const instrumentsMappedForTeacher = {};

      const instrumentsMapped = mapper[id] || new Set();

      instrumentsMappedForTeacher[id] = instrumentsMapped.add(instrumentId);

      return {
        ...mapper,
        ...instrumentsMappedForTeacher,
      };
    }, {});

    return (
      <Fragment>
        { this.renderTeachersAdded() }
        {/* { teachersNotAssigned.length > 0 && this.showOptionToAddTeacher() } */}
        { this.showOptionToAddTeacher() }
        <AssignTeacherToClassroom
          teachers={teachers}
          onSubmit={this.addTeacherToClassroom}
          onCancel={() => this.setState({ addingTeacher: false })}
          visible={addingTeacher}
          instruments={instruments}
          instrumentsAssignedToTeachers={instrumentsAssignedToTeachers}
        />
      </Fragment>
    );
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };

    const { getFieldDecorator } = this.props.form;
    const {
      editingClassroom,
      classroomToEdit,
      schoolGrades,
      divisions,
    } = this.props;

    const {
      divisionInputValue,
      divisionInputVisible,
    } = this.state;

    const cancelRedirectUrl = editingClassroom ? `${routes.classrooms}/${classroomToEdit.id}` : `${routes.classrooms}`;

    return (
      <div className="add-classroom-container add-new-container details details-view">
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem label="Grade" {...formItemLayout}>
              {
                getFieldDecorator('grade', {
                rules: [{ required: true, message: 'Please select the grade for the classroom!' }],
                })(<Select placeholder="Select a grade">{ RenderOptions(schoolGrades) }</Select>)
              }
            </FormItem>
            <FormItem label="Division" {...formItemLayout}>
              {
                getFieldDecorator('division', {
                rules: [{ required: true, message: 'Please select the division for the classroom!' }],
                })(<Select placeholder="Select a division">{ RenderOptions(divisions) }</Select>)
              }
            </FormItem>
            <div className="add-custom-division">
              {
                divisionInputVisible ? (
                  <Row>
                    <Col span={8} />
                    <Col span={10}>
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        // size="small"
                        style={{ width: 78 }}
                        value={divisionInputValue}
                        onChange={this.handleInputChange}
                        // onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    </Col>
                    <Col span={2} style={{ textAlign: 'right' }}>
                      <Icon title="Close" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={this.hideDivisionInput} type="close-circle" />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col span={8}>
                      <span>Add Custom Division</span>
                    </Col>
                    <Col span={12}>
                      <Button
                        onClick={this.showInput}
                        style={{ background: '#fff', fontSize: '12px', height: '22px' }}
                      >
                        <Icon type="plus" />
                      </Button>
                    </Col>
                  </Row>
                )
              }
            </div>
            <FormItem label="Class Strength" {...formItemLayout}>
              {
                getFieldDecorator('classStrength', {
                rules: [{ required: true, message: 'Please specify the strength of the class!' }],
                })(<Input type="number" placeholder="No. of students in the class" />)
              }
            </FormItem>
            { editingClassroom && this.renderAssignTeacherFunction() }
            <FormItem>
              <Link to={cancelRedirectUrl}><Button type="default">Cancel</Button></Link>
              <Button type="primary" htmlType="submit" disabled={this.state.creatingClassroom}>
                { this.state.creatingClassroom ? 'Saving..' : 'Save' }
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddEditClassroom);
