import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Route extends Component {
	constructor(props) {
    super(props);
    this.state = {};

    this.renderPage = this.renderPage.bind(this);
  }

  renderPage() {
    let Page = React.createElement(this.props.component, {
        spine: this.props.spine
    });

    return Page;
  }

	render() {
    return this.renderPage();
	}
}

Route.propTypes = {
  spine: PropTypes.object,
  component: PropTypes.func,
}
Route.defaultProps = {
  
}