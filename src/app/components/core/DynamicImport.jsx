import { Component } from 'react';
import PropTypes from 'prop-types';

class DynamicImport extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  }

  state = {
    component: null,
  }

  componentWillMount() {
    this.props.load()
      .then(mod => this.setState({
        component: mod.default,
      }));
  }

  render() {
    return this.props.children(this.state.component);
  }
}

export default DynamicImport;
