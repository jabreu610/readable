import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories } from '../actions';
import { Navbar } from 'react-bootstrap';

class App extends Component {
  componentDidMount() {
    // this.props.fetchCategories();
    console.log(this.props)
  }
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a>Readable</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    test: dispatch(fetchCategories()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
