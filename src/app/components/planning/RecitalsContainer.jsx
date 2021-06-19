import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { List, Select } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { getRecitalsListAction, getRecitalsSearchAction, getNextBatchAction } from '../../reducers/recitals';
import { getMusicalGradesListAction } from '../../reducers/general';
import RecitalDetailsContainer from './RecitalDetailsContainer';
import AddEditRecitalContainer from './AddEditRecitalContainer';
import routes from '../../constants/routes.json';
import permissionConfig from '../../constants/permission-config.json';
import LoadingMessage from '../misc/LoadingMessage';
import './Recitals.less';
import SearchBar from '../misc/SearchBar';
import BackButton from '../misc/BackButton';
import AddNewEntity from '../core/AddNewEntity';
import InstrumentTag from '../misc/InstrumentTag';
import { LIST_STORE, NEXT_BATCH_URL_STORE } from '../../helpers/stateUtils';

const { Option } = Select;

const { entity: permissionEntity } = permissionConfig;

function Recital({ recital, activeRecital, setActiveRecital }) {
  const {
    title, bars,
    instrumentDetails,
    musicalGradeTitle,
  } = recital;

  return (
    <List.Item className={`recital view-list-item ${activeRecital === recital.id ? 'active' : ''}`} onClick={() => setActiveRecital(recital.id)}>
      <h2 className="title item-title">{ title }</h2>
      <div className="recital-details item-details">
        <span>Grade { musicalGradeTitle }</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <span>{ bars } Bars</span>
      </div>
      <div className="recital-instruments">
        { instrumentDetails.map(instrument =>
          <InstrumentTag key={instrument.id} instrument={instrument} />) }
      </div>
    </List.Item>
  );
}

Recital.propTypes = {
  recital: PropTypes.shape({
    title: PropTypes.string,
    bars: PropTypes.number,
    musicalGradeTitle: PropTypes.string,
  }).isRequired,
  activeRecital: PropTypes.string,
  setActiveRecital: PropTypes.func,
};

Recital.defaultProps = {
  activeRecital: null,
  setActiveRecital: () => {},
};

class RecitalsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRecital: null,
      searchText: '',
      musicalGradeFilter: '',
    };
  }
  componentDidMount() {
    this.props.getRecitalsList();
    this.props.getMusicalGrades();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;
    this.setState({
      activeRecital: id,
    });
  }

  setActiveRecital = (recitalId) => {
    const url = `${routes.recitals}/${recitalId}`;
    this.props.history.push(url);
    // this.setState({
    //   activeRecital: recitalId,
    // });
  }

  searchForRecitals = (searchText) => {
    this.setState({
      searchText,
    }, () => {
      if (!searchText || !searchText.length) {
        this.props.getRecitalsList();
      } else {
        this.filterRecitalsList();
      }
    });
  }

  filterRecitalsByMusicalGrade(musicalGradeFilter) {
    this.setState({
      musicalGradeFilter,
    }, () => {
      this.filterRecitalsList();
    });
  }

  filterRecitalsList() {
    const { searchText, musicalGradeFilter } = this.state;
    this.props.searchRecitals({
      search: searchText,
      musicalGrade: musicalGradeFilter,
    });
  }

  fetchNextBatch = () => {
    const { getNextBatch, nextBatchUrl } = this.props;
    getNextBatch(nextBatchUrl);
  }

  render() {
    const newItemLink = `${routes.recitals}${routes.new}`;
    const { recitals, haveMoreRecitals, musicalGrades } = this.props;
    const { activeRecital } = this.state;

    return (
      <div className="view-container">
        <div className="action-buttons">
          <AddNewEntity
            entityType={permissionEntity.recital}
            linkToAdd={newItemLink}
            hide={!!activeRecital}
          />
          <BackButton link={routes.recitals} hide={!activeRecital} />
        </div>
        <div className="view-details">
          <div className={`view-details-list ${activeRecital ? 'hide' : 'show'}`}>
            <div className="view-search-filters">
              <div className="view-search">
                {/* <Search onSearch={this.searchForRecitals} placeholder="Search" /> */}
                <SearchBar onSearch={this.searchForRecitals} placeholder="Search Recitals.." />
              </div>
              <div className="view-filters">
                <Select defaultValue="" onChange={value => this.filterRecitalsByMusicalGrade(value)}>
                  <Option value="">All musicalGrades</Option>
                  {
                    musicalGrades &&
                      musicalGrades.map(g => <Option key={g.id} value={g.id}>{g.title}</Option>)
                  }
                </Select>
              </div>
            </div>
            <div className="view-list-container recitals-container">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.fetchNextBatch}
                hasMore={haveMoreRecitals}
                loader={<div className="loader" key={0}>Loading ...</div>}
                useWindow={false}
              >
                {
                  _.isNull(recitals) ?
                    <LoadingMessage message="Fetching Recitals..." />
                  :
                    <List
                      itemLayout="horizontal"
                      dataSource={recitals.toIndexedSeq().toArray()}
                      renderItem={recital =>
                      (<Recital
                        recital={recital}
                        activeRecital={activeRecital}
                        setActiveRecital={this.setActiveRecital}
                      />)}
                    />
                }
              </InfiniteScroll>

            </div>
          </div>
          <div className={`view-details-container ${activeRecital ? 'show' : 'hide'}`}>
            <Switch>
              <Route exact path={`${routes.recitals}${routes.new}`} component={AddEditRecitalContainer} />
              <Route exact path={`${routes.recitals}/:recitalId${routes.edit}`} component={AddEditRecitalContainer} />
              <Route path={`${routes.recitals}/:recitalId`} component={RecitalDetailsContainer} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

RecitalsContainer.propTypes = {
  recitals: ImmutablePropTypes.map,
  haveMoreRecitals: PropTypes.bool,
  nextBatchUrl: PropTypes.string,
  musicalGrades: ImmutablePropTypes.list,
  getRecitalsList: PropTypes.func.isRequired,
  searchRecitals: PropTypes.func.isRequired,
  getMusicalGrades: PropTypes.func.isRequired,
  getNextBatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
    }),
  }).isRequired,
};

RecitalsContainer.defaultProps = {
  recitals: null,
  haveMoreRecitals: false,
  nextBatchUrl: null,
  musicalGrades: null,
};

function mapStateToProps(state) {
  const { general, recitals } = state;
  const musicalGrades = general.get('musicalGrades');
  const recitalsList = recitals.get(LIST_STORE);
  const nextBatchUrl = recitals.get(NEXT_BATCH_URL_STORE);
  const haveMoreRecitals = !!nextBatchUrl;
  return {
    recitals: recitalsList,
    musicalGrades,
    haveMoreRecitals,
    nextBatchUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getRecitalsList: getRecitalsListAction,
    searchRecitals: getRecitalsSearchAction,
    getNextBatch: getNextBatchAction,
    getMusicalGrades: getMusicalGradesListAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RecitalsContainer);
