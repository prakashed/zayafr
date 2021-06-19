import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import _ from "lodash";
import { Row, Col, Card, Avatar, Button, Pagination } from "antd";
import InfiniteScroll from "react-infinite-scroller";

import Session from "./Session";
import {
  fetchFilteredSessionList,
  fetchSessionList
} from "../../apis/dashboard-api";

import { getApi } from "../../apis";
import SearchBar from "../misc/SearchBar";

const { Meta } = Card;

class SessionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
      loading: false,
      count: null,
      search: ""
    };
  }

  getSessions(search = "", page = 0, pageSize = 25) {
    this.setState({
      loading: true,
      search: search
    });
    const limit = pageSize;
    const offset = pageSize * (page - 1);
    fetchSessionList(search, limit, offset).then(res => {
      this.setState({
        count: res.count,
        sessions: res.results,
        loading: false
      });
    });
  }

  getNextBatch(page, pageSize) {
    this.getSessions(this.state.search, page, pageSize);
  }

  componentWillMount() {
    this.getSessions();
  }

  render() {
    const { sessions, loading, count, nextBatchUrl } = this.state;
    const loader = <div className="loader">Loading ...</div>;
    return (
      <div style={{ marginTop: "20px" }}>
        <Row>
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                marginRight: "15px"
              }}
            >
              <div style={{ width: "50%" }}>
                <SearchBar
                  onSearch={search => this.getSessions(search)}
                  placeholder="Search by School Name.."
                  style={{ display: "inline-block" }}
                />
              </div>
            </div>

            {/* <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.getNextBatch}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            > */}

            <Session sessionData={sessions} loading={loading} />
            <div className="center" style={{ padding: "20px" }}>
              <Pagination
                defaultCurrent={1}
                total={count}
                pageSize={25}
                onChange={(page, pageSize) => this.getNextBatch(page, pageSize)}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SessionContainer;
