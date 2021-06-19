import React, { Fragment, Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';

import { getCategoryListAction, getFilteredUnitListAction, clearFilteredUnitsAction, getBooksForInstrumentAction } from '../../reducers/general';
import { getRecitalsDetailsAction, deleteRecitalAction } from '../../reducers/recitals';
import RecitalDetails from './RecitalDetails';
import AddNewLesson from './AddNewLesson';
import AddNewStructuredLesson from './AddNewStructuredLesson';
import routes from '../../constants/routes.json';
import LoadingMessage from '../misc/LoadingMessage';
import { doHarlemShake } from '../../helpers';
import NotFoundError from '../misc/NotFoundError';

class RecitalDetailsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDefinedBookInstrumentModal: false,
      showCustomBookInstrumentModal: false,
      addLessonToInstrument: null,
      showDeleteModal: false,
      fetchingRecitalDetails: false,
    };
  }

  componentWillMount() {
    this.props.getCategoryList();
    // const { recitalId } = this.props.match.params;
    // this.props.getRecitalsDetails(recitalId);
  }

  componentWillReceiveProps(nextProps) {
    const { recital } = nextProps;
    const { recitalId } = nextProps.match.params;

    const { fetchingRecitalDetails } = this.state;
    const detailsLoaded = this.checkIfRecitalDetailsLoaded(recital);
    if (!detailsLoaded) {
      this.props.getRecitalsDetails(recitalId);
      // mark that we are fetching the details
      this.setState({ fetchingRecitalDetails: true });
    } else if (detailsLoaded && fetchingRecitalDetails) {
      // now the recital has been loaded, mark that request has been completed
      this.setState({ fetchingRecitalDetails: false });
    }

    if (recital && recital.title.toLowerCase().indexOf('harlem') > -1) {
      doHarlemShake();
    }
  }

  // Recital is loaded if recitalUnits are present
  checkIfRecitalDetailsLoaded = recital => !!recital && !!recital.recitalUnits

  showAddNewLesson(instrument) {
    const { bookType } = instrument;

    const { instrumentBooks, getBooksForInstrument } = this.props;
    const booksForInstrument = instrumentBooks && instrumentBooks[instrument.id];
    if (!booksForInstrument) {
      getBooksForInstrument(instrument.id);
    }

    this.setState({
      showCustomBookInstrumentModal: bookType !== 'defined_book',
      showDefinedBookInstrumentModal: bookType === 'defined_book',
      addLessonToInstrument: instrument,
    });
  }

  hideModal() {
    this.setState({
      showCustomBookInstrumentModal: false,
      showDefinedBookInstrumentModal: false,
    });

    const { filteredUnits } = this.props;

    if (filteredUnits) {
      this.props.clearFilteredUnits();
    }
  }

  deleteRecital() {
    this.hideConfirmDeleteModal();
    this.props.deleteRecital(this.props.recital.id);

    const indicesListingUrl = `${routes.recitals}`;
    this.props.history.push(indicesListingUrl);
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
    const {
      recital, categories, getFilteredUnitList, filteredUnits,
      instrumentBooks, clearFilteredUnits, recitalNotFound,
    } = this.props;

    if (recitalNotFound) return <NotFoundError message="Recital not found" />;

    if (_.isNull(recital)) {
      return <LoadingMessage message="Fetching Recital.." />;
    }

    const { recitalId } = this.props.match.params;

    const {
      addLessonToInstrument,
      showCustomBookInstrumentModal,
      showDefinedBookInstrumentModal,
    } = this.state;

    return (
      <Fragment>
        <RecitalDetails
          recital={recital}
          showAddNewLesson={instrument => this.showAddNewLesson(instrument)}
          deleteRecital={() => this.showConfirmDeleteModal()}
        />
        <AddNewLesson
          recitalId={recitalId}
          recitalTitle={recital.title}
          instrument={addLessonToInstrument}
          categories={categories}
          filteredUnits={filteredUnits}
          getFilteredUnitList={getFilteredUnitList}
          clearFilteredUnits={clearFilteredUnits}
          showAddLesson={showCustomBookInstrumentModal}
          hideModal={() => this.hideModal()}
        />
        <AddNewStructuredLesson
          recitalId={recitalId}
          recitalTitle={recital.title}
          instrument={addLessonToInstrument}
          filteredUnits={filteredUnits}
          getFilteredUnitList={getFilteredUnitList}
          clearFilteredUnits={clearFilteredUnits}
          showAddLesson={showDefinedBookInstrumentModal}
          hideModal={() => this.hideModal()}
          instrumentBooks={instrumentBooks}
        />
        <Modal
          title={`Delete ${recital.title}`}
          visible={this.state.showDeleteModal}
          onOk={() => this.deleteRecital()}
          onCancel={() => this.hideConfirmDeleteModal()}
          okText="Delete"
        >
          <p>
            Do you want to delete this recital?
          </p>
        </Modal>
      </Fragment>
    );
  }
}

RecitalDetailsContainer.propTypes = {
  recital: PropTypes.shape({
    id: PropTypes.string,
  }),
  recitalNotFound: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      recitalId: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  getCategoryList: PropTypes.func.isRequired,
  deleteRecital: PropTypes.func.isRequired,
  getRecitalsDetails: PropTypes.func.isRequired,
  getFilteredUnitList: PropTypes.func.isRequired,
  clearFilteredUnits: PropTypes.func.isRequired,
  getBooksForInstrument: PropTypes.func.isRequired,
  categories: ImmutablePropTypes.list,
  filteredUnits: ImmutablePropTypes.list,
  instrumentBooks: PropTypes.shape({}),
};

RecitalDetailsContainer.defaultProps = {
  recital: null,
  categories: null,
  filteredUnits: null,
  instrumentBooks: null,
  recitalNotFound: false,
};

function mapStateToProps(state, ownProps) {
  const { recitalId } = ownProps.match.params;
  const { recitals, general } = state;
  const recitalDetails = recitals.get('details');
  const recital = recitalDetails && recitalDetails.get(recitalId);
  const recitalNotFound = recitalDetails && !recital;
  const categories = general.get('categories');
  const filteredUnits = general.get('filteredUnits');
  const instrumentBooks = general.get('instrumentBooks');
  return {
    recital,
    recitalNotFound,
    categories,
    filteredUnits,
    instrumentBooks,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCategoryList: getCategoryListAction,
    getFilteredUnitList: getFilteredUnitListAction,
    clearFilteredUnits: clearFilteredUnitsAction,
    getRecitalsDetails: getRecitalsDetailsAction,
    getBooksForInstrument: getBooksForInstrumentAction,
    deleteRecital: deleteRecitalAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RecitalDetailsContainer);
