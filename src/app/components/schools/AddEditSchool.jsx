import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { Form, Input, Button, Select } from "antd";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

import routes from "../../constants/routes.json";

import { searchTeachers } from "../../apis/people-api";

const FormItem = Form.Item;
const { Option } = Select;

class AddEditSchool extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func
    }).isRequired,
    clusters: ImmutablePropTypes.map,
    onSubmit: PropTypes.func,
    schoolToEdit: PropTypes.shape({}),
    editingSchool: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func
  };

  static defaultProps = {
    onSubmit: () => {},
    schoolToEdit: null,
    editingSchool: false,
    resetForm: false,
    clusters: null,
    formResetted: () => {}
  };

  constructor(props) {
    super(props);

    this.searchForTeachers = debounce(this.searchForTeachers, 750);
  }

  state = {
    creatingSchool: false,
    titleDisabled: true,
    leadTeachers: [],
    teachers: [],
    searchingTeachers: false
  };

  componentDidMount() {
    const { editingSchool, schoolToEdit } = this.props;

    if (editingSchool) {
      const {
        title,
        locationName,
        clientSince,
        coordinatorName,
        coordinatorEmail,
        coordinatorPhone,
        leadTeacher,
        cluster,
        teachers
      } = schoolToEdit;

      this.props.form.setFieldsValue({
        title,
        locationName,
        clientSince,
        coordinatorName,
        coordinatorEmail,
        coordinatorPhone,
        leadTeacher,
        cluster,
        teachers
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { resetForm, editingSchool, schoolToEdit } = nextProps;
    const { resetForm: wasResettingForm } = this.props;
    if (resetForm && !wasResettingForm) {
      this.props.form.resetFields();
      this.props.formResetted();
    } else if (editingSchool) {
      const { teacherDetails, leadTeacherDetails } = schoolToEdit;

      const { teachers, leadTeachers } = this.state;

      // check if we are setting the teachers state only for the first time
      // not on subsequent prop updates
      if (teacherDetails && teacherDetails.length && teachers.length === 0) {
        this.setState({
          teachers: teacherDetails
        });
      }

      if (leadTeacherDetails && leadTeachers.length === 0) {
        this.setState({
          leadTeachers: [leadTeacherDetails]
        });
      }
    }
  }

  setTitleDisabled(flag) {
    this.setState({
      titleDisabled: flag
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { form, onSubmit, editingSchool, schoolToEdit } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          creatingSchool: true
        });

        let newSchool = {};

        if (editingSchool) {
          newSchool = {
            ...schoolToEdit
          };
        }

        const school = {
          ...values,
          description: "",
          clientSince: parseInt(values.clientSince, 10)
        };

        onSubmit({ ...newSchool, ...school });
      }
    });
  };

  searchForTeachers = (value, kind) => {
    if (kind === "teacher") {
      this.setState({
        teachers: [],
        searchingTeachers: true
      });
    } else {
      this.setState({
        leadTeachers: [],
        searchingTeachers: true
      });
    }

    searchTeachers({ search: value }).then(response => {
      const { results } = response;

      if (kind === "teacher") {
        this.setState({
          teachers: results,
          searchingTeachers: false
        });
      } else {
        this.setState({
          leadTeachers: results,
          searchingTeachers: false
        });
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
      clusters,
      //  teachers,
      editingSchool,
      schoolToEdit
    } = this.props;
    const clusterList = clusters && clusters.toIndexedSeq().toArray();
    // const teacherList = teachers && teachers.toIndexedSeq().toArray();
    const { leadTeachers, teachers, searchingTeachers } = this.state;

    const cancelRedirectUrl = editingSchool
      ? `${routes.schools}/${schoolToEdit.id}`
      : `${routes.schools}`;

    return (
      <div className="add-school-container add-new-container details details-view">
        {/* <div className="add-new-title title">
          <h1>Enter School Name</h1>

        </div> */}
        <div className="add-new-form">
          <Form
            layout="horizontal"
            onSubmit={this.handleSubmit}
            hideRequiredMark
          >
            <FormItem>
              {getFieldDecorator("title", {
                rules: [
                  { required: true, message: "Please give a name for School!" }
                ]
              })(
                <Input
                  className={`title-input ${
                    this.state.titleDisabled ? "disabled" : ""
                  }`}
                  onBlur={() => this.setTitleDisabled(true)}
                  onClick={() => this.setTitleDisabled(false)}
                  placeholder="Enter School Name"
                />
              )}
            </FormItem>
            <FormItem label="Cluster" {...formItemLayout}>
              {getFieldDecorator("cluster", {
                rules: [
                  {
                    required: true,
                    message: "Please select the cluster for the school!"
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Assign Cluster"
                >
                  {clusterList &&
                    clusterList.map(cluster => (
                      <Option key={cluster.id} value={cluster.id}>
                        {cluster.title}
                      </Option>
                    ))}
                  {/* <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option> */}
                </Select>
              )}
            </FormItem>
            <FormItem label="Location" {...formItemLayout}>
              {getFieldDecorator("locationName", {
                rules: [{ required: true, message: "Please give a location!" }]
              })(<Input placeholder="Enter location" />)}
            </FormItem>
            <FormItem label="Lead Teacher" {...formItemLayout}>
              {getFieldDecorator("leadTeacher", {
                rules: [
                  {
                    required: true,
                    message: "Please select the Lead Teacher for the school!"
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Assign a Lead Teacher"
                  notFoundContent={
                    searchingTeachers ? "Searching" : "No Teacher Found"
                  }
                  filterOption={false}
                  onSearch={value =>
                    this.searchForTeachers(value, "leadTeacher")
                  }
                  style={{ width: "100%" }}
                >
                  {leadTeachers.map(teacher => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="Teachers" {...formItemLayout}>
              {getFieldDecorator("teachers", {
                rules: [{ required: true, message: "Add atleast one teacher!" }]
              })(
                <Select
                  mode="multiple"
                  showSearch
                  placeholder="Add Teachers"
                  notFoundContent={
                    searchingTeachers ? "Searching" : "No Teacher Found"
                  }
                  filterOption={false}
                  onSearch={value => this.searchForTeachers(value, "teacher")}
                  style={{ width: "100%" }}
                >
                  {teachers.map(teacher => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.userDetails.firstName}&nbsp;
                      {teacher.userDetails.lastName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="Client Since" {...formItemLayout}>
              {getFieldDecorator("clientSince", {
                rules: [{ required: true, message: "Please enter a year!" }]
              })(<Input type="number" placeholder="Year" />)}
            </FormItem>
            <FormItem label="Coordinator name" {...formItemLayout}>
              {getFieldDecorator("coordinatorName", {
                rules: [
                  {
                    required: true,
                    message: "Please give name of coordinator!"
                  }
                ]
              })(
                <Input
                  autoComplete="name"
                  placeholder="Name of the coordinator"
                />
              )}
            </FormItem>
            <FormItem label="Coordinator phone" {...formItemLayout}>
              {getFieldDecorator("coordinatorPhone", {
                rules: [
                  {
                    required: true,
                    message: "Please enter a valid 10 digit phone number!",
                    pattern: new RegExp("^\\d{10}$")
                  }
                ]
              })(
                <Input
                  type="number"
                  autoComplete="tel"
                  placeholder="Phone no. of the coordinator"
                />
              )}
            </FormItem>
            <FormItem label="Coordinator email" {...formItemLayout}>
              {getFieldDecorator("coordinatorEmail", {
                rules: [
                  {
                    required: true,
                    message: "Please give email of coordinator!"
                  }
                ]
              })(
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Email of the coordinator"
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
                disabled={this.state.creatingSchool}
              >
                {this.state.creatingSchool ? "Saving.." : "Save"}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddEditSchool);
