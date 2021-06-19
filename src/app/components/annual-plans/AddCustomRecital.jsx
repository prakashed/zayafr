import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Select } from 'antd';
import { debounce } from 'lodash';

import { createCustomRecital } from '../../apis/annual-lesson-plan-api';
import { showNotification, extractErrorMessage } from '../../helpers';
import { fetchFilteredRecitalList } from '../../apis/recitals-api';

const { Option } = Select;

class AddCustomRecital extends Component {
  static propTypes = {
    annualPlanId: PropTypes.string.isRequired,
    addedCustomRecital: PropTypes.func,
  }

  static defaultProps = {
    addedCustomRecital: () => {},
  }

  constructor(props) {
    super(props);

    this.searchRecitals = debounce(this.searchRecitals, 750);
  }

  state = {
    recitals: [],
    selectedRecital: null,
    selectedInstruments: [],
    addingCustomRecital: false,
    searchingRecital: false,
  }

  componentWillMount() {
    this.searchRecitals('');
  }

  setAddingState = flag => this.setState({ addingCustomRecital: flag });

  handleRecitalChange = (recitalId) => {
    const { recitals } = this.state;
    if (!recitalId || !recitals.length) {
      // console.log('Invalid/missing data --> ', recitalId, this.props.recitals);
      return;
    }
    const selectedRecital = recitals.find(r => r.id === recitalId);
    this.setState({ selectedRecital, selectedInstruments: [] });
  }

  handleInstrumentChange = value => this.setState({ selectedInstruments: value });

  addCustomRecital = () => {
    const { selectedRecital, selectedInstruments } = this.state;
    const { addedCustomRecital, annualPlanId } = this.props;
    // Call the API
    const apiPayload = selectedInstruments.map(instrument =>
      ({ instrument, annual_plan: annualPlanId, recital: selectedRecital.id }));

    showNotification({ text: 'Adding Custom Recital', type: 'loading' });
    createCustomRecital(apiPayload)
      .then((newCustomRecital) => {
      // after success of the API, send the created custom recital to parent
      // call addedCustomRecital
        addedCustomRecital(newCustomRecital);
        this.resetState();

        showNotification({ text: 'Added!', type: 'success' });
      })
      .catch((err) => {
        const errorMessage = extractErrorMessage(err);
        showNotification({ text: errorMessage || 'Error while adding custom recital', type: 'error' });
      });
  }

  cancelAddCustomRecital = () => {
    this.setState({
      selectedRecital: null,
      selectedInstruments: [],
      addingCustomRecital: false,
      searchingRecital: false,
    });
  }

  searchRecitals = (value) => {
    this.setState({
      searchingRecital: true,
    });

    fetchFilteredRecitalList({ search: value, musicalGrade: '' })
      .then((response) => {
        const { results: recitals } = response;
        this.setState({ recitals });
      })
      .finally(() => {
        this.setState({
          searchingRecital: false,
        });
      });
  }

  resetState = () => {
    this.setState({
      selectedRecital: null,
      selectedInstruments: null,
      addingCustomRecital: false,
    });
  }

  render() {
    const {
      addingCustomRecital,
      selectedRecital,
      selectedInstruments,
      searchingRecital,
      recitals,
    } = this.state;

    const addButtonIsDisabled = !selectedRecital
                                || !selectedInstruments || !selectedInstruments.length;

    return (
      <div className="add-recital-instrument add-data-section">
        {
          !addingCustomRecital ?
          (
            <div className="show-form-btn" role="presentation" onClick={() => this.setAddingState(true)}>
              <Icon type="plus-circle-o" />
              <span>Add new recital</span>
            </div>
          ) : (
            <div className="selection-input">
              <Select
                showSearch
                placeholder="Select Recital"
                notFoundContent={searchingRecital ? 'Searching' : 'No Recital Found'}
                filterOption={false}
                onChange={this.handleRecitalChange}
                onSearch={this.searchRecitals}
              >
                {
                    recitals && recitals.map(r =>
                    (
                      <Option key={r.id} value={r.id}>
                        {r.title}
                      </Option>))
                  }
              </Select>
              {
                selectedRecital &&
                (
                <Select
                  mode="multiple"
                  placeholder="Select Instruments"
                  onChange={this.handleInstrumentChange}
                  value={selectedInstruments}
                >
                  {
                    selectedRecital && selectedRecital.instrumentDetails.map(i =>
                    (
                      <Option key={i.id} value={i.id}>
                        {i.title}
                      </Option>))
                  }
                </Select>)}
              <div className="add-close-btns">
                <Button size="small" disabled={addButtonIsDisabled} onClick={this.addCustomRecital} type="primary">Add</Button>
                <Button size="small" onClick={this.cancelAddCustomRecital}>Cancel</Button>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default AddCustomRecital;
