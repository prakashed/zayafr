import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { List, Select, Icon } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import {
  getCurriculumsListAction,
  getCurriculumsSearchAction,
  getNextBatchAction
} from '../../reducers/curriculums';
import { getMusicalGradesListAction } from '../../reducers/general';
import CurriculumDetailsContainer from '../curriculum/CurriculumDetailsContainer';
import AddEditRecitalContainer from '../curriculum/AddEditRecitalContainer';
import AddEditTheoryContainer from '../curriculum/AddEditTheoryContainer';
import routes from '../../constants/routes.json';
import permissionConfig from '../../constants/permission-config.json';
import LoadingMessage from '../misc/LoadingMessage';
import './Curriculums.less';
import SearchBar from '../misc/SearchBar';
import BackButton from '../misc/BackButton';
import AddNewEntity from '../core/AddNewEntity';
import InstrumentTag from '../misc/InstrumentTag';
import { LIST_STORE, NEXT_BATCH_URL_STORE } from '../../helpers/stateUtils';

const { Option } = Select;

const { entity: permissionEntity } = permissionConfig;

// Recital component

function NoMatch({}) {
  return (
    <div
      style={{
        fontSize: '14px',
        color: '#CFCACA',
        textAlign: 'center',
        width: '100%',
        fontStyle: 'italic'
      }}
    >
      Select a Recital/Theory to view.
    </div>
  );
}

function Recital({
  title,
  type,
  bars,
  musicalGradeTitle,
  instrumentsDetails,
  lessonCount,
  createdBy
}) {
  const instrumentTitles = instrumentsDetails.map(
    instrument => instrument.title
  );
  return (
    <div style={{ paddingRight: '60px' }}>
      <span className="title item-title">{title}</span>
      <div className="recital-details item-details">
        <span>Grade {musicalGradeTitle}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <span>{instrumentTitles.join(', ')}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <span>{bars} Bars</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <span>{_.capitalize(type)}</span>
      </div>
      {/* <div className="recital-instruments">
        {instrumentsDetails.map(instrument => (
          <InstrumentTag key={instrument.id} instrument={instrument} />
        ))}
      </div> */}
    </div>
  );
}

Recital.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  bars: PropTypes.number,
  lessonCount: PropTypes.number,
  musicalGradeTitle: PropTypes.string,
  instrumentsDetails: PropTypes.array,
  lessonsDetails: PropTypes.array,
  createdBy: PropTypes.string
};

Recital.defaultProps = {
  title: null,
  type: null,
  lessonCount: 0,
  curriculumCount: null
};

// Theory component

function Theory({ title, type, categoryCount, createdBy }) {
  return (
    <div style={{ paddingRight: '60px' }}>
      <span className="title item-title">{title}</span>
      <div className="recital-details item-details">
        <span>{_.capitalize(type)}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <span>No. of Categories: {categoryCount} </span>
      </div>
    </div>
  );
}

Recital.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  categoryCount: PropTypes.number,
  createdBy: PropTypes.string
};

Recital.defaultProps = {
  title: null,
  type: null,
  categoryCount: 0
};

function Curriculum({ curriculum, activeCurriculum, setActiveCurriculum }) {
  const { title, childType, properties } = curriculum;

  return (
    <List.Item
      className={`curriculum view-list-item ${
        activeCurriculum === curriculum.id ? 'active' : ''
      }`}
      onClick={() => setActiveCurriculum(curriculum.id)}
    >
      <div
        className={`badge ${
          childType.toLowerCase() === 'theory' ? 'yellow' : 'red'
        }`}
      >
        {childType}
      </div>
      {childType === 'recital' ? (
        <Recital
          title={curriculum.title}
          type={properties.type}
          bars={properties.bars}
          musicalGradeTitle={properties.musicalGradeTitle}
          instrumentsDetails={properties.instrumentsDetails}
          createdBy={properties.createdBy}
          lessonCount={properties.lessonCount}
          key={curriculum.id}
        />
      ) : (
        <Theory
          title={curriculum.title}
          type={properties.type}
          createdBy={properties.createdBy}
          key={curriculum.id}
          categoryCount={properties.categoryCount}
        />
      )}
    </List.Item>
  );
}

Curriculum.propTypes = {
  curriculum: PropTypes.shape({
    title: PropTypes.string
  }).isRequired,
  activeCurriculum: PropTypes.string,
  setActiveCurriculum: PropTypes.func
};

Curriculum.defaultProps = {
  curriculum: null,
  activeCurriculum: null,
  setActiveCurriculum: () => {}
};

class CurriculumsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCurriculum: null,
      searchText: '',
      childTypeFilter: '',
      toggleList: true
    };
  }
  componentDidMount() {
    this.props.getCurriculumsList();
    // this.props.getMusicalGrades();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;
    this.setState({
      activeCurriculum: id
    });
  }

  setActiveCurriculum = curriculumId => {
    const url = `${routes.curriculums}/${curriculumId}`;
    this.props.history.push(url);
    this.setState({
      activeCurriculum: curriculumId
    });
  };

  searchForCurriculums = searchText => {
    this.setState(
      {
        searchText
      },
      () => {
        // if (!searchText || !searchText.length) {
        // this.props.getCurriculumsList();
        // } else {
        this.filterCurriculumsList();
        // }
      }
    );
  };

  filterByChildType(childTypeFilter) {
    this.setState(
      {
        childTypeFilter
      },
      () => {
        this.filterCurriculumsList();
      }
    );
  }

  filterCurriculumsList() {
    const { searchText, childTypeFilter } = this.state;
    this.props.searchCurriculums({
      search: searchText,
      childType: childTypeFilter
    });
  }

  fetchNextBatch = () => {
    const { getNextBatch, nextBatchUrl } = this.props;
    getNextBatch(nextBatchUrl);
  };

  render() {
    const newRecitalLink = `${routes.curriculums}${routes.new_recital}`;
    const newTheoryLink = `${routes.curriculums}${routes.new_theory}`;
    const {
      curriculums,
      haveMoreCurriculums,
      curriculumCount,
      curriculumSearchCount
    } = this.props;
    const childTypes = [
      {
        id: 'recital',
        title: 'Recital'
      },
      {
        id: 'theory',
        title: 'Theory'
      }
    ];
    const { activeCurriculum, toggleList } = this.state;

    return (
      <div className="view-container">
        <div className="view-search-filters">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              marginRight: '15px'
            }}
          >
            <div style={{ width: '50%' }}>
              <SearchBar
                onSearch={this.searchForCurriculums}
                placeholder={
                  curriculumSearchCount && curriculumSearchCount !== 0
                    ? `Search from ${curriculumSearchCount} Curriculums...`
                    : `Search from ${curriculumCount} Curriculums...`
                }
                style={{ display: 'inline-block' }}
              />
            </div>
            <div style={{ marginLeft: '15px', width: '50%' }}>
              Type &nbsp;
              <Select
                defaultValue=""
                onChange={value => this.filterByChildType(value)}
                style={{ width: '100px' }}
              >
                <Option value="">All</Option>
                {childTypes &&
                  childTypes.map(g => (
                    <Option key={g.id} value={g.id}>
                      {g.title}
                    </Option>
                  ))}
              </Select>
            </div>
          </div>
          <div className="action-buttons">
            <AddNewEntity
              entityType={permissionEntity.curriculum}
              linkToAdd={newRecitalLink}
              hide={!!activeCurriculum}
              addNewText="Add Recital"
            />{' '}
            &nbsp;
            <AddNewEntity
              entityType={permissionEntity.curriculum}
              linkToAdd={newTheoryLink}
              hide={!!activeCurriculum}
              addNewText="Add Theory"
            />
            <BackButton link={routes.curriculums} hide={!activeCurriculum} />
          </div>
        </div>
        <div className="view-details">
          <div
            className={`view-details-list ${
              activeCurriculum ? 'hide' : 'show'
            } ${toggleList ? 'expand' : 'collapse'}`}
          >
            <div className="view-list-container curriculums-container">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.fetchNextBatch}
                hasMore={haveMoreCurriculums}
                loader={
                  <div className="loader" key={0}>
                    Loading ...
                  </div>
                }
                useWindow={false}
              >
                {_.isNull(curriculums) ? (
                  <LoadingMessage message="Fetching Curriculums..." />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={curriculums.toIndexedSeq().toArray()}
                    renderItem={curriculum => (
                      <Curriculum
                        curriculum={curriculum}
                        activeCurriculum={activeCurriculum}
                        setActiveCurriculum={this.setActiveCurriculum}
                      />
                    )}
                  />
                )}
              </InfiniteScroll>
            </div>
          </div>
          <div
            className={`view-details-container ${
              activeCurriculum ? 'show' : 'hide'
            } ${!toggleList ? 'expand' : 'collapse'}`}
          >
            <button
              className="expand-btn"
              onClick={() => this.setState({ toggleList: !toggleList })}
            >
              {' '}
              {toggleList ? (
                <Icon type="arrow-left" />
              ) : (
                <Icon type="arrow-right" />
              )}
            </button>
            <Switch>
              <Route
                exact
                path={`${routes.curriculums}${routes.new_recital}`}
                component={AddEditRecitalContainer}
              />
              <Route
                exact
                path={`${routes.curriculums}${routes.new_theory}`}
                component={AddEditTheoryContainer}
              />
              <Route
                exact
                path={`${routes.curriculums}/:curriculumId${
                  routes.edit_recital
                }`}
                component={AddEditRecitalContainer}
              />

              <Route
                exact
                path={`${routes.curriculums}/:curriculumId${
                  routes.edit_theory
                }`}
                component={AddEditTheoryContainer}
              />

              <Route
                path={`${routes.curriculums}/:curriculumId`}
                component={CurriculumDetailsContainer}
              />

              <Route component={NoMatch} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

CurriculumsContainer.propTypes = {
  curriculums: ImmutablePropTypes.map,
  haveMoreCurriculums: PropTypes.bool,
  nextBatchUrl: PropTypes.string,
  childTypes: ImmutablePropTypes.list,
  getCurriculumsList: PropTypes.func.isRequired,
  searchCurriculums: PropTypes.func.isRequired,
  getMusicalGrades: PropTypes.func.isRequired,
  getNextBatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({})
  }).isRequired
};

CurriculumsContainer.defaultProps = {
  curriculums: null,
  haveMoreCurriculums: false,
  nextBatchUrl: null,
  childTypes: null
};

function mapStateToProps(state) {
  const { general, curriculums } = state;
  const musicalGrades = general.get('musicalGrades');
  // debugger
  const curriculumsList = curriculums.get(LIST_STORE);
  const nextBatchUrl = curriculums.get(NEXT_BATCH_URL_STORE);
  const curriculumCount = curriculums.get('totalCount') || null;
  const curriculumSearchCount = curriculums.get('searchCount') || null;
  const haveMoreCurriculums = !!nextBatchUrl;
  return {
    curriculums: curriculumsList,
    curriculumCount,
    curriculumSearchCount,
    musicalGrades,
    haveMoreCurriculums,
    nextBatchUrl
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCurriculumsList: getCurriculumsListAction,
      searchCurriculums: getCurriculumsSearchAction,
      getNextBatch: getNextBatchAction,
      getMusicalGrades: getMusicalGradesListAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurriculumsContainer);
