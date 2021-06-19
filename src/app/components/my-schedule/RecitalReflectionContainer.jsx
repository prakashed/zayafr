import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Row,
  Col,
  Card,
  InputNumber,
  Form,
  Input,
  Button,
  Tooltip
} from 'antd';
import { Link } from 'react-router-dom';

import completedLogo from '../../../assets/img/completed.png';
import nextClassLogo from '../../../assets/img/next-class-2.png';
import notNeededLogo from '../../../assets/img/not-needed.png';

import history from '../../helpers/history';
import routes from '../../constants/routes.json';
import {
  fetchRecitalLogs,
  fetchRecitalReflections,
  createRecitalReflection
} from '../../apis/dashboard-api';

const { Meta } = Card;

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class RecitalReflectionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recitalReflections: [],
      recitalLogs: [],
      loading: false,
      viewing: false
    };
  }

  getRecitalLogs(sessionId) {
    this.setState({
      loading: true
    });
    fetchRecitalLogs(sessionId).then(res => {
      this.setState({
        loading: false
      });
      this.setState({
        recitalLogs: res.results
      });
    });
  }

  getRecitalReflections(sessionId) {
    this.setState({
      loading: true
    });
    fetchRecitalReflections(sessionId).then(res => {
      this.setState({
        loading: false
      });
      this.setState({
        recitalReflections: res.results
      });
    });
  }

  componentWillMount() {
    const path = this.props.match.path;
    const sessionId = this.props.match.params.id;
    if (path === '/recital-reflection-add/:id?') {
      this.getRecitalLogs(sessionId);
    } else {
      this.setState({
        viewing: true
      });
      this.getRecitalReflections(sessionId);
    }
  }

  getStateContent(state) {
    if (state === 'completed') {
      return (
        <span>
          <span> Completed </span>
          <img style={{ width: '15px' }} src={completedLogo} />
        </span>
      );
    } else if (state === 'not_needed') {
      return (
        <span>
          <span> Not Needed </span>
          <img style={{ width: '15px' }} src={notNeededLogo} />
        </span>
      );
    } else {
      return (
        <span>
          <span> Next Class </span>
          <img style={{ width: '15px' }} src={nextClassLogo} />
        </span>
      );
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submittingForm: true
        });

        const { data } = values;

        createRecitalReflection(data).then(res => {
          const url = `${routes.session}`;
          history.push(url);
        });
      }
    });
  };

  render() {
    const { recitalReflections, recitalLogs, editing } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    const cancelRedirectUrl = routes.session;

    const { viewing } = this.state;

    const recitalReflectionForm = (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        {recitalLogs.map((recitalLog, index) => (
          <Card key={index}>
            <Form.Item label="Objective" {...formItemLayout}>
              <Tooltip
                title={
                  recitalLog.customRecitalTitle + ' ' + recitalLog.lessonTitle
                }
              >
                <span className="ant-form-text">
                  {recitalLog.objectiveTitle}
                </span>
              </Tooltip>
            </Form.Item>
            <Form.Item label="State" {...formItemLayout}>
              <span className="ant-form-text">
                {this.getStateContent(recitalLog.state)}
              </span>
            </Form.Item>
            <FormItem label="Comment" {...formItemLayout}>
              {getFieldDecorator(`data[${index}]['comment']`, {
                rules: [
                  {
                    required: true,
                    message: 'Please provide a comment.'
                  }
                ]
              })(
                <TextArea placeholder="Please provide a comment." type="text" />
              )}
            </FormItem>
            <FormItem label="Time taken" {...formItemLayout}>
              {getFieldDecorator(`data[${index}]['time_taken']`, {
                rules: [
                  {
                    required: false,
                    message: 'Please give a count in Minutes.',
                    min: 1,
                    max: 120,
                    type: 'number'
                  }
                ]
              })(
                <InputNumber
                  placeholder="Minutes"
                  type="number"
                  style={{ width: '100px' }}
                />
              )}
            </FormItem>
            <FormItem label="Assessment Comment" {...formItemLayout}>
              {getFieldDecorator(`data[${index}]['assessment_comment']`, {
                rules: [
                  {
                    required: false,
                    message: 'Please provide a comment on the assessment.'
                  }
                ]
              })(
                <TextArea
                  placeholder="Please provide a comment on the assessment."
                  type="text"
                />
              )}
            </FormItem>
            {getFieldDecorator(`data[${index}]['recital_log']`, {
              initialValue: recitalLog.id
            })(<Input type="hidden" />)}
            {/* <hr /> */}
          </Card>
        ))}
        <FormItem {...formItemLayout}>
          <Link to={cancelRedirectUrl}>
            <Button type="default">Cancel</Button>
          </Link>
          &nbsp;
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
    );

    const recitalReflectionView = (
      <div>
        {recitalReflections.map((recitalReflection, index) => (
          <Card
            key={index}
            title={recitalReflection.recitalLogDetails.objectiveTitle}
            style={{ marginBottom: '10px' }}
          >
            <div>
              <b>Objective:</b>{' '}
              <Tooltip
                title={
                  recitalReflection.recitalLogDetails.customRecitalTitle +
                  ' ' +
                  recitalReflection.recitalLogDetails.lessonTitle
                }
              >
                {recitalReflection.recitalLogDetails.objectiveTitle}
              </Tooltip>
            </div>
            <div>
              <b>State:</b>{' '}
              {this.getStateContent(recitalReflection.recitalLogDetails.state)}
            </div>
            <div>
              <b>Comment:</b> {recitalReflection.comment}
            </div>
            <div>
              <b>Time Taken:</b> {recitalReflection.timeTaken || 'N/A'}
            </div>
            <div>
              <b>Assessment Comment:</b>{' '}
              {recitalReflection.assessmentComment || 'N/A'}
            </div>
          </Card>
        ))}
      </div>
    );

    return (
      <div style={{ marginTop: '20px' }}>
        <Row>
          <Col span={24}>
            {viewing ? recitalReflectionView : recitalReflectionForm}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(RecitalReflectionContainer);
