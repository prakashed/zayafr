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
  fetchTheoryLogs,
  fetchTheoryReflections,
  createTheoryReflection
} from '../../apis/dashboard-api';

const { Meta } = Card;

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class TheoryReflectionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theoryReflections: [],
      theoryLogs: [],
      loading: false,
      viewing: false
    };
  }

  getTheoryLogs(sessionId) {
    this.setState({
      loading: true
    });
    fetchTheoryLogs(sessionId).then(res => {
      this.setState({
        loading: false
      });
      this.setState({
        theoryLogs: res.results
      });
    });
  }

  getTheoryReflections(sessionId) {
    this.setState({
      loading: true
    });
    fetchTheoryReflections(sessionId).then(res => {
      this.setState({
        loading: false
      });
      this.setState({
        theoryReflections: res.results
      });
    });
  }

  componentWillMount() {
    const path = this.props.match.path;
    const sessionId = this.props.match.params.id;
    if (path === '/theory-reflection-add/:id?') {
      this.getTheoryLogs(sessionId);
    } else {
      this.setState({
        viewing: true
      });
      this.getTheoryReflections(sessionId);
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

        createTheoryReflection(data).then(res => {
          const url = `${routes.session}`;
          history.push(url);
        });
      }
    });
  };

  render() {
    const { theoryReflections, theoryLogs, editing } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    const cancelRedirectUrl = routes.session;

    const { viewing } = this.state;

    const theoryReflectionForm = (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        {theoryLogs.map((theoryLog, index) => (
          <Card key={index}>
            <Form.Item label="Category" {...formItemLayout}>
              <Tooltip title={theoryLog.theoryTitle}>
                <span className="ant-form-text">{theoryLog.categoryTitle}</span>{' '}
              </Tooltip>
            </Form.Item>
            <Form.Item label="State" {...formItemLayout}>
              <span className="ant-form-text">
                {this.getStateContent(theoryLog.state)}
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
            {getFieldDecorator(`data[${index}]['theory_log']`, {
              initialValue: theoryLog.id
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

    const theoryReflectionView = (
      <div>
        {theoryReflections.map((theoryReflection, index) => (
          <Card
            title={theoryReflection.theoryLogDetails.categoryTitle}
            style={{ marginBottom: '10px' }}
            key={index}
          >
            <div>
              <b>Objective:</b>{' '}
              <Tooltip title={theoryReflection.theoryLogDetails.theoryTitle}>
                {theoryReflection.theoryLogDetails.categoryTitle}
              </Tooltip>
            </div>
            <div>
              <b>State:</b>{' '}
              {this.getStateContent(theoryReflection.theoryLogDetails.state)}
            </div>
            <div>
              <b>Comment:</b> {theoryReflection.comment}
            </div>
            <div>
              <b>Time Taken:</b> {theoryReflection.timeTaken || 'N/A'}
            </div>
            <div>
              <b>Assessment Comment:</b>{' '}
              {theoryReflection.assessmentComment || 'N/A'}
            </div>
          </Card>
        ))}
      </div>
    );

    return (
      <div style={{ marginTop: '20px' }}>
        <Row>
          <Col span={24}>
            {viewing ? theoryReflectionView : theoryReflectionForm}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(TheoryReflectionContainer);
