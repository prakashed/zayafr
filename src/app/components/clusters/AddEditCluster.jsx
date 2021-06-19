import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select } from 'antd';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

import routes from '../../constants/routes.json';
import { searchUsers } from '../../apis/people-api';

const FormItem = Form.Item;
const { Option } = Select;

class AddCluster extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
      setFieldsValue: PropTypes.func,
      resetFields: PropTypes.func,
    }).isRequired,
    onSubmit: PropTypes.func,
    clusterToEdit: PropTypes.shape({}),
    editingCluster: PropTypes.bool,
    resetForm: PropTypes.bool,
    formResetted: PropTypes.func,
  };

  static defaultProps = {
    onSubmit: () => {},
    clusterToEdit: null,
    editingCluster: false,
    resetForm: false,
    formResetted: () => {},
  };

  constructor(props) {
    super(props);

    this.searchForUsers = debounce(this.searchForUsers, 750);
  }

  state = {
    creatingCluster: false,
    titleDisabled: true,
    users: [],
    searchingUsers: false,
    clusterManagerFieldSelected: false,
  }

  componentDidMount() {
    const {
      editingCluster, clusterToEdit,
    } = this.props;

    if (editingCluster) {
      const {
        title,
        // clusterManager,
        clusterManagerDetails,
      } = clusterToEdit;

      this.searchForUsers(clusterManagerDetails.fullName);

      this.props.form.setFieldsValue({
        title,
        // clusterManager,
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
      titleDisabled: flag,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {
      form, onSubmit, editingCluster, clusterToEdit,
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          creatingCluster: true,
        });

        let newCluster = {};

        if (editingCluster) {
          newCluster = {
            ...clusterToEdit,
          };
        }

        const cluster = {
          ...values,
        };

        onSubmit({ ...newCluster, ...cluster });
      }
    });
  }

  searchForUsers = (value) => {
    this.setState({
      users: [],
      searchingUsers: true,
    });

    searchUsers({ search: value }).then((response) => {
      const { results } = response;
      this.setState({
        users: results,
        searchingUsers: false,
      }, this.populateClusterManagerField);
    });
  }

  populateClusterManagerField = () => {
    const {
      editingCluster, clusterToEdit,
    } = this.props;

    const { clusterManagerFieldSelected } = this.state;

    if (clusterManagerFieldSelected) return;

    if (editingCluster) {
      const {
        clusterManager,
      } = clusterToEdit;


      this.props.form.setFieldsValue({
        clusterManager,
      });

      this.setState({ clusterManagerFieldSelected: true });
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };

    const { getFieldDecorator } = this.props.form;
    const { editingCluster, clusterToEdit } = this.props;
    const { users, searchingUsers } = this.state;

    const cancelRedirectUrl = editingCluster ? `${routes.clusters}/${clusterToEdit.id}` : `${routes.clusters}`;

    return (
      <div className="add-cluster-container add-new-container details details-view">
        <div className="add-new-form">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem>
              {
                getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please give a name for Cluster!' }],
                })(<Input className={`title-input ${this.state.titleDisabled ? 'disabled' : ''}`} onBlur={() => this.setTitleDisabled(true)} onClick={() => this.setTitleDisabled(false)} placeholder="Enter Cluster Name" />)
              }
            </FormItem>
            <FormItem label="Cluster Manager" {...formItemLayout}>
              {
                getFieldDecorator('clusterManager', {
                rules: [{ required: true, message: 'Please select the Manager for the cluster!' }],
                })(<Select
                  showSearch
                  placeholder="Select users"
                  notFoundContent={searchingUsers ? 'Searching' : 'No User Found'}
                  filterOption={false}
                  onSearch={this.searchForUsers}
                  style={{ width: '100%' }}
                >
                  {users.map(user =>
                    (<Option key={user.id} value={user.id}>
                      {user.fullName}&nbsp;[{user.username}]
                     </Option>))}
                </Select>)
              }
            </FormItem>
            <FormItem>
              <Link to={cancelRedirectUrl}><Button type="default">Cancel</Button></Link>
              <Button type="primary" htmlType="submit" disabled={this.state.creatingCluster}>
                { this.state.creatingCluster ? 'Saving..' : 'Save' }
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddCluster);
