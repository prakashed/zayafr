import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Button, Select } from "antd";
import { debounce } from "lodash";

import { showNotification, extractErrorMessage } from "../../helpers";
import { fetchFilteredRecitalList } from "../../apis/recitals-api";

const { Option } = Select;

class AddCustomRecital extends Component {
  static propTypes = {
    // annualPlanId: PropTypes.string.isRequired,
    customRecitals: PropTypes.array,
    addCustomRecital: PropTypes.func,
    removeCustomRecital: PropTypes.func
  };

  static defaultProps = {
    customRecitals: [],
    addCustomRecital: () => {},
    removeCustomRecital: () => {}
  };

  constructor(props) {
    super(props);
    this.searchRecitals = debounce(this.searchRecitals, 750);
  }

  state = {
    recitals: [],
    selectedRecital: null,
    selectedInstruments: [],
    addingCustomRecital: false,
    searchingRecital: false
  };

  componentWillMount() {
    this.searchRecitals("");
  }

  setAddingState = flag => this.setState({ addingCustomRecital: flag });

  handleRecitalChange = recitalId => {
    const { recitals } = this.state;
    if (!recitalId || !recitals.length) {
      return;
    }
    const selectedRecital = recitals.find(r => r.id === recitalId);
    this.setState({ selectedRecital, selectedInstruments: [] });
  };

  handleInstrumentChange = value => {
    this.setState({ selectedInstruments: value });
  };

  addCustomRecital = () => {
    const { selectedRecital, selectedInstruments } = this.state;
    const { addedCustomRecital, annualPlanId } = this.props;

    // Call the API
    var newCustomRecitals = selectedInstruments.map(instrument => ({
      instrument,
      recital: selectedRecital.id,
      recitalTitle: selectedRecital.title,
      instrumentTitle: selectedRecital.instrumentsDetails.find(
        i => i.id === instrument
      ).title
    }));

    this.props.addCustomRecital(newCustomRecitals);
    newCustomRecitals = [];
    this.resetState();
  };

  cancelAddCustomRecital = () => {
    this.setState({
      selectedRecital: null,
      selectedInstruments: [],
      addingCustomRecital: false,
      searchingRecital: false
    });
  };

  filterInstruments = (selectedRecital, customRecitals, instrument) => {
    for (var j in customRecitals) {
      if (
        customRecitals[j].recital === selectedRecital.id &&
        instrument.id === customRecitals[j].instrument
      ) {
        return false;
      }
    }
    return true;
  };

  filteredInstruments = (selectedRecital, customRecitals) => {
    var instruments = selectedRecital.instrumentsDetails;
    return instruments.filter(
      this.filterInstruments.bind(this, selectedRecital, customRecitals)
    );
  };

  searchRecitals = value => {
    this.setState({
      searchingRecital: true
    });

    fetchFilteredRecitalList({ search: value })
      .then(response => {
        const { results: recitals } = response;
        this.setState({ recitals });
      })
      .finally(() => {
        this.setState({
          searchingRecital: false
        });
      });
  };

  resetState = () => {
    this.setState({
      selectedRecital: null,
      selectedInstruments: null,
      addingCustomRecital: false
    });
  };

  render() {
    const {
      addingCustomRecital,
      selectedRecital,
      selectedInstruments,
      searchingRecital,
      recitals
    } = this.state;

    const { customRecitals } = this.props;

    const addButtonIsDisabled =
      !selectedRecital || !selectedInstruments || !selectedInstruments.length;

    return (
      <div className="ant-row ant-form-item">
        {/* <div className="ant-col ant-col-8 ant-form-item-label"> */}
        <div className="ant-col ant-col-8 ant-form-item-label">
          <label>Recital-Instruments</label>
        </div>
        <div
          className="ant-col ant-col-12 ant-form-item-control-wrapper add-recital-instrument add-data-section"
          style={{ paddingTop: "10px" }}
        >
          {customRecitals.length ? (
            <ul>
              {customRecitals.map(customRecital => (
                <li key={customRecital.instrument + customRecital.recital}>
                  {customRecital.recitalTitle} - {customRecital.instrumentTitle}
                </li>
              ))}
            </ul>
          ) : null}

          {!addingCustomRecital ? (
            <div
              className="show-form-btn"
              role="presentation"
              onClick={() => this.setAddingState(true)}
              style={{ cursor: "pointer" }}
            >
              <Icon type="plus-circle-o" />
              <span>Add new recital</span>
            </div>
          ) : (
            <div className="selection-input">
              <Select
                showSearch
                placeholder="Select Recital"
                notFoundContent={
                  searchingRecital ? "Searching" : "No Recital Found"
                }
                filterOption={false}
                onChange={this.handleRecitalChange}
                onSearch={this.searchRecitals}
              >
                {recitals &&
                  recitals.map(r => (
                    <Option key={r.id} value={r.id}>
                      {r.title} - {r.musicalGradeTitle}
                    </Option>
                  ))}
              </Select>

              {selectedRecital && (
                <Select
                  mode="multiple"
                  placeholder="Select Instruments"
                  onChange={this.handleInstrumentChange}
                  value={selectedInstruments}
                  style={{ paddingTop: "5px" }}
                >
                  {selectedRecital &&
                    this.filteredInstruments(
                      selectedRecital,
                      customRecitals
                    ).map(i => (
                      <Option key={i.id} value={i.id}>
                        {i.title}
                      </Option>
                    ))}
                </Select>
              )}
              <div className="add-close-btns" style={{ paddingTop: "5px" }}>
                <Button
                  size="small"
                  disabled={addButtonIsDisabled}
                  onClick={this.addCustomRecital}
                  type="primary"
                >
                  Add
                </Button>
                <Button size="small" onClick={this.cancelAddCustomRecital}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        {/* </div> */}
      </div>
    );
  }
}

export default AddCustomRecital;
