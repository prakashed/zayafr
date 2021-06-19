import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Select, notification } from 'antd';
import axios from 'axios';


import routes from '../../constants/routes.json';

const FormItem = Form.Item;
const { Option } = Select;

const instruments = [{
  id: 3,
  title: 'Recorder',
  description: '',
}, {
  id: 4,
  title: 'Ukulele',
  description: '',
}, {
  id: 6,
  title: 'Keyboard',
  description: '',
}, {
  id: 7,
  title: 'Piano',
  description: '',
}, {
  id: 8,
  title: 'Guitar',
  description: '',
}, {
  id: 9,
  title: 'Drums',
  description: '',
}, {
  id: 5,
  title: 'Theory',
  description: '',
}];

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      instruments: [],
      username: '',
      res: null,
      loading: false,
      contactNo: '',
    };
  }


  onSubmit = () => {
    const payload = {
      instruments: this.state.instruments,
      profile: {
        user: {
          username: this.state.username,
        },
        contactNo: this.state.contactNo,
      },
      schools: ['73395f9d-f7e4-4616-af3c-888c9b4956a8'],
      classses: [
        '1db30461-0472-41b9-bfb1-9cf05b2c4db1',
        '62fe86e5-17e3-4a36-a80e-95ceb5a48360',
        '04fb8cf3-c5af-4cf4-a73d-17c76e20404c',
        '420c5193-5705-4431-abe9-fc94bbc8b158',
        '03839ae1-3d1d-43b3-b4e7-4980be55ebeb',
        '6c0a1a00-d25a-4696-9af8-0fe345d3c9c6',
        '71920ba3-9cea-4a06-b7c2-438c2b53f898',
        'b4e3316e-70e7-43bb-b361-0d607508e3c0',
        'ce65129a-af49-42b0-9ccb-3571fd42bb8b',
        '44606e4d-46e6-41ac-92a6-25560b355aa2',
        '049aa5f5-e3a8-42f5-b7f9-0ecae5790fd3',
        '7cba3b04-8520-4da9-9d87-1bd3d224e754',
      ],
    };
    this.setState({ loading: true });
    axios.post(`${process.env.SERVER_URL}/teachers/`, payload).then((res) => {
      this.setState({ loading: false, res: res.data });
    }).catch(() => {
      this.setState({ loading: false });
      notification.error({
        message: 'Couldn\'t register',
        description: 'There was some problem from our side. Please try again later.',
      });
    });
  }

  handleChange = (value) => {
    this.setState({ instruments: value });
  }

  render() {
    return (
      <Row style={{ minHeight: '100%' }} type="flex" justify="center" align="middle">
        <Col span={5} md={5} sm={10} xs={22}>
          <h1>Register your demo account</h1>
          { this.state.res ? <p>Your username is "{this.state.username}" and password is "password". Go to <Link to={routes.login}>login</Link> and use this details.</p> : null }
          {/* <p>Need an O3 account? Sign up here</p> */}
          <FormItem style={{ marginBottom: 15 }} label="Username">
            <Input
              onChange={(e) => {
                this.setState({ username: e.target.value });
              }}
              value={this.state.username}
            />
          </FormItem>
          <FormItem style={{ marginBottom: 15 }} label="Mobile">
            <Input
              type="number"
              onChange={(e) => {
                this.setState({ contactNo: e.target.value });
              }}
              value={this.state.contactNo}
            />
          </FormItem>
          <FormItem style={{ marginBottom: 15 }} label="Instruments">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              value={this.state.instruments}
              onChange={this.handleChange}
            >
              {instruments.map(instrument => <Option key={instrument.id} value={instrument.id}>{instrument.title}</Option>)}
            </Select>
          </FormItem>
          <Button loading={this.state.loading} onClick={this.onSubmit}>Register</Button>
        </Col>
      </Row>
    );
  }
}
