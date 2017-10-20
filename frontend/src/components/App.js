import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories, fetchPosts } from '../actions';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Grid, Row, Col, Button, ListGroup, ListGroupItem, FormControl } from 'react-bootstrap';
import moment from 'moment';

class App extends Component {
  state = {
    sort: "voteScore"
  };
  componentDidMount() {
    this.props.fetchCategories();
    this.props.fetchPosts();
  }
  handleSortChange = (e) => {
    this.setState({
      sort: e.target.value,
    });
  }
  sortByVoteScore = (a, b) => {
     return b.voteScore - a.voteScore;
  }
  sortByTimestamp = (a, b) => {
     return b.timestamp - a.timestamp;
  }
  render() {
    const { categories, posts } = this.props;
    const { sort } = this.state;
    let sortFunction;
    if (sort === "voteScore") {
      sortFunction = this.sortByVoteScore;
    }
    if (sort === "date") {
      sortFunction = this.sortByTimestamp;
    }
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a>Readable</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid>
          <Row>
            <Col xs={3}>
              <h3>Categories</h3>
              <ListGroup>
                {categories.map(category => (
                  <ListGroupItem key={category.name}>
                    {category.name}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
            <Col xs={9}>
              <Row>
                <Col xs={6}>
                  <h3>Posts</h3>
                </Col>
                <Col xs={4}>
                  <FormControl
                    value={sort}
                    onChange={this.handleSortChange}
                    className="sort-select"
                    componentClass="select"
                  >
                    <option value="voteScore">Sort by Vote Score</option>
                    <option value="date">Sort by Date</option>
                  </FormControl>
                </Col>
                <Col xs={2}>
                  <Button className="new-post-btn" bsStyle="primary">
                    New Post
                  </Button>
                </Col>
              </Row>
              <ListGroup>
                {posts.sort((a, b) => sortFunction(a, b)).map(post => (
                  <ListGroupItem key={post.id} header={`${post.title} - ${moment(post.timestamp).format('MMM DD, YYYY hh:mma')}`}>
                    {post.body}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
    posts: state.posts,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCategories: () => dispatch(fetchCategories()),
    fetchPosts: () => dispatch(fetchPosts()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
