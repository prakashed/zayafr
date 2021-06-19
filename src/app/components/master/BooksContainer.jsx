import React, { Fragment, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route } from 'react-router-dom';
import { List, Tag } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import routes from '../../constants/routes.json';
import BookDetailsContainer from './BookDetailsContainer';
import AddBookContainer from './AddBookContainer';
import { getBooksAction, getSearchBooksAction, getNextBatchAction } from '../../reducers/books';
import permissionConfig from '../../constants/permission-config.json';
import LoadingMessage from '../misc/LoadingMessage';
import { LIST_STORE, NEXT_BATCH_URL_STORE } from '../../helpers/stateUtils';
import SearchBar from '../misc/SearchBar';
import BackButton from '../misc/BackButton';
import AddNewEntity from '../core/AddNewEntity';

const { entity: permissionEntity } = permissionConfig;

function Book({ book, setActive, activeItemId }) {
  const {
    id, title, instrumentDetails, musicalGradesDetails,
  } = book;

  const { title: instrumentName } = instrumentDetails;

  const musicalGradeText = musicalGradesDetails.map(m =>
    (<Fragment key={m.id}>Grade { m.title } </Fragment>));

  return (
    <List.Item className={`book-item view-list-item ${activeItemId === id ? 'active' : ''}`} onClick={() => setActive(id)}>
      <h2 className="book-name item-title">{ title }</h2>
      <div className="book-details item-details" style={{ marginTop: '6px' }}>
        <span>
          <Tag key={instrumentDetails.id} color={instrumentDetails.color}>{ instrumentName }</Tag>
        </span>
        <span>{ musicalGradeText }</span>
      </div>
    </List.Item>
  );
}

Book.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  activeItemId: PropTypes.string,
  setActive: PropTypes.func,
};

Book.defaultProps = {
  activeItemId: null,
  setActive: () => {},
};

class BooksContainer extends Component {
  state = {
    activeItemId: null,
  }

  componentDidMount() {
    this.props.getBooks();
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;
    this.setState({
      activeItemId: id,
    });
  }

  setActive = (itemId) => {
    const url = `${routes.books}/${itemId}`;
    this.props.history.push(url);
    // this.setState({
    //   activeItemId: itemId,
    // });
  }

  search = (text) => {
    if (!text || !text.length) {
      this.props.getBooks();
    } else {
      this.props.searchBooks({ search: text });
    }
  }

  fetchNextBatch = () => {
    const { getNextBatch, nextBatchUrl } = this.props;
    getNextBatch(nextBatchUrl);
  }

  render() {
    const newItemLink = `${routes.books}${routes.new}`;
    const { books, haveMoreBooks } = this.props;
    const { activeItemId } = this.state;

    return (
      <div className="view-container">
        <div className="action-buttons">
          <AddNewEntity
            entityType={permissionEntity.book}
            linkToAdd={newItemLink}
            hide={!!activeItemId}
          />
          <BackButton link={routes.books} hide={!activeItemId} />
        </div>
        <div className="view-details">
          <div className={`view-details-list ${activeItemId ? 'hide' : 'show'}`} style={{ width: '30%', paddingRight: '10px' }}>
            <div className="view-search-filters">
              <div className="view-search">
                <SearchBar onSearch={this.search} placeholder="Search Books.." />
              </div>
            </div>
            <div className="view-list-container books-container">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.fetchNextBatch}
                hasMore={haveMoreBooks}
                loader={<div className="loader" key={0}>Loading ...</div>}
                useWindow={false}
              >
                {
                  _.isNull(books) ?
                    <LoadingMessage message="Fetching Books.." />
                  :
                    <List
                      itemLayout="horizontal"
                      dataSource={books.toIndexedSeq().toArray()}
                      renderItem={book =>
                      (<Book
                        book={book}
                        activeItemId={activeItemId}
                        setActive={this.setActive}
                      />)}
                    />
                }
              </InfiniteScroll>
            </div>
          </div>
          <div className={`view-details-container ${activeItemId ? 'show' : 'hide'}`} style={{ width: '70%' }}>
            <Switch>
              <Route exact path={`${routes.books}${routes.new}`} component={AddBookContainer} />
              <Route path={`${routes.books}/:id`} component={BookDetailsContainer} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

BooksContainer.propTypes = {
  books: ImmutablePropTypes.map,
  haveMoreBooks: PropTypes.bool,
  nextBatchUrl: PropTypes.string,
  getNextBatch: PropTypes.func.isRequired,
  getBooks: PropTypes.func.isRequired,
  searchBooks: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
    }),
  }).isRequired,
};

BooksContainer.defaultProps = {
  books: null,
  haveMoreBooks: false,
  nextBatchUrl: null,
};

function mapStateToProps(state) {
  const { books } = state;
  const bookList = books.get(LIST_STORE);
  const nextBatchUrl = books.get(NEXT_BATCH_URL_STORE);
  const haveMoreBooks = !!nextBatchUrl;
  return {
    books: bookList,
    haveMoreBooks,
    nextBatchUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getBooks: getBooksAction,
    searchBooks: getSearchBooksAction,
    getNextBatch: getNextBatchAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BooksContainer);
