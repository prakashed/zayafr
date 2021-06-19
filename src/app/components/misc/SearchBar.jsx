import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class SearchBar extends Component {
  state = {
    searchText: '',
  }

  setSearchText = (e) => {
    const searchText = e.target.value;
    this.setState({
      searchText,
    });
  }

  inputStyle = {
    width: '100%',
    borderRadius: '4px',
    boxShadow: 'none',
    outline: 'none',
    border: '1px solid lightgray',
    padding: '2px 6px',
  }

  doSearch = _.debounce(() => {
    const { searchText } = this.state;
    this.props.onSearch(searchText.trim());
  }, 750);

  render() {
    const { searchText } = this.state;
    const { placeholder } = this.props;
    return (<input
      style={this.inputStyle}
      onKeyUp={this.doSearch}
      value={searchText}
      onChange={this.setSearchText}
      placeholder={placeholder}
    />);
  }
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: 'Search..',
};
