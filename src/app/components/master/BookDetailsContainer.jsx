import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import routes from '../../constants/routes.json';
import { getBookDetailsAction, deleteBookAction } from '../../reducers/books';
import BookDetails from './BookDetails';
import LoadingMessage from '../misc/LoadingMessage';
import { DETAILS_STORE, ERROR_STORE } from '../../helpers/stateUtils';
import { is404Error } from '../../helpers/index';
import NotFoundError from '../misc/NotFoundError';

class BookDetailsContainer extends Component {
  state = {
    showDeleteModal: false,
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    const { errorInStore } = this.props;
    if (!errorInStore && id) {
      this.props.getBookDetails(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { book } = nextProps;
    const { id } = nextProps.match.params;
    const { id: oldId } = this.props.match.params;
    const bookDetailsLoaded = this.checkIfBookDetailsLoaded(book);
    if (!bookDetailsLoaded && oldId !== id) {
      this.props.getBookDetails(id);
    }
  }

  // Book is loaded if unit details are present
  checkIfBookDetailsLoaded = book => book && book.bookUnitsDetails

  deleteTheBook(id) {
    this.props.history.push(routes.books);
    this.props.deleteBook(id);
  }

  showConfirmDeleteModal() {
    this.setState({
      showDeleteModal: true,
    });
  }

  hideConfirmDeleteModal() {
    this.setState({
      showDeleteModal: false,
    });
  }

  render() {
    const { book, errorInStore } = this.props;

    if (!book && is404Error(errorInStore)) return <NotFoundError message="Book not found" />;

    if (_.isNull(book)) {
      return <LoadingMessage message="Fetching Book.." />;
    }

    return (
      <Fragment>
        <BookDetails book={book} deleteBook={() => this.showConfirmDeleteModal()} />
        <Modal
          title={`Delete ${book.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteTheBook(book.id)}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>
            Do you want to delete this book?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

BookDetailsContainer.propTypes = {
  book: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  getBookDetails: PropTypes.func.isRequired,
  deleteBook: PropTypes.func.isRequired,
  errorInStore: PropTypes.shape({}),
};

BookDetailsContainer.defaultProps = {
  book: null,
  errorInStore: null,
};

function mapStateToProps(state, ownProps) {
  const { id } = ownProps.match.params;
  const { books } = state;
  const bookDetails = books.get(DETAILS_STORE);
  const errorInStore = books.get(ERROR_STORE);

  const book = bookDetails && bookDetails.get(id);

  return {
    book,
    errorInStore,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getBookDetails: getBookDetailsAction,
    deleteBook: deleteBookAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BookDetailsContainer);
